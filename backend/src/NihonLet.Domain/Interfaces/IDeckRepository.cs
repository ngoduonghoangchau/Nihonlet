using NihonLet.Domain.Entities.Flashcard;

namespace NihonLet.Domain.Interfaces;

public interface IDeckRepository
{
    Task<int> GetCountByUserIdAsync(string userId);
    Task AddAsync(Deck deck);
    Task SaveChangesAsync();
    Task<List<Deck>> GetDecksByUserIdAsync(string userId);
    Task<Deck?> GetByIdAsync(int id); 
    void Delete(Deck deck);         
}