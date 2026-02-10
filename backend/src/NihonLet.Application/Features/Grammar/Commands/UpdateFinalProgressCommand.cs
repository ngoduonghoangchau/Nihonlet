using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Grammar.Commands;

public record UpdateGrammarProgressCommand(string UserId, int TopicId, int CorrectAnswers, int TotalQuestions) : IRequest<bool>;

public class UpdateGrammarProgressHandler : IRequestHandler<UpdateGrammarProgressCommand, bool>
{
    private readonly IAssessmentRepository _assessmentRepo;

    public UpdateGrammarProgressHandler(IAssessmentRepository assessmentRepo)
    {
        _assessmentRepo = assessmentRepo;
    }

    public async Task<bool> Handle(UpdateGrammarProgressCommand request, CancellationToken ct)
    {
        // 1. Tìm tiến độ cũ
        var progress = await _assessmentRepo.GetUserProgressAsync(
            request.UserId, request.TopicId, ReferenceType.Grammar, ct);

        // 2. Tính toán % chính xác - Đảm bảo ép kiểu cả 2 vế để tuyệt đối không bị chia nguyên
        decimal accuracy = 0;
        if (request.TotalQuestions > 0)
        {
            // Tính toán và làm tròn ngay lập tức 2 chữ số thập phân
            // Sử dụng 100m để ép kiểu decimal cho toàn bộ phép tính
            var rawAccuracy = (decimal)request.CorrectAnswers / request.TotalQuestions * 100m;
            accuracy = Math.Round(Math.Min(rawAccuracy, 100m), 2, MidpointRounding.AwayFromZero);
            if (accuracy > 100) accuracy = 100;
        }

        // 3. Xác định trạng thái
        var status = accuracy >= 100 ? ProgressStatus.Completed : ProgressStatus.Learning;

        if (progress == null)
        {
            _assessmentRepo.AddUserProgress(new UserProgress
            {
                UserId = request.UserId,
                ReferenceId = request.TopicId,
                ReferenceType = ReferenceType.Grammar,
                AccuracyPercent = accuracy,
                Status = status,
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            // Chỉ cập nhật nếu điểm mới cao hơn điểm cũ
            if (accuracy > (progress.AccuracyPercent ?? 0))
            {
                progress.AccuracyPercent = accuracy;
                progress.Status = status;
                progress.UpdatedAt = DateTime.UtcNow;
                _assessmentRepo.UpdateUserProgress(progress);
            }
        }

        await _assessmentRepo.SaveChangesAsync(ct);
        return true;
    }
}