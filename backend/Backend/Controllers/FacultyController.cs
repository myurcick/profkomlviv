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
    [Route("api/faculties")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public FacultyController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // GET: api/faculties
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Faculty>>> GetAll()
        {
            return await _db.Faculties
                .Include(f => f.Head) // Підтягуємо пов'язану модель Team
                .ToListAsync();
        }

        // GET: api/faculties/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Faculty>> GetById(int id)
        {
            var faculty = await _db.Faculties
                .Include(f => f.Head)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (faculty == null)
            {
                return NotFound();
            }

            return faculty;
        }

        // POST: api/faculties
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Faculty>> Create([FromForm] FacultyFormData formData)
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
                var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "faculties");
                Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Image.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/faculties/{fileName}";
            }

            var faculty = new Faculty
            {
                Name = formData.Name,
                Head = headTeam,
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

            _db.Faculties.Add(faculty);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = faculty.Id }, faculty);
        }

        // PUT: api/faculties/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] FacultyFormData formData)
        {
            var faculty = await _db.Faculties
                .Include(f => f.Head) 
                .FirstOrDefaultAsync(f => f.Id == id);

            if (faculty == null)
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

            if (faculty.Head != null && faculty.Head.Id != formData.HeadId)
            {
                faculty.Head.IsChoosed = false;
                _db.Team.Update(faculty.Head);
            }

            if (newHead != null && newHead.Id != faculty.Head?.Id)
            {
                newHead.IsChoosed = true;
                _db.Team.Update(newHead);
            }
            
            string? imageUrl = faculty.ImageUrl;
            if (formData.Image != null && formData.Image.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "faculties");
                Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Image.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Image.CopyToAsync(stream);
                }

                if (!string.IsNullOrEmpty(faculty.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, faculty.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }
                imageUrl = $"/uploads/faculties/{fileName}";
            }

            faculty.Name = formData.Name;
            faculty.Head = newHead;
            faculty.Address = formData.Address;
            faculty.Room = formData.Room;
            faculty.Instagram_Link = formData.Instagram_Link;
            faculty.Telegram_Link = formData.Telegram_Link;
            faculty.ImageUrl = imageUrl ?? formData.ImageUrl;
            faculty.Schedule = formData.Schedule;
            faculty.Summary = formData.Summary;
            faculty.IsActive = formData.IsActive;
            faculty.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/faculties/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var faculty = await _db.Faculties
                .Include(f => f.Head)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (faculty == null)
            {
                return NotFound();
            }

            if (faculty.Head != null)
            {
                faculty.Head.IsChoosed = false;
            }

            // Видаляємо файл, пов'язаний з факультетом
            if (!string.IsNullOrEmpty(faculty.ImageUrl))
            {
                 var filePath = Path.Combine(_env.ContentRootPath, faculty.ImageUrl.TrimStart('/'));
                 if (System.IO.File.Exists(filePath))
                 {
                     System.IO.File.Delete(filePath);
                 }
            }

            _db.Faculties.Remove(faculty);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

    public class FacultyFormData
    {
        public string Name { get; set; } = string.Empty;
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