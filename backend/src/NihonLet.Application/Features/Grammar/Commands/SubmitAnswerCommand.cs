using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Grammar.DTOs;
using NihonLet.Domain.Entities.Assessment;
using NihonLet.Domain.Enums;

namespace NihonLet.Application.Features.Grammar.Commands;

public record SubmitAnswerCommand(
    string UserId,
    int QuestionId,
    int SelectedOptionId) : IRequest<CheckAnswerResponse>;

public class SubmitAnswerHandler : IRequestHandler<SubmitAnswerCommand, CheckAnswerResponse>
{
    private readonly IAssessmentRepository _assessmentRepo;

    public SubmitAnswerHandler(IAssessmentRepository assessmentRepo)
    {
        _assessmentRepo = assessmentRepo;
    }

    public async Task<CheckAnswerResponse> Handle(SubmitAnswerCommand request, CancellationToken ct)
    {
        // 1. Lấy câu hỏi kèm options
        var question = await _assessmentRepo.GetQuestionByIdAsync(request.QuestionId, ct);
        if (question == null) throw new KeyNotFoundException("Question not found");

        // 2. Kiểm tra đáp án
        var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
        bool isCorrect = correctOption != null && correctOption.OptionId == request.SelectedOptionId;

        // 3. Cập nhật tiến độ (Audit log hoặc UserProgress)
        var progress = await _assessmentRepo.GetUserProgressAsync(
            request.UserId, question.ReferenceId, ReferenceType.Grammar, ct);

        // Trong Handler:
        if (progress == null)
        {
            _assessmentRepo.AddUserProgress(new UserProgress
            {
                UserId = request.UserId,
                ReferenceId = question.ReferenceId,
                ReferenceType = ReferenceType.Grammar,
                Status = ProgressStatus.Learning, // Bắt đầu làm là chuyển sang Learning
                AccuracyPercent = 0, // Sẽ tính toán lại sau mỗi câu hoặc cuối bài
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            // Nếu người dùng đã làm đúng hết hoặc đạt tiêu chuẩn master
            // if (isLastQuestion && accuracy >= 80) 
            //    progress.Status = ProgressStatus.Completed;

            progress.Status = ProgressStatus.Learning;
            progress.UpdatedAt = DateTime.UtcNow;
            _assessmentRepo.UpdateUserProgress(progress);
        }

        await _assessmentRepo.SaveChangesAsync(ct);

        return new CheckAnswerResponse
        {
            IsCorrect = isCorrect,
            CorrectOptionId = correctOption?.OptionId ?? 0,
            Explanation = question.Explanation
        };
    }
}