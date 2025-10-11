using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProfkomBackend.Data;
using ProfkomBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;

namespace ProfkomBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly AppDbContext _db; 
        private readonly IWebHostEnvironment _env;

        public NewsController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.News.OrderByDescending(n => n.PublishedAt).ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var item = await _db.News.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] NewsDto newsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var news = new News
            {
                Title = newsDto.Title,
                Content = newsDto.Content,
                IsImportant = newsDto.IsImportant,
                PublishedAt = DateTime.UtcNow
            };

            if (newsDto.Image != null && newsDto.Image.Length > 0)
            {
                var uploads = Path.Combine(_env.ContentRootPath, "uploads", "news");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(newsDto.Image.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await newsDto.Image.CopyToAsync(stream);
                }
                news.ImageUrl = $"/uploads/news/{fileName}";
            }

            _db.News.Add(news);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = news.Id }, news);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] NewsDto newsDto)
        {
            var existingNews = await _db.News.FindAsync(id);
            if (existingNews == null)
            {
                return NotFound();
            }

            existingNews.Title = newsDto.Title;
            existingNews.Content = newsDto.Content;
            existingNews.IsImportant = newsDto.IsImportant;

            if (newsDto.Image != null && newsDto.Image.Length > 0)
            {
                // Видалення старого зображення, якщо воно є
                if (!string.IsNullOrEmpty(existingNews.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, existingNews.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                // Збереження нового зображення
                var uploads = Path.Combine(_env.ContentRootPath, "uploads", "news");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }
                
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(newsDto.Image.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await newsDto.Image.CopyToAsync(stream);
                }
                existingNews.ImageUrl = $"/uploads/news/{fileName}";
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var news = await _db.News.FindAsync(id);
            if (news == null)
            {
                return NotFound();
            }
            
            // Видалення зображення, якщо воно є
            if (!string.IsNullOrEmpty(news.ImageUrl))
            {
                var filePath = Path.Combine(_env.ContentRootPath, news.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _db.News.Remove(news);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public class NewsDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public bool IsImportant { get; set; }
    }
}