using MediatR;
using Microsoft.EntityFrameworkCore;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Application.Grammar.Common;
using Nihonlet.Domain.Entities;

namespace Nihonlet.Application.Grammar.Commands;

public record SubmitAnswerCommand(Guid UserId, int QuestionId, int SelectedOptionId) : IRequest<SubmissionResult>;

public class SubmitAnswerHandler : IRequestHandler<SubmitAnswerCommand, SubmissionResult>
{
    private readonly IApplicationDbContext _context;

    public SubmitAnswerHandler(IApplicationDbContext context) => _context = context;

    public async Task<SubmissionResult> Handle(SubmitAnswerCommand request, CancellationToken ct)
    {
        var question = await _context.GrammarQuestions
            .Include(x => x.Options)
            .FirstOrDefaultAsync(x => x.Id == request.QuestionId, ct);

        if (question == null) throw new Exception("Question not found");

        var correctOption = question.GetCorrectOption();
        bool isCorrect = correctOption.Id == request.SelectedOptionId;

        var userAnswer = new GrammarUserAnswer(request.UserId, request.QuestionId, request.SelectedOptionId, isCorrect);
        
        _context.GrammarUserAnswers.Add(userAnswer);
        await _context.SaveChangesAsync(ct);

        return new SubmissionResult(isCorrect, correctOption.Id, question.Explanation);
    }
}