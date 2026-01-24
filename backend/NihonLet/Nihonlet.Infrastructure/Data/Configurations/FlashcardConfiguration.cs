using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class FlashcardConfiguration : IEntityTypeConfiguration<Flashcard>
    {
        public void Configure(EntityTypeBuilder<Flashcard> builder)
        {
            builder.ToTable("Flashcards");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.FlashcardSetId)
                .IsRequired();

            builder.Property(x => x.FrontText)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(x => x.BackText)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(x => x.ExampleSentence)
                .HasMaxLength(1000);

            builder.Property(x => x.Pronunciation)
                .HasMaxLength(255);

            builder.Property(x => x.Level)
                .HasMaxLength(50)
                .IsRequired();

            // Property "CreatedBy" của Flashcard là FlashcardSetSource (không phải audit field)
            builder.Property(x => x.CreatedBy)
                .HasColumnName("Source")
                .HasConversion<string>()
                .IsRequired();

            // Audit fields từ BaseAuditableEntity
            builder.Property(x => x.Created)
                .IsRequired();

            // Không cấu hình audit CreatedBy vì bị che bởi property CreatedBy của Flashcard
            // Audit field LastModified
            builder.Property(x => x.LastModified)
                .IsRequired();

            builder.Property(x => x.LastModifiedBy)
                .HasMaxLength(100);

            builder.HasIndex(x => x.FlashcardSetId);

            // FK constraint: Flashcard → FlashcardSet
            builder.HasOne<FlashcardSet>()
                .WithMany(s => s.Flashcards)
                .HasForeignKey(x => x.FlashcardSetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
