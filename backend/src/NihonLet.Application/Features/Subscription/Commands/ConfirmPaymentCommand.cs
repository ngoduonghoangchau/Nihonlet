using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Constants;
using NihonLet.Domain.Entities.Billing;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Commands;

public record ConfirmPaymentCommand(string OrderCode, string Status) : IRequest<bool>;

public class ConfirmPaymentCommandHandler : IRequestHandler<ConfirmPaymentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly IPayOsService _payOsService;

    public ConfirmPaymentCommandHandler(
        IApplicationDbContext context,
        IIdentityService identityService,
        IPayOsService payOsService)
    {
        _context = context;
        _identityService = identityService;
        _payOsService = payOsService;
    }

    public async Task<bool> Handle(ConfirmPaymentCommand command, CancellationToken ct)
    {
        // Find transaction by OrderCode
        var transaction = await _context.Transactions
            .Include(t => t.Plan)
            .FirstOrDefaultAsync(t => t.OrderCode == command.OrderCode, ct)
            ?? throw new NotFoundException("Transaction", command.OrderCode);

        // Idempotency: if already processed, return current state
        if (transaction.Status == TransactionStatus.Success)
            return true;

        if (transaction.Status != TransactionStatus.Pending)
            return false;

        if (command.Status == "Success")
        {
            // Verify via PayOS service
            var confirmed = await _payOsService.ConfirmPaymentAsync(command.OrderCode);
            if (!confirmed)
                return false;

            // Update transaction
            transaction.Status = TransactionStatus.Success;
            transaction.PaidAt = DateTime.UtcNow;

            // Create subscription
            var subscription = new UserSubscription
            {
                UserId = transaction.UserId,
                PlanId = transaction.PlanId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(transaction.Plan.DurationDays),
                Status = SubscriptionStatus.Active
            };

            _context.UserSubscriptions.Add(subscription);

            // Assign Premium role
            await _identityService.AddToRoleAsync(transaction.UserId, Roles.Premium);

            await _context.SaveChangesAsync(ct);
            return true;
        }
        else
        {
            // Payment failed
            transaction.Status = TransactionStatus.Failed;
            await _context.SaveChangesAsync(ct);
            return false;
        }
    }
}
