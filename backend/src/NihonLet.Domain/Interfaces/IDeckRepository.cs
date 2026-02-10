using NihonLet.Domain.Entities.Flashcard;

namespace NihonLet.Domain.Interfaces;

/// <summary>
/// Repository interface cho Deck aggregate root
/// </summary>
public interface IDeckRepository
{
    /// <summary>Đếm số bộ thẻ của user</summary>
    Task<int> GetCountByUserIdAsync(string userId);
    
    /// <summary>Thêm bộ thẻ mới</summary>
    Task AddAsync(Deck deck);
    
    /// <summary>Lưu thay đổi vào database</summary>
    Task SaveChangesAsync();
    
    /// <summary>Lấy danh sách bộ thẻ theo userId</summary>
    Task<List<Deck>> GetDecksByUserIdAsync(string userId);
    
    /// <summary>Lấy bộ thẻ theo ID</summary>
    Task<Deck?> GetByIdAsync(int id);
    
    /// <summary>Xóa bộ thẻ</summary>
    void Delete(Deck deck);
    
    /// <summary>Lấy bộ thẻ kèm Cards cho study session</summary>
    Task<Deck?> GetByIdWithCardsAsync(int deckId, string userId);
    
    /// <summary>Lấy nhiều bộ thẻ theo danh sách ID (cho game)</summary>
    Task<List<Deck>> GetDecksByIdsAsync(List<int> ids);
}