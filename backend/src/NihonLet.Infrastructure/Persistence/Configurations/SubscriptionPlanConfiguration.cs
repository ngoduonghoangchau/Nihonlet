using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Billing;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity SubscriptionPlan
/// </summary>
public class SubscriptionPlanConfiguration : IEntityTypeConfiguration<SubscriptionPlan>
{
    public void Configure(EntityTypeBuilder<SubscriptionPlan> builder)
    {
        builder.ToTable("SubscriptionPlans");
        
        builder.HasKey(p => p.PlanId);
        
        builder.Property(p => p.PlanName)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.Property(p => p.Price)
            .HasColumnType("decimal(18,2)");
        
        builder.Property(p => p.MaxDecks)
            .HasDefaultValue(10);
        
        builder.Property(p => p.AllowBulkCreate)
            .HasDefaultValue(false);
        
        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Relationships
        builder.HasMany(p => p.UserSubscriptions)
            .WithOne(us => us.Plan)
            .HasForeignKey(us => us.PlanId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(p => p.Transactions)
            .WithOne(t => t.Plan)
            .HasForeignKey(t => t.PlanId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
