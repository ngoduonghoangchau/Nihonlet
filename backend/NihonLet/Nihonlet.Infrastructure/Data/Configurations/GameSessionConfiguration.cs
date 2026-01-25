using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
    {
        public void Configure(EntityTypeBuilder<GameSession> builder)
        {
            builder.ToTable("GameSessions");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.GameId)
                .IsRequired();

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.Score)
                .IsRequired();

            builder.Property(x => x.Duration)
                .IsRequired();

            builder.Property(x => x.PlayedAt)
                .IsRequired();

            // Audit fields
            builder.Property(x => x.Created)
                .IsRequired();

            builder.Property(x => x.CreatedBy)
                .HasMaxLength(100);

            builder.Property(x => x.LastModified)
                .IsRequired();

            builder.Property(x => x.LastModifiedBy)
                .HasMaxLength(100);

            // Ignore domain events
            builder.Ignore(x => x.DomainEvents);

            // FK constraint: GameSession → Game
            builder.HasOne<Game>()
                .WithMany()
                .HasForeignKey(x => x.GameId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.GameId);
            builder.HasIndex(x => new { x.UserId, x.GameId });
        }
    }
}
