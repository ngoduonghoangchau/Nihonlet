using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NihonLet.Domain.Entities.Identity;
using NihonLet.Infrastructure.Identity;

namespace NihonLet.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration cho entity RefreshToken
/// </summary>
public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
  public void Configure(EntityTypeBuilder<RefreshToken> builder)
  {
    builder.ToTable("RefreshTokens");

    builder.HasKey(rt => rt.Id);

    builder.Property(rt => rt.UserId)
        .IsRequired()
        .HasMaxLength(450);

    // TokenHash là SHA-256 hex string (64 chars)
    builder.Property(rt => rt.TokenHash)
        .IsRequired()
        .HasMaxLength(64);

    builder.Property(rt => rt.TokenFamily)
        .IsRequired();

    builder.Property(rt => rt.CreatedAt)
        .IsRequired();

    builder.Property(rt => rt.ExpiresAt)
        .IsRequired();

    builder.Property(rt => rt.RevokedReason)
        .HasMaxLength(50);

    // DeviceFingerprint: alphanumeric, 16-256 chars
    builder.Property(rt => rt.DeviceFingerprint)
        .IsRequired()
        .HasMaxLength(256);

    builder.Property(rt => rt.DeviceName)
        .HasMaxLength(100);

    builder.Property(rt => rt.CreatedByIp)
        .HasMaxLength(45); // IPv6 max length

    // Indexes
    // Unique index on TokenHash for fast lookup
    builder.HasIndex(rt => rt.TokenHash)
        .IsUnique()
        .HasDatabaseName("IX_RefreshTokens_TokenHash");

    // Index on UserId for getting user's sessions
    builder.HasIndex(rt => rt.UserId)
        .HasDatabaseName("IX_RefreshTokens_UserId");

    // Index on TokenFamily for revoking entire family (reuse attack detection)
    builder.HasIndex(rt => rt.TokenFamily)
        .HasDatabaseName("IX_RefreshTokens_TokenFamily");

    // Composite index for finding active tokens by user and fingerprint
    builder.HasIndex(rt => new { rt.UserId, rt.DeviceFingerprint })
        .HasDatabaseName("IX_RefreshTokens_UserId_DeviceFingerprint");

    // Relationship với ApplicationUser
    builder.HasOne<ApplicationUser>()
        .WithMany(u => u.RefreshTokens)
        .HasForeignKey(rt => rt.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // Ignore computed properties
    builder.Ignore(rt => rt.IsActive);
    builder.Ignore(rt => rt.IsExpired);
    builder.Ignore(rt => rt.IsRevoked);
  }
}
