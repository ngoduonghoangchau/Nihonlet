namespace NihonLet.Application.Common.Exceptions;

/// <summary>
/// Exception khi không tìm thấy entity
/// </summary>
public class NotFoundException : Exception
{
    public string EntityName { get; }
    public object Key { get; }
    
    public NotFoundException(string entityName, object key)
        : base($"Entity \"{entityName}\" với key ({key}) không tồn tại.")
    {
        EntityName = entityName;
        Key = key;
    }
}
