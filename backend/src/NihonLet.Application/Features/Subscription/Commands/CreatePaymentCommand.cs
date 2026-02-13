using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Subscription.DTOs;
using NihonLet.Domain.BusinessRules.Core;
using NihonLet.Domain.Entities.Billing;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Commands;

public record CreatePaymentCommand(int PlanId) : IRequest<PaymentLinkDto>;

public class CreatePaymentCommandHandler : IRequestHandler<CreatePaymentCommand, PaymentLinkDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPayOsService _payOsService;

    public CreatePaymentCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPayOsService payOsService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _payOsService = payOsService;
    }

    public async Task<PaymentLinkDto> Handle(CreatePaymentCommand command, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        // Verify plan exists
        var plan = await _context.SubscriptionPlans
            .FirstOrDefaultAsync(p => p.PlanId == command.PlanId, ct)
            ?? throw new NotFoundException("SubscriptionPlan", command.PlanId);

        // Check if user already has active subscription
        var existingSub = await _context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == SubscriptionStatus.Active, ct);

        if (existingSub != null)
        {
            throw new BusinessRuleException(new BusinessRuleViolation(
                "SUB_001",
                "User already has an active subscription",
                "Bạn đã có gói Premium đang hoạt động."));
        }

        // Check for pending transactions to avoid duplicate payments
        var pendingTransaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.UserId == userId
                && t.Status == TransactionStatus.Pending
                && t.CreatedAt > DateTime.UtcNow.AddMinutes(-15), ct);

        if (pendingTransaction != null)
        {
            throw new BusinessRuleException(new BusinessRuleViolation(
                "SUB_002",
                "User has a pending payment",
                "Bạn có giao dịch đang chờ xử lý. Vui lòng hoàn tất hoặc chờ hết thời gian."));
        }

        // Create pending transaction
        var transaction = new Transaction
        {
            UserId = userId,
            PlanId = plan.PlanId,
            Amount = plan.Price,
            Status = TransactionStatus.Pending
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(ct);

        // Create payment link via PayOS
        var (paymentUrl, orderCode) = await _payOsService.CreatePaymentLinkAsync(
            userId, plan.Price, $"NihonLet Premium - {plan.PlanName}");

        // Update transaction with order code
        transaction.OrderCode = orderCode;
        await _context.SaveChangesAsync(ct);

        return new PaymentLinkDto
        {
            TransactionId = transaction.TransId,
            OrderCode = orderCode,
            PaymentUrl = paymentUrl,
            Amount = plan.Price
        };
    }
}
