using MediatR;
using Nihonlet.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Nihonlet.Application.Flashcards.Commands;

public record DeleteFlashcardSetCommand(int Id) : IRequest<bool>;

public class DeleteFlashcardSetCommandHandler : IRequestHandler<DeleteFlashcardSetCommand, bool>
{
    private readonly IApplicationDbContext _context;
    public DeleteFlashcardSetCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<bool> Handle(DeleteFlashcardSetCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.FlashcardSets
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null) return false;

        _context.FlashcardSets.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}