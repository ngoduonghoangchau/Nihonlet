using Nihonlet.Domain.Common;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class GameSession : EventfulEntity
    {
        public int GameId { get; private set; }

        public Guid UserId { get; private set; }

        public int Score { get; private set; }

        /// <summary>
        /// Thời gian chơi (giây)
        /// </summary>
        public int Duration { get; private set; }

        public DateTime PlayedAt { get; private set; }

        private GameSession() { } // EF Core

        public GameSession(int gameId, Guid userId, int score, int duration)
        {
            GameId = gameId;
            UserId = userId;
            Score = score;
            Duration = duration;
            PlayedAt = DateTime.UtcNow;

            AddDomainEvent(new GameSessionFinishedEvent(userId, gameId, score, duration));
        }
    }
}
