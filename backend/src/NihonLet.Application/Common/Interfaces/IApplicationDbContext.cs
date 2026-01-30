using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Entities.Billing;
using NihonLet.Domain.Entities.Flashcard;
using NihonLet.Domain.Entities.Gamification;
using NihonLet.Domain.Entities.Learning;
using Microsoft.EntityFrameworkCore;

namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Interface cho EF Core DbContext
/// </summary>
public interface IApplicationDbContext
{
    // Flashcard
    DbSet<Deck> Decks { get; }
    DbSet<Card> Cards { get; }
    
    // Learning
    DbSet<ReadingCategory> ReadingCategories { get; }
    DbSet<ReadingArticle> ReadingArticles { get; }
    DbSet<GrammarTopic> GrammarTopics { get; }
    
    // Assessment
    DbSet<Question> Questions { get; }
    DbSet<Option> Options { get; }
    DbSet<UserProgress> UserProgresses { get; }
    
    // Billing
    DbSet<SubscriptionPlan> SubscriptionPlans { get; }
    DbSet<UserSubscription> UserSubscriptions { get; }
    DbSet<Transaction> Transactions { get; }
    
    // Gamification
    DbSet<AiChatSession> AiChatSessions { get; }
    DbSet<AiChatMessage> AiChatMessages { get; }
    DbSet<GameSession> GameSessions { get; }
    
    /// <summary>
    /// Lưu thay đổi vào database
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
