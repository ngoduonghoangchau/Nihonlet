using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Billing;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity UserSubscription
/// </summary>
public class UserSubscriptionConfiguration : IEntityTypeConfiguration<UserSubscription>
{
    public void Configure(EntityTypeBuilder<UserSubscription> builder)
    {
        builder.ToTable("UserSubscriptions");
        
        builder.HasKey(us => us.Id);
        
        builder.Property(us => us.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(us => us.StartDate)
            .HasDefaultValueSql("GETUTCDATE()");
        
        builder.Property(us => us.Status)
            .HasConversion<int>();
        
        // Indexes
        builder.HasIndex(us => us.UserId);
        builder.HasIndex(us => new { us.UserId, us.Status });
    }
}
