using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;
using Nihonlet.Domain.Events;

namespace Nihonlet.Domain.Entities
{
    public class Payment : EventfulEntity
    {
        public Guid UserId { get; private set; }

        public decimal Amount { get; private set; }

        public string Currency { get; private set; } = null!;

        public PaymentMethod PaymentMethod { get; private set; }

        public PaymentStatus Status { get; private set; }

        public DateTime? PaidAt { get; private set; }

        private Payment() { } // EF Core

        public Payment(Guid userId, decimal amount, string currency, PaymentMethod paymentMethod)
        {
            UserId = userId;
            Amount = amount;
            Currency = currency;
            PaymentMethod = paymentMethod;
            Status = PaymentStatus.Pending;
        }

        public void MarkAsSucceeded()
        {
            if (Status == PaymentStatus.Succeeded)
                return;

            Status = PaymentStatus.Succeeded;
            PaidAt = DateTime.UtcNow;

            AddDomainEvent(new PaymentSucceededEvent(UserId, Amount, Currency, PaymentMethod));
        }

        public void MarkAsFailed()
        {
            if (Status == PaymentStatus.Failed)
                return;

            Status = PaymentStatus.Failed;
        }
    }
}
