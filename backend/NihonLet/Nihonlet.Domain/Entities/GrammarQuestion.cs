using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Entities
{
    public class GrammarQuestion : BaseAuditableEntity
    {
        public int GrammarExerciseId { get; private set; }

        public string QuestionText { get; private set; } = null!;

        public string CorrectAnswer { get; private set; } = null!;

        public string Explanation { get; private set; } = null!;

        private GrammarQuestion() { } // EF Core

        public GrammarQuestion(int grammarExerciseId, string questionText, string correctAnswer, string explanation)
        {
            GrammarExerciseId = grammarExerciseId;
            QuestionText = questionText;
            CorrectAnswer = correctAnswer;
            Explanation = explanation;
        }

        public void Update(string questionText, string correctAnswer, string explanation)
        {
            QuestionText = questionText;
            CorrectAnswer = correctAnswer;
            Explanation = explanation;
        }
    }
}
