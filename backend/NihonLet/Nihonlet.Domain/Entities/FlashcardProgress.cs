using Nihonlet.Domain.Common;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class FlashcardProgress : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public int FlashcardId { get; private set; }

        public DateTime? LastReviewed { get; private set; }

        public int CorrectCount { get; private set; }

        public int WrongCount { get; private set; }

        /// <summary>
        /// 0–5 (SRS mastery level)
        /// </summary>
        public int MasteryLevel { get; private set; }

        private FlashcardProgress() { } // EF Core

        public FlashcardProgress(Guid userId, int flashcardId)
        {
            UserId = userId;
            FlashcardId = flashcardId;
            MasteryLevel = 0;
        }

        public void Review(bool isCorrect)
        {
            LastReviewed = DateTime.UtcNow;

            if (isCorrect)
            {
                CorrectCount++;
                MasteryLevel = Math.Min(MasteryLevel + 1, 5);
            }
            else
            {
                WrongCount++;
                MasteryLevel = Math.Max(MasteryLevel - 1, 0);
            }

            AddDomainEvent(new FlashcardReviewedEvent(UserId, FlashcardId, isCorrect, MasteryLevel));

            if (MasteryLevel == 5)
            {
                AddDomainEvent(new FlashcardMasteredEvent(UserId, FlashcardId));
            }
        }
    }
}
