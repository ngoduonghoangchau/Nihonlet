using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Entities.Billing;
using NihonLet.Domain.Entities.Flashcard;
using NihonLet.Domain.Entities.Gamification;
using NihonLet.Domain.Entities.Identity;
using NihonLet.Domain.Entities.Learning;
using NihonLet.Infrastructure.Identity;

namespace NihonLet.Infrastructure.Persistence;

/// <summary>
/// EF Core DbContext kế thừa từ IdentityDbContext
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Identity
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // Flashcard
    public DbSet<Deck> Decks => Set<Deck>();
    public DbSet<Card> Cards => Set<Card>();

    // Learning
    public DbSet<ReadingCategory> ReadingCategories => Set<ReadingCategory>();
    public DbSet<ReadingArticle> ReadingArticles => Set<ReadingArticle>();
    public DbSet<GrammarTopic> GrammarTopics => Set<GrammarTopic>();

    // Assessment
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Option> Options => Set<Option>();
    public DbSet<UserProgress> UserProgresses => Set<UserProgress>();

    // Billing
    public DbSet<SubscriptionPlan> SubscriptionPlans => Set<SubscriptionPlan>();
    public DbSet<UserSubscription> UserSubscriptions => Set<UserSubscription>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    // Gamification
    public DbSet<AiChatSession> AiChatSessions => Set<AiChatSession>();
    public DbSet<AiChatMessage> AiChatMessages => Set<AiChatMessage>();
    public DbSet<GameSession> GameSessions => Set<GameSession>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply all configurations from the assembly
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
