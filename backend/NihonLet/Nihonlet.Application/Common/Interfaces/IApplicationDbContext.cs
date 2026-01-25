using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<FlashcardSet> FlashcardSets { get; }
    DbSet<Flashcard> Flashcards { get; }

    DbSet<GrammarExercise> GrammarExercises { get; }
    DbSet<GrammarQuestion> GrammarQuestions { get; }
    DbSet<GrammarQuestionOption> GrammarQuestionOptions { get; }
    DbSet<GrammarUserAnswer> GrammarUserAnswers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}