namespace Nihonlet.Domain.Common
{
    public abstract class BaseAuditableEntity : BaseEntity
    {
        public DateTimeOffset Created { get; internal set; }

        public string? CreatedBy { get; internal set; }

        public DateTimeOffset LastModified { get; internal set; }

        public string? LastModifiedBy { get; internal set; }
    }
}
