namespace NihonLet.Application.Common.Exceptions;

/// <summary>
/// Exception khi người dùng không có quyền truy cập
/// </summary>
public class ForbiddenException : Exception
{
    public ForbiddenException()
        : base("Bạn không có quyền thực hiện hành động này.")
    {
    }
    
    public ForbiddenException(string message)
        : base(message)
    {
    }
}
