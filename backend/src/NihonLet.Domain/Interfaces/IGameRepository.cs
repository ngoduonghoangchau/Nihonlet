using NihonLet.Domain.Entities.Gamification;

namespace NihonLet.Domain.Interfaces;

/// <summary>
/// Repository interface cho Game aggregate
/// </summary>
public interface IGameRepository
{
    /// <summary>Lưu kết quả lượt chơi</summary>
    Task AddSessionAsync(GameSession session);
    
    /// <summary>Lưu thay đổi vào database</summary>
    Task SaveChangesAsync();
}