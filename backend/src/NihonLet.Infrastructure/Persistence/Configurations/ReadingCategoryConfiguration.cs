using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Learning;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity ReadingCategory
/// </summary>
public class ReadingCategoryConfiguration : IEntityTypeConfiguration<ReadingCategory>
{
    public void Configure(EntityTypeBuilder<ReadingCategory> builder)
    {
        builder.ToTable("ReadingCategories");
        
        builder.HasKey(c => c.CatId);
        
        builder.Property(c => c.NameVi)
            .HasMaxLength(100);
        
        builder.Property(c => c.NameJp)
            .HasMaxLength(100);
        
        builder.Property(c => c.IconUrl)
            .HasMaxLength(500);
        
        // Relationship
        builder.HasMany(c => c.Articles)
            .WithOne(a => a.Category)
            .HasForeignKey(a => a.CatId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
