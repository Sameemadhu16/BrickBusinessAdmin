using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BrickBusinessAPI.Data;
using BrickBusinessAPI.Models;
using BrickBusinessAPI.DTOs;
using AutoMapper;

namespace BrickBusinessAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly BrickBusinessContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(BrickBusinessContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(_mapper.Map<List<CategoryDto>>(categories));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<CategoryDto>(category));
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var category = _mapper.Map<Category>(createCategoryDto);
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var categoryDto = _mapper.Map<CategoryDto>(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, categoryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }

            _mapper.Map(updateCategoryDto, category);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Check if category has items
            var hasItems = await _context.Items.AnyAsync(i => i.CategoryId == id);
            if (hasItems)
            {
                return BadRequest("Cannot delete category that has items.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }
    }
}
