using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models
{
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FromName { get; set; }
        [Required]
        public string FromEmail { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
