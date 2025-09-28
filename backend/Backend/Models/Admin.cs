using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace ProfkomBackend.Models
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "admin";
    }
}
