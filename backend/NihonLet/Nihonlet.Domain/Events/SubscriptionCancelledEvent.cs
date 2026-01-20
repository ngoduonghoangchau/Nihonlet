using Nihonlet.Domain.Common;

namespace Nihonlet.Domain.Events
{
    public sealed class SubscriptionCancelledEvent : BaseEvent
    {
        public Guid UserId { get; }

        public SubscriptionCancelledEvent(Guid userId)
        {
            UserId = userId;
        }
    }
}
