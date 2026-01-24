using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nihonlet.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntityRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Flashcards",
                newName: "Source");

            migrationBuilder.AlterColumn<string>(
                name: "LastModifiedBy",
                table: "GameSessions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "GameSessions",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GrammarUserAnswers_GrammarQuestionId",
                table: "GrammarUserAnswers",
                column: "GrammarQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarUserAnswers_SelectedOptionId",
                table: "GrammarUserAnswers",
                column: "SelectedOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_GrammarExercises_Title_Level",
                table: "GrammarExercises",
                columns: new[] { "Title", "Level" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_GameId",
                table: "GameSessions",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_UserId",
                table: "GameSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_UserId_GameId",
                table: "GameSessions",
                columns: new[] { "UserId", "GameId" });

            migrationBuilder.CreateIndex(
                name: "IX_FlashcardProgress_FlashcardId",
                table: "FlashcardProgress",
                column: "FlashcardId");

            migrationBuilder.AddForeignKey(
                name: "FK_FlashcardProgress_Flashcards_FlashcardId",
                table: "FlashcardProgress",
                column: "FlashcardId",
                principalTable: "Flashcards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_Games_GameId",
                table: "GameSessions",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GrammarQuestions_GrammarExercises_GrammarExerciseId",
                table: "GrammarQuestions",
                column: "GrammarExerciseId",
                principalTable: "GrammarExercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GrammarUserAnswers_GrammarQuestionOptions_SelectedOptionId",
                table: "GrammarUserAnswers",
                column: "SelectedOptionId",
                principalTable: "GrammarQuestionOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GrammarUserAnswers_GrammarQuestions_GrammarQuestionId",
                table: "GrammarUserAnswers",
                column: "GrammarQuestionId",
                principalTable: "GrammarQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlashcardProgress_Flashcards_FlashcardId",
                table: "FlashcardProgress");

            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_Games_GameId",
                table: "GameSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_GrammarQuestions_GrammarExercises_GrammarExerciseId",
                table: "GrammarQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_GrammarUserAnswers_GrammarQuestionOptions_SelectedOptionId",
                table: "GrammarUserAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_GrammarUserAnswers_GrammarQuestions_GrammarQuestionId",
                table: "GrammarUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_GrammarUserAnswers_GrammarQuestionId",
                table: "GrammarUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_GrammarUserAnswers_SelectedOptionId",
                table: "GrammarUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_GrammarExercises_Title_Level",
                table: "GrammarExercises");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_GameId",
                table: "GameSessions");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_UserId",
                table: "GameSessions");

            migrationBuilder.DropIndex(
                name: "IX_GameSessions_UserId_GameId",
                table: "GameSessions");

            migrationBuilder.DropIndex(
                name: "IX_FlashcardProgress_FlashcardId",
                table: "FlashcardProgress");

            migrationBuilder.RenameColumn(
                name: "Source",
                table: "Flashcards",
                newName: "CreatedBy");

            migrationBuilder.AlterColumn<string>(
                name: "LastModifiedBy",
                table: "GameSessions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "GameSessions",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
