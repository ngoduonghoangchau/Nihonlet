using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Subscription.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Queries;

public record GetPendingPaymentQuery : IRequest<PendingPaymentDto?>;

public class GetPendingPaymentQueryHandler : IRequestHandler<GetPendingPaymentQuery, PendingPaymentDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetPendingPaymentQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PendingPaymentDto?> Handle(GetPendingPaymentQuery query, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        // Find pending transaction within 15-minute window
        var transaction = await _context.Transactions
            .Where(t => t.UserId == userId
                && t.Status == TransactionStatus.Pending
                && t.CreatedAt > DateTime.UtcNow.AddMinutes(-15))
            .OrderByDescending(t => t.CreatedAt)
            .FirstOrDefaultAsync(ct);

        // No pending transaction found
        if (transaction == null)
            return null;

        // Auto-expire if transaction is older than 15 minutes
        if (transaction.CreatedAt < DateTime.UtcNow.AddMinutes(-15))
        {
            transaction.Status = TransactionStatus.Expired;
            await _context.SaveChangesAsync(ct);
            return null;
        }

        // Calculate remaining time
        var elapsed = (DateTime.UtcNow - transaction.CreatedAt).TotalSeconds;
        var remainingSeconds = (int)Math.Max(0, (15 * 60) - elapsed);

        // If no time remaining, don't restore session
        if (remainingSeconds <= 0)
        {
            transaction.Status = TransactionStatus.Expired;
            await _context.SaveChangesAsync(ct);
            return null;
        }

        // Return pending payment info for session restoration
        return new PendingPaymentDto
        {
            TransactionId = transaction.TransId,
            OrderCode = transaction.OrderCode ?? string.Empty,
            PaymentUrl = string.Empty, // PayOS URL would need to be regenerated or stored
            Amount = transaction.Amount,
            CreatedAt = transaction.CreatedAt,
            RemainingSeconds = remainingSeconds
        };
    }
}
