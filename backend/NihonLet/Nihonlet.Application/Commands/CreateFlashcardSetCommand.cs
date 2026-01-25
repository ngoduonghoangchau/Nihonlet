using MediatR;
using Nihonlet.Application.Common.Interfaces;
using Nihonlet.Domain.Entities;
using Nihonlet.Domain.Enums;

namespace Nihonlet.Application.Flashcards.Commands;

public record CreateFlashcardSetCommand : IRequest<int>
{
    public string Title { get; init; } = null!;
    public List<CreateFlashcardDto> Cards { get; init; } = new();
    public Guid UserId { get; set; } // Gán từ Controller
}

public record CreateFlashcardDto(string FrontText, string BackText, string Level, string? ExampleSentence);

public class CreateFlashcardSetCommandHandler : IRequestHandler<CreateFlashcardSetCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateFlashcardSetCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<int> Handle(CreateFlashcardSetCommand request, CancellationToken cancellationToken)
    {
        // 1. Dùng Factory Method của Domain
        var flashcardSet = FlashcardSet.CreateManual(request.UserId, request.Title);

        // 2. Map Cards
        foreach (var cardDto in request.Cards)
        {
            var card = new Flashcard(
                flashcardSetId: 0, 
                frontText: cardDto.FrontText,
                backText: cardDto.BackText,
                level: cardDto.Level,
                createdBy: FlashcardSetSource.Manual,
                exampleSentence: cardDto.ExampleSentence
            );
            flashcardSet.AddFlashcard(card);
        }

        _context.FlashcardSets.Add(flashcardSet);
        await _context.SaveChangesAsync(cancellationToken);

        return flashcardSet.Id;
    }
}