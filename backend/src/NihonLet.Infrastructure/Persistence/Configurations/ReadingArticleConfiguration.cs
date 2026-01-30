using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Learning;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity ReadingArticle
/// </summary>
public class ReadingArticleConfiguration : IEntityTypeConfiguration<ReadingArticle>
{
    public void Configure(EntityTypeBuilder<ReadingArticle> builder)
    {
        builder.ToTable("ReadingArticles");
        
        builder.HasKey(a => a.ArticleId);
        
        builder.Property(a => a.TitleJp)
            .HasMaxLength(200);
        
        builder.Property(a => a.TitleVi)
            .HasMaxLength(200);
        
        builder.Property(a => a.ContentJp)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(a => a.ContentFurigana)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(a => a.ContentVi)
            .HasColumnType("nvarchar(max)");
        
        builder.Property(a => a.AudioUrl)
            .HasMaxLength(500);
        
        builder.Property(a => a.Level)
            .HasConversion<int>();
        
        builder.Property(a => a.Status)
            .HasConversion<int>();
        
        // Indexes
        builder.HasIndex(a => a.CatId);
        builder.HasIndex(a => a.Level);
    }
}
