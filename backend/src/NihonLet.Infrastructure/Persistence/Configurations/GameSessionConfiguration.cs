using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Gamification;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity GameSession
/// </summary>
public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
{
    public void Configure(EntityTypeBuilder<GameSession> builder)
    {
        builder.ToTable("GameSessions");
        
        builder.HasKey(g => g.GameId);
        
        builder.Property(g => g.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(g => g.SelectedDecksJson)
            .HasMaxLength(500);
        
        builder.Property(g => g.Accuracy)
            .HasColumnType("decimal(5,2)");
        
        builder.Property(g => g.PlayedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Index
        builder.HasIndex(g => g.UserId);
    }
}
