using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class FlashcardMasteredEvent : BaseEvent
    {
        public Guid UserId { get; }
        public int FlashcardId { get; }

        public FlashcardMasteredEvent(Guid userId, int flashcardId)
        {
            UserId = userId;
            FlashcardId = flashcardId;
        }
    }
}
