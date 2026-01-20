using Nihonlet.Domain.Common;
using Nihonlet.Domain.Exceptions;
using Nihonlet.Domain.Constants;

namespace Nihonlet.Domain.ValueObjects;

public sealed class JLPTLevel : ValueObject
{
    public int Rank { get; }

    private JLPTLevel(int rank)
    {
        Rank = rank;
    }

    public static JLPTLevel FromString(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new InvalidJLPTFormatException(value);

        value = value.Trim().ToUpperInvariant();

        if (!value.StartsWith("N") ||
            !int.TryParse(value[1..], out var rank) ||
            rank < JLPT.MinLevel ||
            rank > JLPT.MaxLevel)
        {
            throw new InvalidJLPTFormatException(value);
        }

        return new JLPTLevel(rank);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Rank;
    }

    public override string ToString() => $"N{Rank}";
}