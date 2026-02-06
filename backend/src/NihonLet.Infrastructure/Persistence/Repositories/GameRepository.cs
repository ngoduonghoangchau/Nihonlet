using NihonLet.Domain.Entities.Gamification;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Infrastructure.Persistence.Repositories;

public class GameRepository : IGameRepository
{
    private readonly ApplicationDbContext _context;

    public GameRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddSessionAsync(GameSession session)
    {
        await _context.Set<GameSession>().AddAsync(session);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}