namespace NihonLet.API.Common.Responses
{
    public sealed class ApiError
    {
        public string Field { get; init; } = null!;
        public string Message { get; init; } = null!;
    }
}
