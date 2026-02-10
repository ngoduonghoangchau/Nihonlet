using Microsoft.EntityFrameworkCore;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Infrastructure.Persistence.Repositories;

public class AssessmentRepository : IAssessmentRepository
{
    private readonly IApplicationDbContext _context;

    public AssessmentRepository(IApplicationDbContext context)
    {
        _context = context;
    }

    // Lấy toàn bộ danh sách câu hỏi của một bài học (Dùng cho Quiz)
    public async Task<List<Question>> GetQuestionsAsync(int referenceId, ReferenceType type, CancellationToken ct)
    {
        return await _context.Questions
            .Include(q => q.Options)
            .Where(q => q.ReferenceId == referenceId && q.ReferenceType == type)
            .AsNoTracking()
            .ToListAsync(ct);
    }

    // Lấy 1 câu hỏi cụ thể kèm các lựa chọn (Dùng để Check Answer)
    public async Task<Question?> GetQuestionByIdAsync(int id, CancellationToken ct)
    {
        return await _context.Questions
            .Include(q => q.Options)
            .FirstOrDefaultAsync(q => q.QuestionId == id, ct);
    }

    // Lấy tiến độ hiện tại của User cho bài học này
    public async Task<UserProgress?> GetUserProgressAsync(string userId, int referenceId, ReferenceType type, CancellationToken ct)
    {
        return await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId
                                   && p.ReferenceId == referenceId
                                   && p.ReferenceType == type, ct);
    }

    public void AddUserProgress(UserProgress progress)
    {
        _context.UserProgresses.Add(progress);
    }

    public void UpdateUserProgress(UserProgress progress)
    {
        _context.UserProgresses.Update(progress);
    }

    public async Task SaveChangesAsync(CancellationToken ct)
    {
        await _context.SaveChangesAsync(ct);
    }

    public async Task<List<UserProgress>> GetProgressListAsync(string userId, IEnumerable<int> referenceIds, ReferenceType type, CancellationToken ct)
    {
        return await _context.UserProgresses
            .Where(p => p.UserId == userId && p.ReferenceType == type && referenceIds.Contains(p.ReferenceId))
            .ToListAsync(ct);
    }

    public async Task<List<Question>> GetQuestionsForGrammarAsync(int topicId, CancellationToken ct)
    {
        return await _context.Questions
            .Include(q => q.Options)
            .Where(q => q.ReferenceId == topicId && q.ReferenceType == ReferenceType.Grammar) // Chỉ lấy Grammar
            .AsNoTracking()
            .ToListAsync(ct);
    }
}