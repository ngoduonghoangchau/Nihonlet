using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Gamification;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity AiChatSession
/// </summary>
public class AiChatSessionConfiguration : IEntityTypeConfiguration<AiChatSession>
{
    public void Configure(EntityTypeBuilder<AiChatSession> builder)
    {
        builder.ToTable("AiChatSessions");
        
        builder.HasKey(s => s.SessionId);
        
        builder.Property(s => s.UserId)
            .IsRequired()
            .HasMaxLength(450);
        
        builder.Property(s => s.Title)
            .HasMaxLength(200);
        
        builder.Property(s => s.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Index
        builder.HasIndex(s => s.UserId);
        
        // Relationship
        builder.HasMany(s => s.Messages)
            .WithOne(m => m.Session)
            .HasForeignKey(m => m.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
