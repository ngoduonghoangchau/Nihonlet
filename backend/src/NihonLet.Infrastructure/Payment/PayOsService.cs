using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PayOS;
using PayOS.Models;
using PayOS.Models.Webhooks;
using PayOS.Models.V2.PaymentRequests;
using NihonLet.Application.Common.Interfaces;

namespace NihonLet.Infrastructure.Payment;

/// <summary>
/// Real implementation của IPayOsService sử dụng payOS SDK v2
/// </summary>
public class PayOsService : IPayOsService
{
    private readonly PayOSClient _client;
    private readonly PayOsSettings _settings;
    private readonly ILogger<PayOsService> _logger;

    public PayOsService(IOptions<PayOsSettings> settings, ILogger<PayOsService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
        _client = new PayOSClient(
            _settings.ClientId,
            _settings.ApiKey,
            _settings.ChecksumKey);
    }

    public async Task<(string PaymentUrl, string OrderCode)> CreatePaymentLinkAsync(
        string userId, decimal amount, string description)
    {
        var orderCode = GenerateOrderCode();

        // PayOS description limit: truncate to 25 characters
        var truncatedDesc = description.Length > 25
            ? description[..25]
            : description;

        var request = new CreatePaymentLinkRequest
        {
            OrderCode = orderCode,
            Amount = (long)amount,
            Description = truncatedDesc,
            ReturnUrl = _settings.ReturnUrl,
            CancelUrl = _settings.CancelUrl
        };

        try
        {
            var result = await _client.PaymentRequests.CreateAsync(request);
            _logger.LogInformation(
                "PayOS payment link created: OrderCode={OrderCode}",
                orderCode);

            return (result.CheckoutUrl, orderCode.ToString());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "PayOS createPaymentLink failed for OrderCode={OrderCode}", orderCode);
            throw;
        }
    }

    public async Task<bool> ConfirmPaymentAsync(string orderCode)
    {
        if (!long.TryParse(orderCode, out var numericCode))
        {
            _logger.LogWarning("Invalid orderCode format for PayOS: {OrderCode}", orderCode);
            return false;
        }

        try
        {
            var info = await _client.PaymentRequests.GetAsync(numericCode, null);
            var isPaid = info.Status == PaymentLinkStatus.Paid;

            _logger.LogInformation(
                "PayOS payment status queried: OrderCode={OrderCode}, Status={Status}",
                orderCode, info.Status);

            return isPaid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "PayOS getPaymentLinkInformation failed: OrderCode={OrderCode}", orderCode);
            return false;
        }
    }

    public async Task<string> GetPaymentStatusAsync(string orderCode)
    {
        if (!long.TryParse(orderCode, out var numericCode))
            return "NotFound";

        try
        {
            var info = await _client.PaymentRequests.GetAsync(numericCode, null);
            return MapPayOsStatus(info.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "PayOS getPaymentLinkInformation failed: OrderCode={OrderCode}", orderCode);
            return "Pending";
        }
    }

    public async Task<WebhookVerificationResult?> VerifyWebhookAsync(string rawRequestBody)
    {
        try
        {
            var webhook = JsonSerializer.Deserialize<Webhook>(rawRequestBody);
            if (webhook == null)
                return null;

            // VerifyAsync validates HMAC signature, throws on invalid
            var verifiedData = await _client.Webhooks.VerifyAsync(webhook);

            var isSuccess = webhook.Success && webhook.Code == "00";

            _logger.LogInformation(
                "PayOS webhook verified: OrderCode={OrderCode}, Success={Success}",
                verifiedData.OrderCode, isSuccess);

            return new WebhookVerificationResult(
                verifiedData.OrderCode.ToString(),
                isSuccess);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "PayOS webhook verification failed");
            return null;
        }
    }

    /// <summary>
    /// Generate unique numeric order code for PayOS.
    /// Format: last 9 digits of Unix timestamp ms + 3-digit random suffix.
    /// </summary>
    private static long GenerateOrderCode()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() % 1_000_000_000;
        var random = Random.Shared.Next(100, 999);
        return timestamp * 1000 + random;
    }

    /// <summary>
    /// Map PayOS status string to application status string
    /// </summary>
    private static string MapPayOsStatus(PaymentLinkStatus status) => status switch
    {
        PaymentLinkStatus.Paid => "Success",
        PaymentLinkStatus.Pending => "Pending",
        PaymentLinkStatus.Processing => "Pending",
        PaymentLinkStatus.Cancelled => "Failed",
        PaymentLinkStatus.Expired => "Expired",
        PaymentLinkStatus.Failed => "Failed",
        _ => "Pending"
    };
}
