using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class FlashcardSetConfiguration : IEntityTypeConfiguration<FlashcardSet>
    {
        public void Configure(EntityTypeBuilder<FlashcardSet> builder)
        {
            builder.ToTable("FlashcardSets");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.Title)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(x => x.Source)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(x => x.IsPublic)
                .IsRequired();

            builder.Property(x => x.IsPremiumOnly)
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

            // Aggregate relationship
            builder.HasMany(x => x.Flashcards)
                .WithOne()
                .HasForeignKey(f => f.FlashcardSetId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ignore domain events
            builder.Ignore(x => x.DomainEvents);

            builder.HasIndex(x => x.UserId);
        }
    }
}
