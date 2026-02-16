using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Subscription.DTOs;

namespace NihonLet.Application.Features.Subscription.Queries;

public record GetPaymentHistoryQuery : IRequest<List<TransactionDto>>;

public class GetPaymentHistoryQueryHandler : IRequestHandler<GetPaymentHistoryQuery, List<TransactionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetPaymentHistoryQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<TransactionDto>> Handle(GetPaymentHistoryQuery query, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        var transactions = await _context.Transactions
            .Include(t => t.Plan)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionDto
            {
                TransId = t.TransId,
                PlanName = t.Plan.PlanName,
                OrderCode = t.OrderCode,
                Amount = t.Amount,
                Status = t.Status.ToString(),
                PaymentMethod = t.PaymentMethod,
                PaidAt = t.PaidAt,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(ct);

        return transactions;
    }
}
