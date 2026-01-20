using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Entities
{
    public class Game : BaseAuditableEntity
    {
        public string Name { get; private set; } = null!;

        /// <summary>
        /// QUIZ, MATCHING, TYPING, ...
        /// </summary>
        public string GameType { get; private set; } = null!;

        public string? Description { get; private set; }

        public bool IsPremium { get; private set; }

        public bool IsActive { get; private set; }

        private Game() { } // EF Core

        public Game(string name, string gameType, bool isPremium, bool isActive, string? description = null)
        {
            Name = name;
            GameType = gameType;
            IsPremium = isPremium;
            IsActive = isActive;
            Description = description;
        }

        public void UpdateInfo(string name, string gameType, bool isPremium, bool isActive, string? description)
        {
            Name = name;
            GameType = gameType;
            IsPremium = isPremium;
            IsActive = isActive;
            Description = description;
        }
    }
}
