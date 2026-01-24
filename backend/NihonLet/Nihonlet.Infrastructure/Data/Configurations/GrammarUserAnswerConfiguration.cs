using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Infrastructure.Data.Configurations
{
    public class GrammarUserAnswerConfiguration
        : IEntityTypeConfiguration<GrammarUserAnswer>
    {
        public void Configure(EntityTypeBuilder<GrammarUserAnswer> builder)
        {
            builder.ToTable("GrammarUserAnswers");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.GrammarQuestionId)
                .IsRequired();

            builder.Property(x => x.SelectedOptionId)
                .IsRequired();

            builder.Property(x => x.IsCorrect)
                .IsRequired();

            builder.Property(x => x.AnsweredAt)
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

            builder.HasIndex(x => new { x.UserId, x.GrammarQuestionId });

            // FK constraint: GrammarUserAnswer → GrammarQuestion
            builder.HasOne<GrammarQuestion>()
                .WithMany()
                .HasForeignKey(x => x.GrammarQuestionId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa cascade vì cần giữ lịch sử

            // FK constraint: GrammarUserAnswer → GrammarQuestionOption
            builder.HasOne<GrammarQuestionOption>()
                .WithMany()
                .HasForeignKey(x => x.SelectedOptionId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa cascade vì cần giữ lịch sử
        }
    }
}