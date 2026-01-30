namespace NihonLet.Domain.Entities.Billing;

/// <summary>
/// Gói cước và quyền lợi tương ứng
/// </summary>
public class SubscriptionPlan
{
    public int PlanId { get; set; }
    
    /// <summary>Tên gói (VD: 'Free', 'Premium')</summary>
    public string PlanName { get; set; } = null!;
    
    /// <summary>Giá gói cước (VD: 29000.00)</summary>
    public decimal Price { get; set; }
    
    /// <summary>Thời gian sử dụng tính bằng ngày (VD: 30)</summary>
    public int DurationDays { get; set; }
    
    /// <summary>Giới hạn số bộ thẻ (-1 là không giới hạn)</summary>
    public int MaxDecks { get; set; } = 10;
    
    /// <summary>Quyền sử dụng tính năng Bulk</summary>
    public bool AllowBulkCreate { get; set; } = false;
    
    /// <summary>Thời gian tạo</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<UserSubscription> UserSubscriptions { get; set; } = new List<UserSubscription>();
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
