using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace ProfkomBackend.Models
{
    public enum MemberType
    {
        Aparat,
        Profburo,
        Viddil
    }

    public class Team
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Position { get; set; } = string.Empty;

        [Required]
        public MemberType Type { get; set; }

        public string? ImageUrl { get; set; }
        public string? Email { get; set; }

        [Required]
        public int OrderInd { get; set; }           // number у фронті

        [Required]
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // created_at

        public bool IsChoosed { get; set; } = false;
    }
}
