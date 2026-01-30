using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Gamification;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity AiChatMessage
/// </summary>
public class AiChatMessageConfiguration : IEntityTypeConfiguration<AiChatMessage>
{
    public void Configure(EntityTypeBuilder<AiChatMessage> builder)
    {
        builder.ToTable("AiChatMessages");
        
        builder.HasKey(m => m.MessageId);
        
        builder.Property(m => m.Content)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(m => m.Sender)
            .HasConversion<int>();
        
        builder.Property(m => m.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");
        
        // Index
        builder.HasIndex(m => m.SessionId);
    }
}
