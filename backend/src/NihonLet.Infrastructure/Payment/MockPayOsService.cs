using System.Collections.Concurrent;
using System.Text.Json;
using NihonLet.Application.Common.Interfaces;

namespace NihonLet.Infrastructure.Payment;

/// <summary>
/// Mock implementation của IPayOsService cho development/testing
/// Sử dụng in-memory storage thay vì gọi PayOS API thật
/// </summary>
public class MockPayOsService : IPayOsService
{
    /// <summary>
    /// Lưu trạng thái payment in-memory: OrderCode -> Status ("Pending"/"Success"/"Failed")
    /// </summary>
    private static readonly ConcurrentDictionary<string, string> PaymentStore = new();

    public Task<(string PaymentUrl, string OrderCode)> CreatePaymentLinkAsync(
        string userId, decimal amount, string description)
    {
        var orderCode = $"MOCK-{Guid.NewGuid():N}"[..16].ToUpper();
        var paymentUrl = $"https://pay.payos.vn/mock/{orderCode}";

        PaymentStore[orderCode] = "Pending";

        return Task.FromResult((paymentUrl, orderCode));
    }

    public Task<bool> ConfirmPaymentAsync(string orderCode)
    {
        if (!PaymentStore.TryGetValue(orderCode, out var status))
            return Task.FromResult(false);

        if (status != "Pending")
            return Task.FromResult(status == "Success");

        PaymentStore[orderCode] = "Success";
        return Task.FromResult(true);
    }

    public Task<string> GetPaymentStatusAsync(string orderCode)
    {
        if (!PaymentStore.TryGetValue(orderCode, out var status))
            return Task.FromResult("NotFound");

        return Task.FromResult(status);
    }

    public Task<WebhookVerificationResult?> VerifyWebhookAsync(string rawRequestBody)
    {
        try
        {
            using var doc = JsonDocument.Parse(rawRequestBody);
            var root = doc.RootElement;

            var orderCode = root.GetProperty("orderCode").GetString()!;
            var status = root.GetProperty("status").GetString()!;

            return Task.FromResult<WebhookVerificationResult?>(
                new WebhookVerificationResult(orderCode, status == "Success"));
        }
        catch
        {
            return Task.FromResult<WebhookVerificationResult?>(null);
        }
    }
}
