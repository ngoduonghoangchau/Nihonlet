using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class FlashcardReviewedEvent : BaseEvent
    {
        public Guid UserId { get; }
        public int FlashcardId { get; }
        public bool IsCorrect { get; }
        public int MasteryLevel { get; }

        public FlashcardReviewedEvent(Guid userId, int flashcardId, bool isCorrect, int masteryLevel)
        {
            UserId = userId;
            FlashcardId = flashcardId;
            IsCorrect = isCorrect;
            MasteryLevel = masteryLevel;
        }
    }
}
