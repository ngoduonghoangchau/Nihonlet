using Nihonlet.Domain.Common;
using Nihonlet.Domain.Enums;

namespace Nihonlet.Domain.Events
{
    public sealed class PaymentSucceededEvent : BaseEvent
    {
        public Guid UserId { get; }
        public decimal Amount { get; }
        public string Currency { get; }
        public PaymentMethod PaymentMethod { get; }

        public PaymentSucceededEvent(Guid userId, decimal amount, string currency, PaymentMethod paymentMethod)
        {
            UserId = userId;
            Amount = amount;
            Currency = currency;
            PaymentMethod = paymentMethod;
        }
    }
}
