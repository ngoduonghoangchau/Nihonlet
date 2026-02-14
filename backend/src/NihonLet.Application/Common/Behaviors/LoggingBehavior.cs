using System.Diagnostics;
using System.Text.Json;
using MediatR;
using NihonLet.Application.Common.Interfaces;

namespace NihonLet.Application.Common.Behaviors;

/// <summary>
/// MediatR Pipeline Behavior tự động ghi log cho mọi Command/Query.
/// - Commands (write operations): ghi Audit Log (hành vi người dùng)
/// - Tất cả requests: ghi Application Log nếu có lỗi
/// - Ghi thời gian xử lý nếu request chậm (> 500ms)
/// </summary>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ISystemLogger _logger;
    private readonly ICurrentUserService _currentUser;

    // Requests chậm hơn ngưỡng này sẽ được log warning
    private const long SlowRequestThresholdMs = 500;

    public LoggingBehavior(ISystemLogger logger, ICurrentUserService currentUser)
    {
        _logger = logger;
        _currentUser = currentUser;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _currentUser.UserId;
        var isCommand = IsCommand(requestName);

        var sw = Stopwatch.StartNew();

        try
        {
            var response = await next();
            sw.Stop();

            // Log warning nếu request xử lý chậm
            if (sw.ElapsedMilliseconds > SlowRequestThresholdMs)
            {
                await _logger.LogWarningAsync(
                    $"Slow request: {requestName} took {sw.ElapsedMilliseconds}ms",
                    requestName,
                    userId);
            }

            // Ghi Audit Log cho Commands (write operations)
            if (isCommand)
            {
                var (action, entityType, entityId) = ExtractAuditInfo(requestName, request);
                await _logger.LogAuditAsync(
                    userId ?? "anonymous",
                    action,
                    entityType,
                    entityId,
                    oldValue: null,
                    newValue: TrySerialize(request));
            }

            return response;
        }
        catch (Exception ex)
        {
            sw.Stop();

            // Ghi Application Log cho mọi exception xảy ra trong handler
            await _logger.LogErrorAsync(
                $"{requestName} failed: {ex.Message}",
                ex,
                requestName,
                userId);

            // Ghi Audit Log failed cho Commands
            if (isCommand)
            {
                var (action, entityType, _) = ExtractAuditInfo(requestName, request);
                await _logger.LogAuditAsync(
                    userId ?? "anonymous",
                    $"{action}_FAILED",
                    entityType,
                    entityId: null,
                    oldValue: null,
                    newValue: ex.Message);
            }

            throw; // Re-throw để GlobalExceptionHandler xử lý HTTP response
        }
    }

    /// <summary>
    /// Xác định request có phải là Command (write) hay không.
    /// Convention: tên kết thúc bằng "Command"
    /// </summary>
    private static bool IsCommand(string requestName)
    {
        return requestName.EndsWith("Command", StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Trích xuất thông tin audit từ tên Command.
    /// Ví dụ: CreateDeckCommand → action="Create", entityType="Deck"
    ///         DeleteDeckCommand → action="Delete", entityType="Deck"
    ///         StartMatchingGameCommand → action="Start", entityType="MatchingGame"
    ///         SaveRewritingSessionCommand → action="Save", entityType="RewritingSession"
    /// </summary>
    private static (string Action, string EntityType, string? EntityId) ExtractAuditInfo<T>(string requestName, T request)
    {
        // Bỏ suffix "Command"
        var name = requestName.Replace("Command", "", StringComparison.OrdinalIgnoreCase);

        // Tách action (từ đầu tiên viết hoa) và entityType (phần còn lại)
        var action = "Execute"; // Fallback
        var entityType = name;

        // Tìm vị trí uppercase thứ 2 để tách action/entity
        for (int i = 1; i < name.Length; i++)
        {
            if (char.IsUpper(name[i]))
            {
                action = name[..i];
                entityType = name[i..];
                break;
            }
        }

        // Cố gắng extract entityId từ request properties phổ biến
        string? entityId = null;
        var type = typeof(T);
        
        var idProp = type.GetProperty("Id")
                     ?? type.GetProperty("DeckId")
                     ?? type.GetProperty("GameId");
        if (idProp != null)
        {
            entityId = idProp.GetValue(request)?.ToString();
        }

        return (action, entityType, entityId);
    }

    /// <summary>
    /// Serialize request thành JSON an toàn (bỏ qua nếu lỗi, giới hạn kích thước)
    /// </summary>
    private static string? TrySerialize<T>(T obj)
    {
        try
        {
            var json = JsonSerializer.Serialize(obj, new JsonSerializerOptions
            {
                WriteIndented = false,
                MaxDepth = 3 // Giới hạn depth để tránh circular reference
            });
            
            // Giới hạn kích thước log entry
            return json.Length > 2000 ? json[..2000] + "...(truncated)" : json;
        }
        catch
        {
            return null;
        }
    }
}
