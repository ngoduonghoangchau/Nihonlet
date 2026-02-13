using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Constants;
using NihonLet.Domain.Entities.Billing;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Commands;

public record ProcessPayOsWebhookCommand(string RawBody) : IRequest<bool>;

public class ProcessPayOsWebhookCommandHandler
    : IRequestHandler<ProcessPayOsWebhookCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;
    private readonly IPayOsService _payOsService;

    public ProcessPayOsWebhookCommandHandler(
        IApplicationDbContext context,
        IIdentityService identityService,
        IPayOsService payOsService)
    {
        _context = context;
        _identityService = identityService;
        _payOsService = payOsService;
    }

    public async Task<bool> Handle(ProcessPayOsWebhookCommand command, CancellationToken ct)
    {
        // 1. Verify webhook signature
        var result = await _payOsService.VerifyWebhookAsync(command.RawBody);
        if (result is null)
            return false;

        // 2. Find transaction by OrderCode
        var transaction = await _context.Transactions
            .Include(t => t.Plan)
            .FirstOrDefaultAsync(t => t.OrderCode == result.OrderCode, ct);

        if (transaction is null)
            return false;

        // 3. Idempotency: if already processed
        if (transaction.Status == TransactionStatus.Success)
            return true;
        if (transaction.Status != TransactionStatus.Pending)
            return false;

        if (result.IsSuccess)
        {
            // 4. Double-verify by querying PayOS API directly
            var confirmed = await _payOsService.ConfirmPaymentAsync(result.OrderCode);
            if (!confirmed)
                return false;

            // 5. Update transaction
            transaction.Status = TransactionStatus.Success;
            transaction.PaidAt = DateTime.UtcNow;

            // 6. Create subscription
            var subscription = new UserSubscription
            {
                UserId = transaction.UserId,
                PlanId = transaction.PlanId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(transaction.Plan.DurationDays),
                Status = SubscriptionStatus.Active
            };

            _context.UserSubscriptions.Add(subscription);

            // 7. Assign Premium role
            await _identityService.AddToRoleAsync(transaction.UserId, Roles.Premium);

            await _context.SaveChangesAsync(ct);
            return true;
        }
        else
        {
            transaction.Status = TransactionStatus.Failed;
            await _context.SaveChangesAsync(ct);
            return false;
        }
    }
}
