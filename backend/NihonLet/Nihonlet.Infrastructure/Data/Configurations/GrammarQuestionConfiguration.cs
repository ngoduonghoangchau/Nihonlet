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

            // --- QUAN TRỌNG: Cấu hình Backing Field cho IReadOnlyCollection ---
            // Điều này cho phép EF Core nạp dữ liệu trực tiếp vào biến private _options
            var navigation = builder.Metadata.FindNavigation(nameof(GrammarQuestion.Options));
            navigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
            // ------------------------------------------------------------------

            builder.Property(x => x.GrammarExerciseId)
                .IsRequired();

            builder.Property(x => x.QuestionText)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(x => x.Explanation)
                .HasMaxLength(1000)
                .IsRequired();

            // Audit fields (Kế thừa từ BaseAuditableEntity)
            builder.Property(x => x.Created)
                .IsRequired();

            builder.Property(x => x.CreatedBy)
                .HasMaxLength(100);

            builder.Property(x => x.LastModified)
                .IsRequired();

            builder.Property(x => x.LastModifiedBy)
                .HasMaxLength(100);

            // Aggregate: GrammarQuestion → Options
            // Một câu hỏi có nhiều lựa chọn, xóa câu hỏi thì xóa luôn options
            builder.HasMany(x => x.Options)
                .WithOne()
                .HasForeignKey(o => o.GrammarQuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK constraint: GrammarQuestion → GrammarExercise
            // Nếu bạn có navigation property 'Questions' trong GrammarExercise, 
            // nên map .WithMany(e => e.Questions) thay vì .WithMany()
            builder.HasOne<GrammarExercise>()
                .WithMany(e => e.Questions) // Khớp với _questions trong GrammarExercise
                .HasForeignKey(x => x.GrammarExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.GrammarExerciseId);
        }
    }
}