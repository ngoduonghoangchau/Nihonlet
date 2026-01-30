using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Billing;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity Transaction
/// </summary>
public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable("Transactions");
        
        builder.HasKey(t => t.TransId);
        
        builder.Property(t => t.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(t => t.OrderCode)
            .HasMaxLength(100);
        
        builder.Property(t => t.Amount)
            .HasColumnType("decimal(18,2)");
        
        builder.Property(t => t.PaymentMethod)
            .HasMaxLength(50)
            .HasDefaultValue("PayOS");
        
        builder.Property(t => t.Status)
            .HasConversion<int>();
        
        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Indexes
        builder.HasIndex(t => t.UserId);
        builder.HasIndex(t => t.OrderCode);
        builder.HasIndex(t => t.Status);
    }
}
