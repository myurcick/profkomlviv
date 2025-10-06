using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace ProfkomBackend.Models
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "admin";
    }
}
