using System;
using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models
{
    public class Prof
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // 🔹 Тут буде зв’язок з Team
        public int? HeadId { get; set; }
        public Team? Head { get; set; }

        public string? Address { get; set; }
        public string? Room { get; set; }
        public string? Schedule { get; set; }
        public string? Summary { get; set; }
        public string? Instagram_Link { get; set; }
        public string? Telegram_Link { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
