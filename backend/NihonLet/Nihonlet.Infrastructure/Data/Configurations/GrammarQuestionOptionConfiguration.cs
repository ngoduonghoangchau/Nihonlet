using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class GrammarQuestionOptionConfiguration
        : IEntityTypeConfiguration<GrammarQuestionOption>
    {
        public void Configure(EntityTypeBuilder<GrammarQuestionOption> builder)
        {
            builder.ToTable("GrammarQuestionOptions");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.GrammarQuestionId)
                .IsRequired();

            builder.Property(x => x.Label)
                .HasMaxLength(1) // A, B, C, D
                .IsRequired();

            builder.Property(x => x.Content)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(x => x.IsCorrect)
                .IsRequired();

            builder.HasIndex(x => x.GrammarQuestionId);

            builder.HasIndex(x => new { x.GrammarQuestionId, x.Label })
                .IsUnique(); // Không có 2 option cùng label
        }
    }
}