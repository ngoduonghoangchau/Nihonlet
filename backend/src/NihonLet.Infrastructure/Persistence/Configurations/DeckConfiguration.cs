using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Flashcard;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity Deck
/// </summary>
public class DeckConfiguration : IEntityTypeConfiguration<Deck>
{
    public void Configure(EntityTypeBuilder<Deck> builder)
    {
        builder.ToTable("Decks");
        
        builder.HasKey(d => d.DeckId);
        
        builder.Property(d => d.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(d => d.Title)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(d => d.Description)
            .HasMaxLength(500);
        
        builder.Property(d => d.MasteryPercent)
            .HasDefaultValue(0);
        
        builder.Property(d => d.IsBulkCreated)
            .HasDefaultValue(false);
        
        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Index
        builder.HasIndex(d => d.UserId);
        
        // Relationship
        builder.HasMany(d => d.Cards)
            .WithOne(c => c.Deck)
            .HasForeignKey(c => c.DeckId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
