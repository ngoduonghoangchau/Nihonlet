using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class FlashcardSet : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public string Title { get; private set; } = null!;

        public FlashcardSetSource Source { get; private set; }

        public bool IsPublic { get; private set; }

        public bool IsPremiumOnly { get; private set; }

        private readonly List<Flashcard> _flashcards = [];
        public IReadOnlyCollection<Flashcard> Flashcards => _flashcards.AsReadOnly();

        private FlashcardSet() { } // EF Core

        private FlashcardSet(Guid userId, string title, FlashcardSetSource source, bool isPremiumOnly)
        {
            UserId = userId;
            Title = title;
            Source = source;
            IsPremiumOnly = isPremiumOnly;
            IsPublic = false;
        }

        /// <summary>
        /// Factory method cho tạo FlashcardSet thủ công
        /// </summary>
        public static FlashcardSet CreateManual(Guid userId, string title, bool isPremiumOnly = false)
        {
            return new FlashcardSet(userId, title, FlashcardSetSource.Manual, isPremiumOnly
             );
        }

        /// <summary>
        /// Factory method cho tạo FlashcardSet bằng AI
        /// </summary>
        public static FlashcardSet CreateByAI(Guid userId, string title, bool isPremiumOnly = true)
        {
            var set = new FlashcardSet(userId, title, FlashcardSetSource.AI, isPremiumOnly);

            set.AddDomainEvent(new FlashcardSetGeneratedByAIEvent(set.Id));
            return set;
        }

        public void Publish()
        {
            if (IsPublic)
                return;

            IsPublic = true;

            AddDomainEvent(new FlashcardSetPublishedEvent(Id));
        }

        public void AddFlashcard(Flashcard flashcard)
        {
            _flashcards.Add(flashcard);
        }
    }
}
