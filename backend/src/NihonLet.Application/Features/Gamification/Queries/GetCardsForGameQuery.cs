using MediatR;
using NihonLet.Application.Features.Gamification.DTOs;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Gamification.Queries;

public record GetCardsForGameQuery(List<int> DeckIds, int Limit) : IRequest<List<GameCardDto>>;

public class GetCardsForGameQueryHandler : IRequestHandler<GetCardsForGameQuery, List<GameCardDto>>
{
    private readonly IDeckRepository _deckRepository;

    public GetCardsForGameQueryHandler(IDeckRepository deckRepository)
    {
        _deckRepository = deckRepository;
    }

    public async Task<List<GameCardDto>> Handle(GetCardsForGameQuery request, CancellationToken cancellationToken)
    {
        // 1. Lấy tất cả các Deck cùng với Cards của chúng
        var decks = await _deckRepository.GetDecksByIdsAsync(request.DeckIds);

        // 2. Gộp tất cả Card từ các bộ thẻ đã chọn
        var allCards = decks.SelectMany(d => d.Cards).ToList();

        // 3. Xáo trộn ngẫu nhiên và lấy theo số lượng Limit
        var randomCards = allCards
            .OrderBy(arg => Guid.NewGuid()) // Xáo trộn ngẫu nhiên (SQL sẽ dùng NEWID())
            .Take(request.Limit)
            .Select(c => new GameCardDto
            {
                CardId = c.CardId,
                Kanji = c.Kanji ?? c.Reading, // Nếu không có Kanji thì lấy Reading làm mặt chữ
                Reading = c.Reading,
                Meaning = c.Meaning
            })
            .ToList();

        return randomCards;
    }
}