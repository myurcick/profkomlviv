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
    public class UnitController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public UnitController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // ✅ GET: api/unit - доступно всім
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Unit>>> GetAll()
        {
            return await _db.Unit.ToListAsync();
        }

        // ✅ GET: api/unit/{id} - доступно всім
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Unit>> GetById(int id)
        {
            var unit = await _db.Unit.FindAsync(id);
            if (unit == null) return NotFound();
            return unit;
        }

        // 🔒 POST: api/unit - тільки адмін
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Unit>> Create([FromForm] UnitFormData formData)
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

            var unit = new Unit
            {
                Name = formData.Name,
                Content = formData.Content,
                OrderInd = formData.OrderInd,
                IsActive = formData.IsActive,
                ImageUrl = imageUrl ?? formData.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _db.Unit.Add(unit);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = unit.Id }, unit);
        }

        // 🔒 PUT: api/unit/{id} - тільки адмін
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UnitFormData formData)
        {
            var unit = await _db.Unit.FindAsync(id);
            if (unit == null) return NotFound();
            if (id != unit.Id) return BadRequest();

            string? imageUrl = unit.ImageUrl;

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

            unit.Name = formData.Name;
            unit.Content = formData.Content;
            unit.OrderInd = formData.OrderInd;
            unit.IsActive = formData.IsActive;
            unit.ImageUrl = imageUrl ?? formData.ImageUrl;
            unit.UpdatedAt = DateTime.UtcNow;

            _db.Entry(unit).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // 🔒 DELETE: api/unit/{id} - тільки адмін
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var unit = await _db.Unit.FindAsync(id);
            if (unit == null) return NotFound();

            _db.Unit.Remove(unit);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO для обробки вхідних даних
    public class UnitFormData
    {
        public string Name { get; set; } = string.Empty;
        public string? Content { get; set; }
        public int OrderInd { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
    }
}