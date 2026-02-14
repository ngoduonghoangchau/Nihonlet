namespace NihonLet.Application.Features.Admin.DTOs;

/// <summary>
/// Kết quả phân trang cho danh sách logs
/// </summary>
public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int Page { get; set; }
    public int PageSize { get; set; }
    public long TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
