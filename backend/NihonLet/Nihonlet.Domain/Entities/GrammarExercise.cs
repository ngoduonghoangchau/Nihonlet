using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Entities
{
    public class GrammarExercise : BaseAuditableEntity
    {
        public string Title { get; private set; } = null!;

        /// <summary>
        /// JLPT level: N5, N4, ...
        /// </summary>
        public string Level { get; private set; } = null!;

        public bool IsPremium { get; private set; }

        private readonly List<GrammarQuestion> _questions = [];
        public IReadOnlyCollection<GrammarQuestion> Questions => _questions.AsReadOnly();

        private GrammarExercise() { } // EF Core

        public GrammarExercise(string title, string level, bool isPremium)
        {
            Title = title;
            Level = level;
            IsPremium = isPremium;
        }

        public void UpdateInfo(string title, string level, bool isPremium)
        {
            Title = title;
            Level = level;
            IsPremium = isPremium;
        }
    }
}
