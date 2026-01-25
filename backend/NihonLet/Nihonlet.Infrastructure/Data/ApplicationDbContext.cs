using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Common;
using Nihonlet.Domain.Entities;
using Nihonlet.Infrastructure.Identity;
using Nihonlet.Application.Common.Interfaces; 

namespace Nihonlet.Infrastructure.Data
{
    // SỬA DÒNG NÀY: Thêm ", IApplicationDbContext" ở cuối
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Các DbSet này đã khớp với IApplicationDbContext
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
        }

        // Hàm này cũng đã khớp với Interface
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