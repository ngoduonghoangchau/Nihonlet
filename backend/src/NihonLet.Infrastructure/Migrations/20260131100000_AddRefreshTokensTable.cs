using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NihonLet.Infrastructure.Migrations
{
  /// <inheritdoc />
  public partial class AddRefreshTokensTable : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "RefreshTokens",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
            TokenHash = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
            TokenFamily = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
            ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
            RevokedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
            ReplacedByTokenId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
            RevokedReason = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
            DeviceFingerprint = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
            DeviceName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
            LastUsedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
            CreatedByIp = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_RefreshTokens", x => x.Id);
            table.ForeignKey(
                      name: "FK_RefreshTokens_AspNetUsers_UserId",
                      column: x => x.UserId,
                      principalTable: "AspNetUsers",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Cascade);
          });

      // Unique index on TokenHash for fast lookup
      migrationBuilder.CreateIndex(
          name: "IX_RefreshTokens_TokenHash",
          table: "RefreshTokens",
          column: "TokenHash",
          unique: true);

      // Index on UserId for getting user's sessions
      migrationBuilder.CreateIndex(
          name: "IX_RefreshTokens_UserId",
          table: "RefreshTokens",
          column: "UserId");

      // Index on TokenFamily for revoking entire family (reuse attack detection)
      migrationBuilder.CreateIndex(
          name: "IX_RefreshTokens_TokenFamily",
          table: "RefreshTokens",
          column: "TokenFamily");

      // Composite index for finding active tokens by user and fingerprint
      migrationBuilder.CreateIndex(
          name: "IX_RefreshTokens_UserId_DeviceFingerprint",
          table: "RefreshTokens",
          columns: new[] { "UserId", "DeviceFingerprint" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "RefreshTokens");
    }
  }
}
