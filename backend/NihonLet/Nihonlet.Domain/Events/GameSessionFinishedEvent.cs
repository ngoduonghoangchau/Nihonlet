using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class GameSessionFinishedEvent : BaseEvent
    {
        public Guid UserId { get; }
        public int GameId { get; }
        public int Score { get; }
        public int Duration { get; }

        public GameSessionFinishedEvent(Guid userId, int gameId, int score, int duration)
        {
            UserId = userId;
            GameId = gameId;
            Score = score;
            Duration = duration;
        }
    }
}
