using NihonLet.Domain.Enums;

namespace NihonLet.Domain.Entities.Billing;

/// <summary>
/// Trạng thái gói cước hiện tại của từng người dùng
/// </summary>
public class UserSubscription
{
    public int Id { get; set; }
    
    /// <summary>ID người dùng (AspNetUsers.Id)</summary>
    public string UserId { get; set; } = null!;
    
    /// <summary>ID gói cước</summary>
    public int PlanId { get; set; }
    
    /// <summary>Ngày bắt đầu gói</summary>
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    
    /// <summary>Ngày hết hạn gói</summary>
    public DateTime? EndDate { get; set; }
    
    /// <summary>Trạng thái gói</summary>
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    
    // Navigation property
    public virtual SubscriptionPlan Plan { get; set; } = null!;
}
