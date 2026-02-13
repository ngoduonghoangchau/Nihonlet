using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Constants;
using NihonLet.Domain.Enums;
using NihonLet.Infrastructure.Persistence;

namespace NihonLet.Infrastructure.BackgroundServices;

/// <summary>
/// Background service kiểm tra và xử lý subscription hết hạn
/// </summary>
public class SubscriptionExpiryService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SubscriptionExpiryService> _logger;
    private static readonly TimeSpan CheckInterval = TimeSpan.FromHours(1);

    public SubscriptionExpiryService(
        IServiceProvider serviceProvider,
        ILogger<SubscriptionExpiryService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("SubscriptionExpiryService started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckExpiredSubscriptionsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking subscription expiry");
            }

            await Task.Delay(CheckInterval, stoppingToken);
        }
    }

    private async Task CheckExpiredSubscriptionsAsync(CancellationToken ct)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var identityService = scope.ServiceProvider.GetRequiredService<IIdentityService>();
        var systemLogger = scope.ServiceProvider.GetRequiredService<ISystemLogger>();

        var expiredSubs = await context.UserSubscriptions
            .Where(s => s.Status == SubscriptionStatus.Active
                && s.EndDate.HasValue
                && s.EndDate.Value < DateTime.UtcNow)
            .ToListAsync(ct);

        foreach (var sub in expiredSubs)
        {
            sub.Status = SubscriptionStatus.Expired;
            await identityService.RemoveFromRoleAsync(sub.UserId, Roles.Premium);

            _logger.LogInformation(
                "Expired subscription {SubId} for user {UserId}", sub.Id, sub.UserId);

            _ = systemLogger.LogAuditAsync(
                sub.UserId, "SubscriptionExpired", "UserSubscription", sub.Id.ToString());
        }

        if (expiredSubs.Count > 0)
        {
            await context.SaveChangesAsync(ct);
            _logger.LogInformation("Processed {Count} expired subscriptions", expiredSubs.Count);
        }
    }
}
