using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models
{
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FromName { get; set; } = string.Empty;
        [Required]
        public string FromEmail { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
