namespace NihonLet.Infrastructure.Payment;

/// <summary>
/// Configuration settings cho PayOS payment gateway
/// </summary>
public class PayOsSettings
{
    /// <summary>Client ID từ PayOS dashboard</summary>
    public string ClientId { get; set; } = null!;

    /// <summary>API Key từ PayOS dashboard</summary>
    public string ApiKey { get; set; } = null!;

    /// <summary>Checksum Key dùng để verify webhook signature</summary>
    public string ChecksumKey { get; set; } = null!;

    /// <summary>URL redirect sau khi thanh toán thành công</summary>
    public string ReturnUrl { get; set; } = "http://localhost:5173/premium-checkout";

    /// <summary>URL redirect khi user huỷ thanh toán</summary>
    public string CancelUrl { get; set; } = "http://localhost:5173/pricing";
}
