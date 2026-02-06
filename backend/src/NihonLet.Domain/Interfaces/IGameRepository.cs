using NihonLet.Domain.Entities.Gamification;

namespace NihonLet.Domain.Interfaces;

public interface IGameRepository
{
    Task AddSessionAsync(GameSession session);
    Task SaveChangesAsync();
}