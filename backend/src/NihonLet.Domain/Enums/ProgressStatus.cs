namespace NihonLet.Domain.Enums;

/// <summary>
/// Trạng thái tiến độ học tập của người dùng
/// </summary>
public enum ProgressStatus
{
    /// <summary>Chưa bắt đầu</summary>
    NotStarted = 0,
    
    /// <summary>Đang học</summary>
    Learning = 1,
    
    /// <summary>Đã hoàn thành</summary>
    Completed = 2
}
