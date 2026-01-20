using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{

    public sealed class FlashcardSetPublishedEvent : BaseEvent
    {
        public int FlashcardSetId { get; }

        public FlashcardSetPublishedEvent(int flashcardSetId)
        {
            FlashcardSetId = flashcardSetId;
        }
    }
}
