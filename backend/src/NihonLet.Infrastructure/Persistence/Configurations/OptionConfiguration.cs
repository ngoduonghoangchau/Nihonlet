using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Assessment;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity Option
/// </summary>
public class OptionConfiguration : IEntityTypeConfiguration<Option>
{
    public void Configure(EntityTypeBuilder<Option> builder)
    {
        builder.ToTable("Options");
        
        builder.HasKey(o => o.OptionId);
        
        builder.Property(o => o.OptionText)
            .HasMaxLength(500);
        
        builder.Property(o => o.IsCorrect)
            .HasDefaultValue(false);
        
        // Index
        builder.HasIndex(o => o.QuestionId);
    }
}
