namespace Nihonlet.Domain.Constants
{
    public static class JLPT
    {
        public const int MinLevel = 1;
        public const int MaxLevel = 5;

        public static readonly IReadOnlySet<int> ValidLevels =
            new HashSet<int> { 1, 2, 3, 4, 5 };
    }
}
