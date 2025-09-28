using Microsoft.EntityFrameworkCore;
using ProfkomBackend.Models;

namespace ProfkomBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<Prof> Prof { get; set; }
        public DbSet<Unit> Unit { get; set; }
    }
}
