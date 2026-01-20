using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class FlashcardSetGeneratedByAIEvent : BaseEvent
    {
        public int FlashcardSetId { get; }

        public FlashcardSetGeneratedByAIEvent(int flashcardSetId)
        {
            FlashcardSetId = flashcardSetId;
        }
    }
}
