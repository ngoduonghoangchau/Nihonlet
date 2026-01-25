namespace Nihonlet.Application.Grammar.Common; // Hãy copy chính xác dòng này

public record GrammarOptionDto(int Id, string Label, string Content);

public record GrammarQuestionDto(int Id, string QuestionText, string Explanation, List<GrammarOptionDto> Options);

public record GrammarExerciseDto(int Id, string Title, string Level, List<GrammarQuestionDto> Questions);

public record SubmissionResult(bool IsCorrect, int CorrectOptionId, string Explanation);