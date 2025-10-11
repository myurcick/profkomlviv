using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProfkomBackend.Models
{
    public class Unit
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int OrderInd { get; set; }
        [JsonPropertyName("is_active")]
        public bool IsActive { get; set; } = true; // «м≥нено на IsActive, але збережено JsonPropertyName дл€ сум≥сност≥
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}