using MediatR;
using NihonLet.Domain.Interfaces;
using NihonLet.Application.Common.Interfaces;

namespace NihonLet.Application.Features.Flashcards.Commands;

public record UpdateDeckMasteryCommand(int DeckId, int MasteryPercent) : IRequest<bool>;

public class UpdateDeckMasteryHandler : IRequestHandler<UpdateDeckMasteryCommand, bool>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateDeckMasteryHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateDeckMasteryCommand request, CancellationToken cancellationToken)
    {
        // Clamp giá trị mastery trong khoảng hợp lệ [0..100]
        var mastery = Math.Clamp(request.MasteryPercent, 0, 100);

        var userId = _currentUserService.UserId;
        var deck = await _deckRepository.GetByIdAsync(request.DeckId);

        if (deck == null || deck.UserId != userId) 
            return false;

        deck.MasteryPercent = mastery;
        await _deckRepository.SaveChangesAsync();

        return true;
    }
}