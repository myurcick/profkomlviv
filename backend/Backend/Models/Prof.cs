using System.ComponentModel.DataAnnotations;
namespace ProfkomBackend.Models
{
    public class Prof
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Head { get; set; } = string.Empty;
        public string? email { get; set; }
        public string? adress { get; set; }
        public string? schedule { get; set; }
        public string? summary { get; set; }
        public string? facultyURL { get; set; }
        public string? link { get; set; }
        public int orderInd { get; set; }
        public bool isActive { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
