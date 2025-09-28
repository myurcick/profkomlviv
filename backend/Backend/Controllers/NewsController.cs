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
        private readonly AppDbContext _db; private readonly IWebHostEnvironment _env;

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
                var uploads = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(newsDto.Image.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await newsDto.Image.CopyToAsync(stream);
                }
                news.ImageUrl = $"/Uploads/{fileName}"; // Зберігаємо відносний шлях у БД
            }

            _db.News.Add(news);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = news.Id }, news);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] NewsDto newsDto)
        {
            if (id != newsDto.Id)
            {
                return BadRequest("ID в URL не відповідає ID у даних");
            }

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
                var uploads = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(newsDto.Image.FileName)}";
                var filePath = Path.Combine(uploads, fileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await newsDto.Image.CopyToAsync(stream);
                }
                existingNews.ImageUrl = $"/Uploads/{fileName}"; // Оновлюємо шлях у БД
            }

            _db.Entry(existingNews).State = EntityState.Modified;
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

            _db.News.Remove(news);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public class NewsDto
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }
        public IFormFile? Image { get; set; }
        public bool IsImportant { get; set; }
    }

}