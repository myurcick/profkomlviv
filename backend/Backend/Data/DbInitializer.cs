using BCrypt.Net;
using ProfkomBackend.Models;

namespace ProfkomBackend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext db)
        {
            // ✅ Створення таблиць, якщо їх ще нема
            db.Database.EnsureCreated();

            // ✅ Додаємо першого адміна, якщо таблиця пуста
            if (!db.Admins.Any())
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
