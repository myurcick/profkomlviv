﻿using Microsoft.AspNetCore.Mvc;
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
                var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "team");
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

                imageUrl = $"/uploads/team/{fileName}";
            }

            var member = new Team
            {
                Name = formData.Name,
                Position = formData.Position,
                Type = formData.Type,
                Email = formData.Email,
                OrderInd = formData.OrderInd,
                IsActive = formData.IsActive,
                ImageUrl = imageUrl ?? formData.ImageUrl,
                IsChoosed = formData.IsChoosed,
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

            string? oldImageUrl = member.ImageUrl;
            string? newImageUrl = member.ImageUrl;

            // Обробка нового файлу, якщо наданий
            if (formData.Image != null && formData.Image.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "team");
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

                newImageUrl = $"/uploads/team/{fileName}";

                //видалення старої фотки
                if (!string.IsNullOrEmpty(oldImageUrl))
                {
                    var oldFilePath = Path.Combine(_env.ContentRootPath, oldImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }
            }

            member.Name = formData.Name;
            member.Position = formData.Position;
            member.Type = formData.Type;
            member.Email = formData.Email;
            member.OrderInd = formData.OrderInd;
            member.IsActive = formData.IsActive;
            member.ImageUrl = newImageUrl ?? formData.ImageUrl;
            member.IsChoosed = formData.IsChoosed;
            member.UpdatedAt = DateTime.UtcNow;

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

            //видалення фотки при видаленні запису
            if (!string.IsNullOrEmpty(member.ImageUrl))
            {
                var filePath = Path.Combine(_env.ContentRootPath, member.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

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
        public MemberType Type { get; set; }
        public string? Email { get; set; }
        public int OrderInd { get; set; }
        public bool IsActive { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
        public bool IsChoosed { get; set; } = false;
    }
}