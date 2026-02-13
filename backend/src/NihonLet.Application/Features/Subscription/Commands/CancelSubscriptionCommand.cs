using MediatR;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Exceptions;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Constants;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Subscription.Commands;

public record CancelSubscriptionCommand : IRequest<bool>;

public class CancelSubscriptionCommandHandler : IRequestHandler<CancelSubscriptionCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;

    public CancelSubscriptionCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IIdentityService identityService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
    }

    public async Task<bool> Handle(CancelSubscriptionCommand command, CancellationToken ct)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException();

        // Find active subscription
        var subscription = await _context.UserSubscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == SubscriptionStatus.Active, ct)
            ?? throw new NotFoundException("UserSubscription", userId);

        // Cancel subscription
        subscription.Status = SubscriptionStatus.Cancelled;

        // Remove Premium role
        await _identityService.RemoveFromRoleAsync(userId, Roles.Premium);

        await _context.SaveChangesAsync(ct);
        return true;
    }
}
