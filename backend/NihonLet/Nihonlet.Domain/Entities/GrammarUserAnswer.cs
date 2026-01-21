using Nihonlet.Domain.Common;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class GrammarUserAnswer : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public int GrammarQuestionId { get; private set; }

        public int SelectedOptionId { get; private set; }

        public bool IsCorrect { get; private set; }

        public DateTime AnsweredAt { get; private set; }

        private GrammarUserAnswer() { } // EF Core

        public GrammarUserAnswer(Guid userId, int grammarQuestionId, int selectedOptionId, bool isCorrect)
        {
            UserId = userId;
            GrammarQuestionId = grammarQuestionId;
            SelectedOptionId = selectedOptionId;
            IsCorrect = isCorrect;
            AnsweredAt = DateTime.UtcNow;

            AddDomainEvent(new GrammarQuestionAnsweredEvent(userId, grammarQuestionId, isCorrect));
        }
    }
}