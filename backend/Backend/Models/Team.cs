using System;
using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Position { get; set; } = string.Empty;

        public string? Content { get; set; }        // необов’язково
        public string? ImageUrl { get; set; }       // необов’язково
        public string? Email { get; set; }          // необов’язково
        public string? Phone { get; set; }          // необов’язково

        [Required]
        public int OrderInd { get; set; }           // number у фронті

        [Required]
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // created_at
    }
}
