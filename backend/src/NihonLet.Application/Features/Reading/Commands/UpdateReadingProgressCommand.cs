using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Reading.Commands;

public record UpdateReadingProgressCommand(string UserId, int ArticleId, int CorrectAnswers, int TotalQuestions) : IRequest<bool>;

public class UpdateReadingProgressHandler : IRequestHandler<UpdateReadingProgressCommand, bool>
{
    private readonly IAssessmentRepository _repo;

    public UpdateReadingProgressHandler(IAssessmentRepository repo) => _repo = repo;

    public async Task<bool> Handle(UpdateReadingProgressCommand request, CancellationToken ct)
    {
        var progress = await _repo.GetUserProgressAsync(request.UserId, request.ArticleId, ReferenceType.Reading, ct);

        // Tính % chính xác (Tránh lỗi chia số nguyên)
        decimal accuracy = request.TotalQuestions > 0 
            ? Math.Round(((decimal)request.CorrectAnswers / request.TotalQuestions) * 100, 2) 
            : 0;

        var status = accuracy >= 100 ? ProgressStatus.Completed : ProgressStatus.Learning;

        if (progress == null) {
            _repo.AddUserProgress(new UserProgress {
                UserId = request.UserId,
                ReferenceId = request.ArticleId,
                ReferenceType = ReferenceType.Reading,
                AccuracyPercent = accuracy,
                Status = status,
                UpdatedAt = DateTime.UtcNow
            });
        } else {
            progress.AccuracyPercent = accuracy;
            progress.Status = status;
            progress.UpdatedAt = DateTime.UtcNow;
            _repo.UpdateUserProgress(progress);
        }

        await _repo.SaveChangesAsync(ct);
        return true;
    }
}