using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class GrammarExerciseConfiguration
        : IEntityTypeConfiguration<GrammarExercise>
    {
        public void Configure(EntityTypeBuilder<GrammarExercise> builder)
        {
            builder.ToTable("GrammarExercises");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .HasMaxLength(255)
                .IsRequired();

            builder.Property(x => x.Level)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(x => x.IsPremium)
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

            builder.HasIndex(x => x.Level);
        }
    }

}
