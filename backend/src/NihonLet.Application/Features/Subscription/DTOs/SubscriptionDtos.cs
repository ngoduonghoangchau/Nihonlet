namespace NihonLet.Application.Features.Subscription.DTOs;

// === Request DTOs ===

/// <summary>
/// Request tạo payment session
/// </summary>
public record CreatePaymentRequest(int PlanId);

/// <summary>
/// Payload từ PayOS webhook hoặc manual confirm
/// </summary>
public record WebhookPayload
{
    public string OrderCode { get; init; } = null!;
    public string Status { get; init; } = null!;
}

// === Response DTOs ===

/// <summary>
/// Thông tin payment link trả về cho frontend
/// </summary>
public record PaymentLinkDto
{
    public int TransactionId { get; init; }
    public string OrderCode { get; init; } = null!;
    public string PaymentUrl { get; init; } = null!;
    public decimal Amount { get; init; }
}

/// <summary>
/// Trạng thái subscription hiện tại của user
/// </summary>
public record SubscriptionStatusDto
{
    public string CurrentPlan { get; init; } = "Free";
    public bool IsPremium { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public string Status { get; init; } = "None";
    public int? DaysRemaining { get; init; }
}

/// <summary>
/// Thông tin giao dịch thanh toán
/// </summary>
public record TransactionDto
{
    public int TransId { get; init; }
    public string PlanName { get; init; } = null!;
    public string? OrderCode { get; init; }
    public decimal Amount { get; init; }
    public string Status { get; init; } = null!;
    public string PaymentMethod { get; init; } = null!;
    public DateTime? PaidAt { get; init; }
    public DateTime CreatedAt { get; init; }
}

/// <summary>
/// Thông tin pending payment để restore session sau khi user refresh
/// </summary>
public record PendingPaymentDto
{
    public int TransactionId { get; init; }
    public string OrderCode { get; init; } = null!;
    public string PaymentUrl { get; init; } = null!;
    public decimal Amount { get; init; }
    public DateTime CreatedAt { get; init; }
    public int RemainingSeconds { get; init; }
}
