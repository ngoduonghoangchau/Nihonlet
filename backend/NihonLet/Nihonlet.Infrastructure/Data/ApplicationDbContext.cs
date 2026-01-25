using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Common;
using Nihonlet.Domain.Entities;
using Nihonlet.Infrastructure.Identity;

namespace Nihonlet.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<FlashcardSet> FlashcardSets => Set<FlashcardSet>();
        public DbSet<Flashcard> Flashcards => Set<Flashcard>();
        public DbSet<FlashcardProgress> FlashcardProgresses => Set<FlashcardProgress>();

        public DbSet<GrammarExercise> GrammarExercises => Set<GrammarExercise>();
        public DbSet<GrammarQuestion> GrammarQuestions => Set<GrammarQuestion>();
        public DbSet<GrammarUserAnswer> GrammarUserAnswers => Set<GrammarUserAnswer>();

        public DbSet<Game> Games => Set<Game>();
        public DbSet<GameSession> GameSessions => Set<GameSession>();

        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Payment> Payments => Set<Payment>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            // Cấu hình quan hệ rõ ràng để đảm bảo EF Core hiểu khi Query (Fix lỗi Questions bị rỗng)
            builder.Entity<GrammarExercise>()
                .HasMany(e => e.Questions)
                .WithOne()
                .HasForeignKey("GrammarExerciseId")
                .IsRequired();

            builder.Entity<GrammarQuestion>()
                .HasMany(q => q.Options)
                .WithOne()
                .HasForeignKey("GrammarQuestionId")
                .IsRequired();

            var now = new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero);

            // Seed Data Grammar (Dữ liệu mẫu cho bài tập ngữ pháp)
            builder.Entity<GrammarExercise>().HasData(
                new
                {
                    Id = 1,
                    Level = "N5-1", // Tương ứng với topicId trong URL
                    Title = "Bài 1: Giới thiệu bản thân - Cấu trúc N1 wa N2 desu",
                    IsPremium = false,
                    Created = now,
                    LastModified = now,
                    CreatedBy = (string?)null,
                    LastModifiedBy = (string?)null
                }
            );

            builder.Entity<GrammarQuestion>().HasData(
                new
                {
                    Id = 1,
                    GrammarExerciseId = 1,
                    QuestionText = "Watashi ___ Maiku Miraa desu.",
                    Explanation = "Trợ từ 'wa' (viết là ha) dùng để đánh dấu chủ ngữ trong câu khẳng định.",
                    Created = now,
                    LastModified = now,
                    CreatedBy = (string?)null,
                    LastModifiedBy = (string?)null
                },
                new
                {
                    Id = 2,
                    GrammarExerciseId = 1,
                    QuestionText = "Miraa-san ___ gakusei desu ka.",
                    Explanation = "Trợ từ 'wa' tiếp tục được dùng để hỏi về chủ ngữ.",
                    Created = now,
                    LastModified = now,
                    CreatedBy = (string?)null,
                    LastModifiedBy = (string?)null
                },
                new
                {
                    Id = 3,
                    GrammarExerciseId = 1,
                    QuestionText = "Santosu-san ___ kaishain dewa arimasen.",
                    Explanation = "Trong câu phủ định, chủ ngữ vẫn đi với 'wa'.",
                    Created = now,
                    LastModified = now,
                    CreatedBy = (string?)null,
                    LastModifiedBy = (string?)null
                }
            );

            builder.Entity<GrammarQuestionOption>().HasData(
                // Question 1
                new { Id = 1, GrammarQuestionId = 1, Label = "A", Content = "wa", IsCorrect = true },
                new { Id = 2, GrammarQuestionId = 1, Label = "B", Content = "ga", IsCorrect = false },
                new { Id = 3, GrammarQuestionId = 1, Label = "C", Content = "wo", IsCorrect = false },
                new { Id = 4, GrammarQuestionId = 1, Label = "D", Content = "mo", IsCorrect = false },
                // Question 2
                new { Id = 5, GrammarQuestionId = 2, Label = "A", Content = "no", IsCorrect = false },
                new { Id = 6, GrammarQuestionId = 2, Label = "B", Content = "wa", IsCorrect = true },
                new { Id = 7, GrammarQuestionId = 2, Label = "C", Content = "ni", IsCorrect = false },
                new { Id = 8, GrammarQuestionId = 2, Label = "D", Content = "de", IsCorrect = false },
                // Question 3
                new { Id = 9, GrammarQuestionId = 3, Label = "A", Content = "mo", IsCorrect = false },
                new { Id = 10, GrammarQuestionId = 3, Label = "B", Content = "wa", IsCorrect = true },
                new { Id = 11, GrammarQuestionId = 3, Label = "C", Content = "ga", IsCorrect = false },
                new { Id = 12, GrammarQuestionId = 3, Label = "D", Content = "to", IsCorrect = false }
            );
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInformation();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInformation()
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.Created = now;
                        entry.Entity.LastModified = now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = now;
                        break;
                }
            }
        }
    }
}
