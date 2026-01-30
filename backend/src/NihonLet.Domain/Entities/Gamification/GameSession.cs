namespace NihonLet.Domain.Entities.Gamification;

/// <summary>
/// Kết quả lượt chơi Minigame Matching
/// </summary>
public class GameSession
{
    public int GameId { get; set; }
    
    /// <summary>ID người chơi (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>Số lượng từ trong lượt chơi (10, 15, 20...)</summary>
    public int WordCount { get; set; }
    
    /// <summary>Danh sách ID tối đa 3 bộ thẻ (lưu JSON: [1, 5, 8])</summary>
    public string? SelectedDecksJson { get; set; }
    
    /// <summary>Tổng điểm đạt được</summary>
    public int TotalScore { get; set; }
    
    /// <summary>Tỷ lệ nối đúng (%)</summary>
    public decimal Accuracy { get; set; }
    
    /// <summary>Thời gian chơi</summary>
    public DateTime PlayedAt { get; set; } = DateTime.UtcNow;
}
