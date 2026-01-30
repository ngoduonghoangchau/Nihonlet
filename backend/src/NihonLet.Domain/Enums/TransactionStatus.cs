namespace NihonLet.Domain.Enums;

/// <summary>
/// Trạng thái giao dịch thanh toán qua PayOS
/// </summary>
public enum TransactionStatus
{
    /// <summary>Đang chờ xử lý</summary>
    Pending,
    
    /// <summary>Thanh toán thành công</summary>
    Success,
    
    /// <summary>Thanh toán thất bại</summary>
    Failed,
    
    /// <summary>Giao dịch hết hạn</summary>
    Expired
}
