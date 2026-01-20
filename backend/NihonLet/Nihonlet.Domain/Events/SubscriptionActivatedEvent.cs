using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;

namespace Nihonlet.Domain.Events
{
    public sealed class SubscriptionActivatedEvent : BaseEvent
    {
        public Guid UserId { get; }
        public SubscriptionPlanType PlanType { get; }

        public SubscriptionActivatedEvent(Guid userId, SubscriptionPlanType planType)
        {
            UserId = userId;
            PlanType = planType;
        }
    }
}
