namespace NihonLet.Application.Common.Interfaces;

/// <summary>
/// Interface để lấy thông tin người dùng hiện tại từ HttpContext
/// </summary>
public interface ICurrentUserService
{
    /// <summary>ID người dùng (AspNetUsers.Id)</summary>
    string? UserId { get; }
    
    /// <summary>Email người dùng</summary>
    string? Email { get; }
    
    /// <summary>Tên đầy đủ</summary>
    string? FullName { get; }
    
    /// <summary>Kiểm tra user đã đăng nhập chưa</summary>
    bool IsAuthenticated { get; }
    
    /// <summary>Kiểm tra user có role cụ thể</summary>
    bool IsInRole(string role);
    
    /// <summary>Kiểm tra user có phải Premium không</summary>
    bool IsPremium { get; }
}
