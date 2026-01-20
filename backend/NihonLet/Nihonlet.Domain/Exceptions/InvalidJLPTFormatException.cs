namespace Nihonlet.Domain.Exceptions
{
    public sealed class InvalidJLPTFormatException : DomainException
    {
        public InvalidJLPTFormatException(string value)
            : base($"Invalid JLPT level format: '{value}'. Expected N1–N5.")
        {
        }
    }
}
