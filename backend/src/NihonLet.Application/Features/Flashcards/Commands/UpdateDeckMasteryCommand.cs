using MediatR;
using NihonLet.Domain.Interfaces;
using NihonLet.Application.Common.Interfaces;

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
        var userId = _currentUserService.UserId;
        var deck = await _deckRepository.GetByIdAsync(request.DeckId);

        if (deck == null || deck.UserId != userId) return false;

        // Chỉ cập nhật nếu Mastery mới cao hơn Mastery cũ 
        // if (request.MasteryPercent > deck.MasteryPercent)
        // {
        //     deck.MasteryPercent = request.MasteryPercent;
        //     await _deckRepository.SaveChangesAsync();
        // }

        //thay đổi: luôn cập nhật MasteryPercent khi học thẻ 
        deck.MasteryPercent = request.MasteryPercent;

        // Lưu thay đổi vào DB
        await _deckRepository.SaveChangesAsync();

        return true;

    }
}