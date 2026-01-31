using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Flashcard;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity Card
/// </summary>
public class CardConfiguration : IEntityTypeConfiguration<Card>
{
    public void Configure(EntityTypeBuilder<Card> builder)
    {
        builder.ToTable("Cards");
        
        builder.HasKey(c => c.CardId);
        
        builder.Property(c => c.Kanji)
            .HasMaxLength(50);
        
        builder.Property(c => c.Reading)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(c => c.Meaning)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.Property(c => c.ExampleSentence)
            .HasMaxLength(1000);
        
        builder.Property(c => c.ExampleTranslation)
            .HasMaxLength(1000);
        
        // Index
        builder.HasIndex(c => c.DeckId);
    }
}
