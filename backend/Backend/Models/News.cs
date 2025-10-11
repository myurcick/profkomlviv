using System.ComponentModel.DataAnnotations;
namespace ProfkomBackend.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty; //заголовок
        public string? Content { get; set; } //зміст новини
        public string? ImageUrl { get; set; } //посилання на розташування на сервері
        public bool IsImportant { get; set; } = false; //важлива чи ні 
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow; //час публікації
    }
}