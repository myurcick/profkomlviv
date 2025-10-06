using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProfkomBackend.Data;
using ProfkomBackend.Models;

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

        // GET: api/prof
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Prof>>> GetAll()
        {
            // Підтягуємо Head з Team
            return await _db.Prof
                .Include(p => p.Head) // Team
                .ToListAsync();
        }

        // GET: api/prof/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Prof>> GetById(int id)
        {
            var prof = await _db.Prof
                .Include(p => p.Head)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prof == null)
            {
                return NotFound();
            }

            return prof;
        }

        // POST: api/prof
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Prof>> Create([FromForm] ProfFormData formData)
        {
            Team? headTeam = null;
            if (formData.HeadId.HasValue)
            {
                headTeam = await _db.Team.FirstOrDefaultAsync(t => t.Id == formData.HeadId && t.IsActive);
                if (headTeam == null)
                {
                    return BadRequest("Invalid HeadId or team member is inactive.");
                }

                headTeam.IsChoosed = true;
                _db.Team.Update(headTeam);
            }

            string? imageUrl = null;
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
                Head = headTeam, // прив’язка до Team
                Address = formData.Address,
                Room = formData.Room,
                Instagram_Link = formData.Instagram_Link,
                Telegram_Link = formData.Telegram_Link,
                ImageUrl = imageUrl ?? formData.ImageUrl,
                Schedule = formData.Schedule,
                Summary = formData.Summary,
                IsActive = formData.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _db.Prof.Add(prof);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = prof.Id }, prof);
        }

        // PUT: api/prof/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] ProfFormData formData)
        {
            var prof = await _db.Prof
                .Include(p => p.Head) // щоб завантажити старого голову
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prof == null)
            {
                return NotFound();
            }

            Team? newHead = null;

            if (formData.HeadId.HasValue)
            {
                newHead = await _db.Team.FirstOrDefaultAsync(t => t.Id == formData.HeadId && t.IsActive);
                if (newHead == null)
                {
                    return BadRequest("Invalid HeadId or team member is inactive.");
                }
            }

            // --- робота з головами ---
            if (prof.Head != null && prof.Head.Id != formData.HeadId)
            {
                // звільняємо попереднього голову
                prof.Head.IsChoosed = false;
                _db.Team.Update(prof.Head);
            }

            if (newHead != null && newHead.Id != prof.Head?.Id)
            {
                // ставимо нового голову як обраного
                newHead.IsChoosed = true;
                _db.Team.Update(newHead);
            }

            // --- робота з картинкою ---
            string? imageUrl = prof.ImageUrl;
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

                // видаляємо старе фото, якщо було
                if (!string.IsNullOrEmpty(prof.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, prof.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                imageUrl = $"/Uploads/{fileName}";
            }

            // --- оновлення профбюро ---
            prof.Name = formData.Name;
            prof.Head = newHead;
            prof.Address = formData.Address;
            prof.Room = formData.Room;
            prof.Instagram_Link = formData.Instagram_Link;
            prof.Telegram_Link = formData.Telegram_Link;
            prof.ImageUrl = imageUrl ?? formData.ImageUrl;
            prof.Schedule = formData.Schedule;
            prof.Summary = formData.Summary;
            prof.IsActive = formData.IsActive;
            prof.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/prof/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var prof = await _db.Prof
                .Include(p => p.Head) // Включаємо Head для можливості оновлення IsChoosed
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prof == null)
            {
                return NotFound();
            }

            // Якщо є прив'язаний голова, звільняємо його
            if (prof.Head != null)
            {
                prof.Head.IsChoosed = false;
            }

            _db.Prof.Remove(prof);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO для обробки вхідних даних
    public class ProfFormData
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // 🔹 Замість Head/Email вводимо HeadId з Team
        public int? HeadId { get; set; }

        public string? Address { get; set; }
        public string? Room { get; set; }
        public string? Instagram_Link { get; set; }
        public string? Telegram_Link { get; set; }
        public string? ImageUrl { get; set; }
        public string? Schedule { get; set; }
        public string? Summary { get; set; }
        public bool IsActive { get; set; } = true;
        public IFormFile? Image { get; set; }
    }
}