using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Assessment;

/// <summary>
/// Theo dõi tiến độ học tập của người dùng
/// </summary>
public class UserProgress
{
    public int ProgressId { get; set; }
    
    /// <summary>ID người học (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>ID bài học (Reading/Grammar)</summary>
    public int ReferenceId { get; set; }
    
    /// <summary>Loại tham chiếu</summary>
    public ReferenceType ReferenceType { get; set; }
    
    /// <summary>Tình trạng học</summary>
    public ProgressStatus Status { get; set; } = ProgressStatus.NotStarted;
    
    /// <summary>Tỷ lệ làm đúng (%)</summary>
    public decimal? AccuracyPercent { get; set; }
    
    /// <summary>Thời gian cập nhật cuối</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
