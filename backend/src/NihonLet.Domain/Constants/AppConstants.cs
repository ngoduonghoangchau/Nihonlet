namespace NihonLet.Domain.Constants;

/// <summary>
/// Các hằng số sử dụng trong toàn bộ ứng dụng
/// </summary>
public static class AppConstants
{
    /// <summary>
    /// Các giới hạn cho người dùng Free
    /// </summary>
    public static class FreeTier
    {
        /// <summary>Số bộ thẻ tối đa người dùng Free được tạo</summary>
        public const int MaxDecks = 10;
    }
    
    /// <summary>
    /// Cấu hình game Matching
    /// </summary>
    public static class MatchingGame
    {
        /// <summary>Số bộ thẻ tối đa được chọn mỗi lượt chơi</summary>
        public const int MaxDecksPerGame = 3;
        
        /// <summary>Số thẻ tối thiểu để bắt đầu game</summary>
        public const int MinCardsToPlay = 5;
    }
    
    /// <summary>
    /// Cấu hình Flashcard
    /// </summary>
    public static class Flashcard
    {
        /// <summary>Độ dài tối thiểu tên bộ thẻ</summary>
        public const int MinDeckTitleLength = 3;
        
        /// <summary>Độ dài tối đa tên bộ thẻ</summary>
        public const int MaxDeckTitleLength = 100;
    }
    
    /// <summary>
    /// Cấu hình thanh toán
    /// </summary>
    public static class Payment
    {
        /// <summary>Giá gói Premium (VNĐ)</summary>
        public const decimal PremiumPrice = 29000m;
        
        /// <summary>Thời hạn gói Premium (ngày)</summary>
        public const int PremiumDurationDays = 30;
    }
    
}
