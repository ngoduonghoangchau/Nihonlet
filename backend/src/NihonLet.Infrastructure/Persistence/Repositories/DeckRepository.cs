using Microsoft.EntityFrameworkCore;
using NihonLet.Domain.Entities.Flashcard;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Infrastructure.Persistence.Repositories;

public class DeckRepository : IDeckRepository
{
    private readonly ApplicationDbContext _context;

    public DeckRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetCountByUserIdAsync(string userId)
    {
        return await _context.Decks.CountAsync(d => d.UserId == userId);
    }

    public async Task AddAsync(Deck deck)
    {
        await _context.Decks.AddAsync(deck);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<Deck>> GetDecksByUserIdAsync(string userId)
    {
        return await _context.Decks
            .Include(d => d.Cards) // Để đếm số lượng thẻ
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<Deck?> GetByIdAsync(int id)
    {
        return await _context.Decks.FindAsync(id);
    }

    public void Delete(Deck deck)
    {
        _context.Decks.Remove(deck);
    }

    public async Task<Deck?> GetByIdWithCardsAsync(int deckId, string userId)
{
    return await _context.Decks
        .Include(d => d.Cards) // Nạp danh sách thẻ
        .FirstOrDefaultAsync(d => d.DeckId == deckId && d.UserId == userId);
}
}