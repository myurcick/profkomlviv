using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Models //заглушка під івенти далі зробимо повноцінну реалізацію
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Location { get; set; }
        public string? ImageUrl { get; set; }
    }
}
