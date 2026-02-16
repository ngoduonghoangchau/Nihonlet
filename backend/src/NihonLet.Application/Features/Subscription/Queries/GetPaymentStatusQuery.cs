using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Queries;

public record GetPaymentStatusQuery(string OrderCode) : IRequest<string>;

public class GetPaymentStatusQueryHandler : IRequestHandler<GetPaymentStatusQuery, string>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPayOsService _payOsService;

    public GetPaymentStatusQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPayOsService payOsService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _payOsService = payOsService;
    }

    public async Task<string> Handle(GetPaymentStatusQuery query, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.OrderCode == query.OrderCode && t.UserId == userId, ct)
            ?? throw new NotFoundException("Transaction", query.OrderCode);

        // Auto-expire transactions older than 15 minutes
        if (transaction.Status == TransactionStatus.Pending
            && transaction.CreatedAt < DateTime.UtcNow.AddMinutes(-15))
        {
            transaction.Status = TransactionStatus.Expired;
            await _context.SaveChangesAsync(ct);
            return TransactionStatus.Expired.ToString();
        }

        // For pending transactions, also check PayOS for real-time status
        if (transaction.Status == TransactionStatus.Pending
            && !string.IsNullOrEmpty(transaction.OrderCode))
        {
            var payOsStatus = await _payOsService.GetPaymentStatusAsync(transaction.OrderCode);
            if (payOsStatus == "Success")
            {
                // PayOS says paid but DB not yet updated (webhook may be delayed).
                // Return "Success" so frontend can react.
                return payOsStatus;
            }
        }

        return transaction.Status.ToString();
    }
}
