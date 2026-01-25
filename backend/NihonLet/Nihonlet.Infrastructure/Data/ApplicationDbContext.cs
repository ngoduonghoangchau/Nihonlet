﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Common;
using Nihonlet.Domain.Entities;
using Nihonlet.Infrastructure.Identity;
using Nihonlet.Application.Common.Interfaces;

namespace Nihonlet.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        #region Flashcards
        public DbSet<FlashcardSet> FlashcardSets => Set<FlashcardSet>();
        public DbSet<Flashcard> Flashcards => Set<Flashcard>();
        public DbSet<FlashcardProgress> FlashcardProgresses => Set<FlashcardProgress>();
        #endregion

        #region Grammar
        public DbSet<GrammarExercise> GrammarExercises => Set<GrammarExercise>();
        public DbSet<GrammarQuestion> GrammarQuestions => Set<GrammarQuestion>();
        
        // Bổ sung bảng Options để lưu các lựa chọn trắc nghiệm
        public DbSet<GrammarQuestionOption> GrammarQuestionOptions => Set<GrammarQuestionOption>();
        
        public DbSet<GrammarUserAnswer> GrammarUserAnswers => Set<GrammarUserAnswer>();
        #endregion

        #region Games
        public DbSet<Game> Games => Set<Game>();
        public DbSet<GameSession> GameSessions => Set<GameSession>();
        #endregion

        #region Payments & Subscriptions
        public DbSet<Subscription> Subscriptions => Set<Subscription>();
        public DbSet<Payment> Payments => Set<Payment>();
        #endregion

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Cần thiết cho Identity
            base.OnModelCreating(builder);

            // Tự động áp dụng các file Configuration (như GrammarQuestionConfiguration)
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Tự động cập nhật ngày tạo/ngày sửa cho các Entity kế thừa BaseAuditableEntity
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
                        // entry.Entity.CreatedBy = ... (Lấy từ ICurrentUserService nếu có)
                        entry.Entity.LastModified = now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = now;
                        // entry.Entity.LastModifiedBy = ...
                        break;
                }
            }
        }
    }
}