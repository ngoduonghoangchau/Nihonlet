using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nihonlet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGrammarQuestionAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserAnswer",
                table: "GrammarUserAnswers");

            migrationBuilder.DropColumn(
                name: "CorrectAnswer",
                table: "GrammarQuestions");

            migrationBuilder.AddColumn<int>(
                name: "SelectedOptionId",
                table: "GrammarUserAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "GrammarQuestionOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrammarQuestionId = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrammarQuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrammarQuestionOptions_GrammarQuestions_GrammarQuestionId",
                        column: x => x.GrammarQuestionId,
                        principalTable: "GrammarQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GrammarQuestionOptions_GrammarQuestionId",
                table: "GrammarQuestionOptions",
                column: "GrammarQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarQuestionOptions_GrammarQuestionId_Label",
                table: "GrammarQuestionOptions",
                columns: new[] { "GrammarQuestionId", "Label" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrammarQuestionOptions");

            migrationBuilder.DropColumn(
                name: "SelectedOptionId",
                table: "GrammarUserAnswers");

            migrationBuilder.AddColumn<string>(
                name: "UserAnswer",
                table: "GrammarUserAnswers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CorrectAnswer",
                table: "GrammarQuestions",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");
        }
    }
}
