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
    public class ProfController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public ProfController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // ✅ GET: api/prof - доступно всім
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Prof>>> GetAll()
        {
            return await _db.Prof
                .Where(p => p.isActive)
                .ToListAsync();
        }

        // ✅ GET: api/prof/{id} - доступно всім
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Prof>> GetById(int id)
        {
            var prof = await _db.Prof.FindAsync(id);
            if (prof == null) return NotFound();
            return prof;
        }

        // 🔒 POST: api/prof - тільки адмін
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Prof>> Create([FromForm] ProfFormData formData)
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

            var prof = new Prof
            {
                Name = formData.Name,
                Head = formData.Head,
                email = formData.Email,
                adress = formData.Adress,
                schedule = formData.Schedule,
                summary = formData.Summary,
                facultyURL = formData.FacultyURL,
                link = formData.Link,
                orderInd = formData.OrderInd,
                isActive = formData.IsActive,
                ImageUrl = imageUrl ?? formData.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _db.Prof.Add(prof);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = prof.Id }, prof);
        }

        // 🔒 PUT: api/prof/{id} - тільки адмін
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] ProfFormData formData)
        {
            var prof = await _db.Prof.FindAsync(id);
            if (prof == null) return NotFound();
            if (id != prof.Id) return BadRequest();

            string? imageUrl = prof.ImageUrl;

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

            prof.Name = formData.Name;
            prof.Head = formData.Head;
            prof.email = formData.Email;
            prof.adress = formData.Adress;
            prof.schedule = formData.Schedule;
            prof.summary = formData.Summary;
            prof.facultyURL = formData.FacultyURL;
            prof.link = formData.Link;
            prof.orderInd = formData.OrderInd;
            prof.isActive = formData.IsActive;
            prof.ImageUrl = imageUrl ?? formData.ImageUrl;
            prof.UpdatedAt = DateTime.UtcNow;

            _db.Entry(prof).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // 🔒 DELETE: api/prof/{id} - тільки адмін
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var prof = await _db.Prof.FindAsync(id);
            if (prof == null) return NotFound();

            _db.Prof.Remove(prof);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO для обробки вхідних даних
    public class ProfFormData
    {
        public string Name { get; set; } = string.Empty;
        public string Head { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Adress { get; set; }
        public string? Schedule { get; set; }
        public string? Summary { get; set; }
        public string? FacultyURL { get; set; }
        public string? Link { get; set; }
        public int OrderInd { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
    }
}