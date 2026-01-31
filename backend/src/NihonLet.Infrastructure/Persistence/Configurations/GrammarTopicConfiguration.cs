using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Learning;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity GrammarTopic
/// </summary>
public class GrammarTopicConfiguration : IEntityTypeConfiguration<GrammarTopic>
{
    public void Configure(EntityTypeBuilder<GrammarTopic> builder)
    {
        builder.ToTable("GrammarTopics");
        
        builder.HasKey(g => g.TopicId);
        
        builder.Property(g => g.Title)
            .HasMaxLength(200);
        
        builder.Property(g => g.Description)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(g => g.ExampleJson)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(g => g.Level)
            .HasConversion<int>();
        
        // Index
        builder.HasIndex(g => g.Level);
    }
}
