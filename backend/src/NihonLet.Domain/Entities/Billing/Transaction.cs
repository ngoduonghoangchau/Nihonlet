using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Billing;

/// <summary>
/// Giao dịch thanh toán qua PayOS
/// </summary>
public class Transaction
{
    public int TransId { get; set; }
    
    /// <summary>ID người thanh toán (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>ID gói cước đang mua</summary>
    public int PlanId { get; set; }
    
    /// <summary>Mã đơn hàng từ PayOS</summary>
    public string? OrderCode { get; set; }
    
    /// <summary>Số tiền thanh toán</summary>
    public decimal Amount { get; set; } = 29000.00m;
    
    /// <summary>Trạng thái giao dịch</summary>
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
    
    /// <summary>Phương thức thanh toán</summary>
    public string PaymentMethod { get; set; } = "PayOS";
    
    /// <summary>Thời gian thanh toán thành công</summary>
    public DateTime? PaidAt { get; set; }
    
    /// <summary>Thời gian tạo giao dịch</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual SubscriptionPlan Plan { get; set; } = null!;
}
