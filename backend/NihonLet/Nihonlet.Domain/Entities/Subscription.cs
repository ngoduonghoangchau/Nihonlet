using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class Subscription : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public SubscriptionPlanType PlanType { get; private set; }

        public DateTime StartDate { get; private set; }

        public DateTime? EndDate { get; private set; }

        public SubscriptionStatus Status { get; private set; }

        private Subscription() { } // EF Core

        public Subscription(Guid userId, SubscriptionPlanType planType)
        {
            UserId = userId;
            PlanType = planType;
            StartDate = DateTime.UtcNow;
            Status = SubscriptionStatus.Active;

            AddDomainEvent(new SubscriptionActivatedEvent(userId, planType));
        }

        public void Expire()
        {
            if (Status != SubscriptionStatus.Active)
                return;

            Status = SubscriptionStatus.Expired;
            EndDate = DateTime.UtcNow;

            AddDomainEvent(new SubscriptionExpiredEvent(UserId));
        }

        public void Cancel()
        {
            if (Status == SubscriptionStatus.Cancelled)
                return;

            Status = SubscriptionStatus.Cancelled;
            EndDate = DateTime.UtcNow;

            AddDomainEvent(new SubscriptionCancelledEvent(UserId));
        }
    }
}
