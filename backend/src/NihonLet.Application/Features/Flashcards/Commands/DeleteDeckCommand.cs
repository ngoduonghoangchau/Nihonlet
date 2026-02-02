using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Domain.Interfaces;

namespace NihonLet.Application.Features.Flashcards.Commands;

public record DeleteDeckCommand(int Id) : IRequest;

public class DeleteDeckCommandHandler : IRequestHandler<DeleteDeckCommand>
{
    private readonly IDeckRepository _deckRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteDeckCommandHandler(IDeckRepository deckRepository, ICurrentUserService currentUserService)
    {
        _deckRepository = deckRepository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteDeckCommand request, CancellationToken cancellationToken)
    {
        var deck = await _deckRepository.GetByIdAsync(request.Id);

        if (deck == null) throw new Exception("Không tìm thấy bộ thẻ.");

        // KIỂM TRA THỰC TẾ: Chỉ chủ sở hữu mới được xóa
        if (deck.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền xóa bộ thẻ này.");
        }

        _deckRepository.Delete(deck);
        await _deckRepository.SaveChangesAsync();
    }
}