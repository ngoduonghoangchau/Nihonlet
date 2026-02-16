using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NihonLet.Application.Common.Models;
using NihonLet.Application.Features.Subscription.Commands;
using NihonLet.Application.Features.Subscription.DTOs;
using NihonLet.Application.Features.Subscription.Queries;

namespace NihonLet.API.Controllers;

/// <summary>
/// Quản lý subscription và thanh toán Premium
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SubscriptionController : ControllerBase
{
    private readonly IMediator _mediator;

    public SubscriptionController(IMediator mediator) => _mediator = mediator;

    /// <summary>
    /// Tạo payment session cho gói Premium
    /// </summary>
    [HttpPost("create-payment")]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        var result = await _mediator.Send(new CreatePaymentCommand(request.PlanId));
        return Ok(ApiResponse<PaymentLinkDto>.SuccessResult(result, "Tạo link thanh toán thành công."));
    }

    /// <summary>
    /// PayOS webhook callback (không cần auth).
    /// Đọc raw body để verify HMAC signature trước khi xử lý.
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new StreamReader(Request.Body);
        var rawBody = await reader.ReadToEndAsync();

        var result = await _mediator.Send(new ProcessPayOsWebhookCommand(rawBody));
        return Ok(ApiResponse<bool>.SuccessResult(result));
    }

    /// <summary>
    /// Xác nhận thanh toán thủ công (user bấm "Tôi đã chuyển khoản")
    /// </summary>
    [HttpPost("confirm-payment")]
    public async Task<IActionResult> ConfirmPayment([FromBody] WebhookPayload payload)
    {
        var result = await _mediator.Send(new ConfirmPaymentCommand(payload.OrderCode, "Success"));
        return Ok(ApiResponse<bool>.SuccessResult(result, "Xác nhận thanh toán thành công."));
    }

    /// <summary>
    /// Lấy trạng thái subscription hiện tại
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var result = await _mediator.Send(new GetSubscriptionStatusQuery());
        return Ok(ApiResponse<SubscriptionStatusDto>.SuccessResult(result));
    }

    /// <summary>
    /// Lấy lịch sử thanh toán
    /// </summary>
    [HttpGet("payment-history")]
    public async Task<IActionResult> GetPaymentHistory()
    {
        var result = await _mediator.Send(new GetPaymentHistoryQuery());
        return Ok(ApiResponse<List<TransactionDto>>.SuccessResult(result));
    }

    /// <summary>
    /// Huỷ subscription Premium
    /// </summary>
    [HttpPost("cancel")]
    public async Task<IActionResult> Cancel()
    {
        var result = await _mediator.Send(new CancelSubscriptionCommand());
        return Ok(ApiResponse<bool>.SuccessResult(result, "Đã huỷ gói Premium."));
    }

    /// <summary>
    /// Polling trạng thái thanh toán (cho frontend)
    /// </summary>
    [HttpGet("payment-status/{orderCode}")]
    public async Task<IActionResult> GetPaymentStatus(string orderCode)
    {
        var result = await _mediator.Send(new GetPaymentStatusQuery(orderCode));
        return Ok(ApiResponse<string>.SuccessResult(result));
    }

    /// <summary>
    /// Lấy thông tin payment session đang pending (để restore sau khi refresh)
    /// </summary>
    [HttpGet("pending-payment")]
    public async Task<IActionResult> GetPendingPayment()
    {
        var result = await _mediator.Send(new GetPendingPaymentQuery());
        return Ok(ApiResponse<PendingPaymentDto?>.SuccessResult(result));
    }
}
