using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class GrammarQuestionConfiguration
        : IEntityTypeConfiguration<GrammarQuestion>
    {
        public void Configure(EntityTypeBuilder<GrammarQuestion> builder)
        {
            builder.ToTable("GrammarQuestions");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.GrammarExerciseId)
                .IsRequired();

            builder.Property(x => x.QuestionText)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(x => x.Explanation)
                .HasMaxLength(1000)
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

            // Aggregate: GrammarQuestion → Options
            builder.HasMany(x => x.Options)
                .WithOne()
                .HasForeignKey(o => o.GrammarQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.GrammarExerciseId);
        }
    }
}