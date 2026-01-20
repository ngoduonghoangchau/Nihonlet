using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class GrammarQuestionAnsweredEvent : BaseEvent
    {
        public Guid UserId { get; }
        public int GrammarQuestionId { get; }
        public bool IsCorrect { get; }

        public GrammarQuestionAnsweredEvent(Guid userId, int grammarQuestionId, bool isCorrect)
        {
            UserId = userId;
            GrammarQuestionId = grammarQuestionId;
            IsCorrect = isCorrect;
        }
    }
}
