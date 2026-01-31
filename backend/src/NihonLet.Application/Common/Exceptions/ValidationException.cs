using FluentValidation.Results;

namespace NihonLet.Application.Common.Exceptions;

/// <summary>
/// Exception khi validation thất bại
/// </summary>
public class ValidationException : Exception
{
    public IDictionary<string, string[]> Errors { get; }
    
    public ValidationException()
        : base("Một hoặc nhiều lỗi validation đã xảy ra.")
    {
        Errors = new Dictionary<string, string[]>();
    }
    
    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(g => g.Key, g => g.ToArray());
    }
}
