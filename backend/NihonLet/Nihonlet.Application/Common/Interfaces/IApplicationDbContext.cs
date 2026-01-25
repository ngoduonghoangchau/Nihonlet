using Microsoft.EntityFrameworkCore;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<FlashcardSet> FlashcardSets { get; }
    DbSet<Flashcard> Flashcards { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}