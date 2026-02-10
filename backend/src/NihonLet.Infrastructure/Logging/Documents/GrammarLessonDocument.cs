using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class GrammarLessonDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Title { get; set; } = null!;
    public string Level { get; set; } = null!;
    public string Description { get; set; } = null!;
    public bool IsPremium { get; set; }
    public List<string> Examples { get; set; } = new();
    public List<QuestionDocument> Questions { get; set; } = new();
}


