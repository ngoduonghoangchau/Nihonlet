using System.Text.Json;
using MediatR;
using NihonLet.Application.Common.Interfaces;
using NihonLet.Application.Features.Gamification.DTOs;
using NihonLet.Domain.Entities.Gamification;
using NihonLet.Domain.Interfaces;


namespace NihonLet.Application.Features.Gamification.Commands;

public record SaveRewritingSessionCommand(SaveSessionRequest Request) : IRequest<int>;

public class SaveRewritingSessionCommandHandler : IRequestHandler<SaveRewritingSessionCommand, int>
{
    private readonly IGameRepository _gameRepository;
    private readonly ICurrentUserService _currentUserService;

    public SaveRewritingSessionCommandHandler(IGameRepository gameRepository, ICurrentUserService currentUserService)
    {
        _gameRepository = gameRepository;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(SaveRewritingSessionCommand command, CancellationToken ct)
    {
        var request = command.Request;

        var session = new GameSession
        {
            UserId = _currentUserService.UserId!,
            WordCount = request.WordCount,
            SelectedDecksJson = request.SelectedDecksJson, // Lưu mảng ID bộ thẻ [1, 2]
            TotalScore = request.TotalScore,
            Accuracy = request.Accuracy,
            PlayedAt = DateTime.UtcNow
        };

        await _gameRepository.AddSessionAsync(session);
        await _gameRepository.SaveChangesAsync();

        return session.GameId;
    }
}