using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Subscription.DTOs;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Queries;

public record GetSubscriptionStatusQuery : IRequest<SubscriptionStatusDto>;

public class GetSubscriptionStatusQueryHandler : IRequestHandler<GetSubscriptionStatusQuery, SubscriptionStatusDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetSubscriptionStatusQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<SubscriptionStatusDto> Handle(GetSubscriptionStatusQuery query, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        // Get latest subscription (active first, then most recent)
        var subscription = await _context.UserSubscriptions
            .Include(s => s.Plan)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Status == SubscriptionStatus.Active ? 1 : 0)
            .ThenByDescending(s => s.StartDate)
            .FirstOrDefaultAsync(ct);

        if (subscription == null)
        {
            return new SubscriptionStatusDto
            {
                CurrentPlan = "Free",
                IsPremium = false,
                Status = "None"
            };
        }

        var daysRemaining = subscription.EndDate.HasValue
            ? (int)Math.Max(0, (subscription.EndDate.Value - DateTime.UtcNow).TotalDays)
            : (int?)null;

        return new SubscriptionStatusDto
        {
            CurrentPlan = subscription.Plan.PlanName,
            IsPremium = subscription.Status == SubscriptionStatus.Active,
            StartDate = subscription.StartDate,
            EndDate = subscription.EndDate,
            Status = subscription.Status.ToString(),
            DaysRemaining = daysRemaining
        };
    }
}
