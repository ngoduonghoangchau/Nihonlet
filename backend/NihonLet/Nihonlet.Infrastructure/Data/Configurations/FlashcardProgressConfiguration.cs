using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class FlashcardProgressConfiguration
        : IEntityTypeConfiguration<FlashcardProgress>
    {
        public void Configure(EntityTypeBuilder<FlashcardProgress> builder)
        {
            builder.ToTable("FlashcardProgress");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.FlashcardId)
                .IsRequired();

            builder.Property(x => x.LastReviewed);

            builder.Property(x => x.CorrectCount)
                .IsRequired();

            builder.Property(x => x.WrongCount)
                .IsRequired();

            builder.Property(x => x.MasteryLevel)
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

            // Mỗi user – mỗi flashcard chỉ có 1 progress
            builder.HasIndex(x => new { x.UserId, x.FlashcardId })
                .IsUnique();
        }
    }
}
