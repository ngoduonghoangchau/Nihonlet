namespace NihonLet.Domain.Constants;

/// <summary>
/// Định nghĩa các roles trong hệ thống
/// </summary>
public static class Roles
{
    /// <summary>Quản trị viên - full access</summary>
    public const string Admin = "Admin";
    
    /// <summary>Người dùng thường - basic features</summary>
    public const string User = "User";
    
    /// <summary>Người dùng Premium - advanced features</summary>
    public const string Premium = "Premium";
    
    /// <summary>Danh sách tất cả roles</summary>
    public static readonly string[] All = [Admin, User, Premium];
}
