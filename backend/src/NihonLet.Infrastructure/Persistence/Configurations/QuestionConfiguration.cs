using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Assessment;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity Question
/// </summary>
public class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("Questions");
        
        builder.HasKey(q => q.QuestionId);
        
        builder.Property(q => q.QuestionText)
            .IsRequired()
            .HasMaxLength(1000);
        
        builder.Property(q => q.Explanation)
            .HasMaxLength(2000);
        
        builder.Property(q => q.Points)
            .HasDefaultValue(10);
        
        builder.Property(q => q.ReferenceType)
            .HasConversion<int>();
        
        // Indexes
        builder.HasIndex(q => new { q.ReferenceId, q.ReferenceType });
        
        // Relationship
        builder.HasMany(q => q.Options)
            .WithOne(o => o.Question)
            .HasForeignKey(o => o.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
