namespace NihonLet.Application.Common.Interfaces;

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
    /// <returns>URL redirect đến trang thanh toán</returns>
    Task<string> CreatePaymentLinkAsync(string userId, decimal amount, string description);
    
    /// <summary>
    /// Xác nhận thanh toán từ webhook callback
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
}
