using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models //�������� �� ������ ��� ������� ���������� ���������
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Location { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}
