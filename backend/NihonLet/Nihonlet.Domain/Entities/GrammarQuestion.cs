using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Entities
{
    public class GrammarQuestion : BaseAuditableEntity
    {
        public int GrammarExerciseId { get; private set; }

        public string QuestionText { get; private set; } = null!;

        public string Explanation { get; private set; } = null!;

        private readonly List<GrammarQuestionOption> _options = [];
        public IReadOnlyCollection<GrammarQuestionOption> Options => _options.AsReadOnly();

        private GrammarQuestion() { } // EF Core

        public GrammarQuestion(int grammarExerciseId, string questionText, string explanation)
        {
            GrammarExerciseId = grammarExerciseId;
            QuestionText = questionText;
            Explanation = explanation;
        }

        public void AddOption(string label, string content, bool isCorrect)
        {
            if (_options.Any(o => o.Label == label))
                throw new InvalidOperationException($"Option {label} already exists.");

            if (isCorrect && _options.Any(o => o.IsCorrect))
                throw new InvalidOperationException("Only one correct option is allowed.");

            _options.Add(new GrammarQuestionOption(Id, label, content, isCorrect));
        }

        public GrammarQuestionOption GetCorrectOption()
        {
            return _options.Single(o => o.IsCorrect);
        }

        public void Update(string questionText, string explanation)
        {
            QuestionText = questionText;
            Explanation = explanation;
        }
    }
}