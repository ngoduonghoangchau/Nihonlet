using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Common.Interfaces;

public interface IAssessmentRepository
{
    Task<List<Question>> GetQuestionsAsync(int referenceId, ReferenceType type, CancellationToken ct);
    
    // THÊM DÒNG NÀY VÀO INTERFACE
    Task<Question?> GetQuestionByIdAsync(int id, CancellationToken ct);
    
    Task<UserProgress?> GetUserProgressAsync(string userId, int referenceId, ReferenceType type, CancellationToken ct);
    void AddUserProgress(UserProgress progress);
    void UpdateUserProgress(UserProgress progress);
    Task SaveChangesAsync(CancellationToken ct);

    // Lấy danh sách tiến độ của 1 User dựa trên danh sách ID bài học
    Task<List<UserProgress>> GetProgressListAsync(string userId, IEnumerable<int> referenceIds, ReferenceType type, CancellationToken ct);
}