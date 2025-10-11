using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProfkomBackend.Data;
using ProfkomBackend.Models;
using System.ComponentModel.DataAnnotations;

namespace ProfkomBackend.Controllers
{
    [Route("api/documents")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public DocumentsController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        /// GET: api/documents
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Document>>> GetAll()
        {
            return await _db.Documents.OrderByDescending(d => d.CreatedAt).ToListAsync();
        }

        /// GET: api/documents/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Document>> GetById(int id)
        {
            var document = await _db.Documents.FindAsync(id);
            if (document == null) return NotFound();
            return document;
        }

        /// POST: api/documents
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Document>> Create([FromForm] DocumentFormData formData)
        {
            if (formData.File == null || formData.File.Length == 0)
            {
                return BadRequest("File is required.");
            }

            // Логіка збереження файлу
            var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "documents");
            Directory.CreateDirectory(uploadsDir);
            
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.File.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await formData.File.CopyToAsync(stream);
            }

            // Створення документа
            var document = new Document
            {
                Title = formData.Title,
                Description = formData.Description,
                FilePath = $"/uploads/documents/{fileName}",
                CreatedAt = DateTime.UtcNow
            };

            _db.Documents.Add(document);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = document.Id }, document);
        }

        /// PUT: api/documents/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] DocumentFormData formData)
        {
            var document = await _db.Documents.FindAsync(id);
            if (document == null) return NotFound();

            // Логіка заміни файлу
            if (formData.File != null && formData.File.Length > 0)
            {
                // Видаляємо старий файл
                if (!string.IsNullOrEmpty(document.FilePath))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, document.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }
                
                // Зберігаємо новий файл
                var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "documents");
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.File.FileName)}";
                var newFilePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(newFilePath, FileMode.Create))
                {
                    await formData.File.CopyToAsync(stream);
                }
                document.FilePath = $"/uploads/documents/{fileName}";
            }

            document.Title = formData.Title;
            document.Description = formData.Description;
            document.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        /// DELETE: api/documents/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var document = await _db.Documents.FindAsync(id);
            if (document == null) return NotFound();

            // Видалення файлу з диска
            if (!string.IsNullOrEmpty(document.FilePath))
            {
                var filePath = Path.Combine(_env.ContentRootPath, document.FilePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _db.Documents.Remove(document);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    /// DTO для створення та оновлення документів
    public class DocumentFormData
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
    }
}