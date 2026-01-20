using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class SubscriptionExpiredEvent : BaseEvent
    {
        public Guid UserId { get; }

        public SubscriptionExpiredEvent(Guid userId)
        {
            UserId = userId;
        }
    }
}
