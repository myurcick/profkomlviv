using BCrypt.Net;
using ProfkomBackend.Models;

namespace ProfkomBackend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext db)
        {
            if (!db.Admins.Any()) //додаємо адміна якщо таблиця пуста
            {
                var hash = BCrypt.Net.BCrypt.HashPassword("@Admin123");
                db.Admins.Add(new Admin
                {
                    Username = "admin@gmail.com",
                    PasswordHash = hash,
                    Role = "admin"
                });
                db.SaveChanges();
            }
        }
    }
}
