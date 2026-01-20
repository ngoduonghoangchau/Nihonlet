using Nihonlet.Domain.Common;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class GrammarUserAnswer : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public int GrammarQuestionId { get; private set; }

        public string UserAnswer { get; private set; } = null!;

        public bool IsCorrect { get; private set; }

        public DateTime AnsweredAt { get; private set; }

        private GrammarUserAnswer() { } // EF Core

        public GrammarUserAnswer(
            Guid userId,
            int grammarQuestionId,
            string userAnswer,
            bool isCorrect)
        {
            UserId = userId;
            GrammarQuestionId = grammarQuestionId;
            UserAnswer = userAnswer;
            IsCorrect = isCorrect;
            AnsweredAt = DateTime.UtcNow;

            AddDomainEvent(new GrammarQuestionAnsweredEvent(userId, grammarQuestionId, isCorrect));
        }
    }
}
