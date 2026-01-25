namespace Nihonlet.Application.Flashcards.Queries;

// DTO cho danh sách rút gọn
public record FlashcardSetDto(int Id, string Title, int Count, string Level, string CreatedAt);

// DTO cho chi tiết kèm card con
public record FlashcardSetDetailDto(int Id, string Title, string Level, List<FlashcardItemDto> Flashcards);

// DTO cho từng thẻ con
public record FlashcardItemDto(int Id, string FrontText, string BackText, string Level, string? ExampleSentence);