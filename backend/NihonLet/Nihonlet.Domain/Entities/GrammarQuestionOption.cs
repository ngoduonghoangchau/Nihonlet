using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Entities
{
    public class GrammarQuestionOption : BaseEntity
    {
        public int GrammarQuestionId { get; private set; }

        /// <summary>
        /// A, B, C, D
        /// </summary>
        public string Label { get; private set; } = null!;

        public string Content { get; private set; } = null!;

        public bool IsCorrect { get; private set; }

        private GrammarQuestionOption() { } // EF Core

        public GrammarQuestionOption(int grammarQuestionId, string label, string content, bool isCorrect)
        {
            GrammarQuestionId = grammarQuestionId;
            Label = label;
            Content = content;
            IsCorrect = isCorrect;
        }

        internal void MarkAsCorrect()
        {
            IsCorrect = true;
        }

        internal void MarkAsIncorrect()
        {
            IsCorrect = false;
        }
    }
}
