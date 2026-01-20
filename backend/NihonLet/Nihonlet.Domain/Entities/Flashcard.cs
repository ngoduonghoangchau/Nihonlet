using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;

namespace Nihonlet.Domain.Entities
{
    public class Flashcard : BaseAuditableEntity
    {
        public int FlashcardSetId { get; private set; }

        public string FrontText { get; private set; } = null!;

        public string BackText { get; private set; } = null!;

        public string? ExampleSentence { get; private set; }

        public string? Pronunciation { get; private set; }

        public string Level { get; private set; } = null!; // N5, N4, ...

        public new FlashcardSetSource CreatedBy { get; private set; }

        private Flashcard() { } // EF Core

        public Flashcard(int flashcardSetId, string frontText, string backText, string level, FlashcardSetSource createdBy, string? exampleSentence = null, string? pronunciation = null)
        {
            FlashcardSetId = flashcardSetId;
            FrontText = frontText;
            BackText = backText;
            Level = level;
            CreatedBy = createdBy;
            ExampleSentence = exampleSentence;
            Pronunciation = pronunciation;
        }

        public void UpdateContent(string frontText, string backText, string? exampleSentence, string? pronunciation)
        {
            FrontText = frontText;
            BackText = backText;
            ExampleSentence = exampleSentence;
            Pronunciation = pronunciation;
        }
    }
}
