using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProfkomBackend.Data;
using ProfkomBackend.Models;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ProfkomBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public TeamController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // ✅ GET: api/team - доступно всім
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Team>>> GetAll()
        {
            return await _db.Team.ToListAsync();
        }

        // ✅ GET: api/team/{id} - доступно всім
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Team>> GetById(int id)
        {
            var member = await _db.Team.FindAsync(id);
            if (member == null) return NotFound();
            return member;
        }

        // 🔒 POST: api/team - тільки адмін
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Team>> Create([FromForm] TeamFormData formData)
        {
            string? imageUrl = null;

            // Обробка файлу, якщо він наданий
            if (formData.Image != null && formData.Image.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Image.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Image.CopyToAsync(stream);
                }

                imageUrl = $"/Uploads/{fileName}";
            }

            var member = new Team
            {
                Name = formData.Name,
                Position = formData.Position,
                Content = formData.Content,
                Email = formData.Email,
                Phone = formData.Phone,
                OrderInd = formData.OrderInd,
                IsActive = formData.IsActive,
                ImageUrl = imageUrl ?? formData.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _db.Team.Add(member);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = member.Id }, member);
        }

        // 🔒 PUT: api/team/{id} - тільки адмін
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] TeamFormData formData)
        {
            var member = await _db.Team.FindAsync(id);
            if (member == null) return NotFound();
            if (id != member.Id) return BadRequest();

            string? imageUrl = member.ImageUrl;

            // Обробка нового файлу, якщо наданий
            if (formData.Image != null && formData.Image.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Image.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Image.CopyToAsync(stream);
                }

                imageUrl = $"/Uploads/{fileName}";
            }

            member.Name = formData.Name;
            member.Position = formData.Position;
            member.Content = formData.Content;
            member.Email = formData.Email;
            member.Phone = formData.Phone;
            member.OrderInd = formData.OrderInd;
            member.IsActive = formData.IsActive;
            member.ImageUrl = imageUrl ?? formData.ImageUrl;
            member.CreatedAt = DateTime.UtcNow;

            _db.Entry(member).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // 🔒 DELETE: api/team/{id} - тільки адмін
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var member = await _db.Team.FindAsync(id);
            if (member == null) return NotFound();

            _db.Team.Remove(member);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO для обробки вхідних даних
    public class TeamFormData
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public int OrderInd { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
    }
}