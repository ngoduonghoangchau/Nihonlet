using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Assessment;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity UserProgress
/// </summary>
public class UserProgressConfiguration : IEntityTypeConfiguration<UserProgress>
{
    public void Configure(EntityTypeBuilder<UserProgress> builder)
    {
        builder.ToTable("UserProgresses");
        
        builder.HasKey(p => p.ProgressId);
        
        builder.Property(p => p.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(p => p.AccuracyPercent)
            .HasColumnType("decimal(5,2)");
        
        builder.Property(p => p.Status)
            .HasConversion<int>();
        
        builder.Property(p => p.ReferenceType)
            .HasConversion<int>();
        
        builder.Property(p => p.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Indexes
        builder.HasIndex(p => p.UserId);
        builder.HasIndex(p => new { p.UserId, p.ReferenceId, p.ReferenceType })
            .IsUnique();
    }
}
