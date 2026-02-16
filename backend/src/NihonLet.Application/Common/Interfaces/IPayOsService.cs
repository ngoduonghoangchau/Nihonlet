namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Kết quả xác minh webhook từ PayOS
/// </summary>
public record WebhookVerificationResult(string OrderCode, bool IsSuccess);

/// <summary>
/// Interface cho PayOS payment service
/// </summary>
public interface IPayOsService
{
    /// <summary>
    /// Tạo link thanh toán cho gói Premium
    /// </summary>
    /// <param name="userId">ID người dùng</param>
    /// <param name="amount">Số tiền</param>
    /// <param name="description">Mô tả giao dịch</param>
    /// <returns>Tuple chứa PaymentUrl và OrderCode</returns>
    Task<(string PaymentUrl, string OrderCode)> CreatePaymentLinkAsync(string userId, decimal amount, string description);

    /// <summary>
    /// Xác nhận thanh toán bằng cách query PayOS API
    /// </summary>
    /// <param name="orderCode">Mã đơn hàng</param>
    /// <returns>true nếu thanh toán thành công</returns>
    Task<bool> ConfirmPaymentAsync(string orderCode);

    /// <summary>
    /// Kiểm tra trạng thái thanh toán
    /// </summary>
    /// <param name="orderCode">Mã đơn hàng</param>
    /// <returns>Trạng thái giao dịch</returns>
    Task<string> GetPaymentStatusAsync(string orderCode);

    /// <summary>
    /// Xác minh webhook payload từ PayOS (kiểm tra HMAC signature).
    /// Trả về null nếu xác minh thất bại.
    /// </summary>
    /// <param name="rawRequestBody">Raw JSON body từ PayOS webhook</param>
    /// <returns>Kết quả xác minh, hoặc null nếu thất bại</returns>
    Task<WebhookVerificationResult?> VerifyWebhookAsync(string rawRequestBody);
}
