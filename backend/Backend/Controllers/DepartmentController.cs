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
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public DepartmentController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // GET: api/department
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Department>>> GetAll()
        {
            return await _db.Department
                .Include(d => d.Head)
                .ToListAsync();
        }

        // GET: api/department/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Department>> GetById(int id)
        {
            var dep = await _db.Department
                .Include(d => d.Head)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (dep == null) return NotFound();
            return dep;
        }

        // POST: api/department
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Department>> Create([FromForm] DepartmentFormData formData)
        {
            string? logoUrl = null;

            if (formData.Logo != null && formData.Logo.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Logo.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Logo.CopyToAsync(stream);
                }

                logoUrl = $"/Uploads/{fileName}";
            }

            Team? head = null;
            if (formData.HeadId.HasValue)
            {
                head = await _db.Team.FirstOrDefaultAsync(t => t.Id == formData.HeadId && t.Type == MemberType.Viddil);
                if (head == null) return BadRequest("Head must be a Team member with Type = Viddil");
            }

            var dep = new Department
            {
                Name = formData.Name,
                Description = formData.Description,
                LogoUrl = logoUrl ?? formData.LogoUrl,
                HeadId = formData.HeadId,
                Head = head,
                IsActive = formData.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _db.Department.Add(dep);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = dep.Id }, dep);
        }

        // PUT: api/department/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromForm] DepartmentFormData formData)
        {
            var dep = await _db.Department.FindAsync(id);
            if (dep == null) return NotFound();

            string? logoUrl = dep.LogoUrl;

            if (formData.Logo != null && formData.Logo.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploadsDir)) Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(formData.Logo.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formData.Logo.CopyToAsync(stream);
                }

                logoUrl = $"/Uploads/{fileName}";
            }

            Team? head = null;
            if (formData.HeadId.HasValue)
            {
                head = await _db.Team.FirstOrDefaultAsync(t => t.Id == formData.HeadId && t.Type == MemberType.Viddil);
                if (head == null) return BadRequest("Head must be a Team member with Type = Viddil");
            }

            dep.Name = formData.Name;
            dep.Description = formData.Description;
            dep.LogoUrl = logoUrl ?? formData.LogoUrl;
            dep.HeadId = formData.HeadId;
            dep.Head = head;
            dep.IsActive = formData.IsActive;
            dep.UpdatedAt = DateTime.UtcNow;

            _db.Entry(dep).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/department/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var dep = await _db.Department.FindAsync(id);
            if (dep == null) return NotFound();

            _db.Department.Remove(dep);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO для обробки вхідних даних
    public class DepartmentFormData
    {
        public int? HeadId { get; set; }  // Nullable

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public IFormFile? Logo { get; set; }
    }
}