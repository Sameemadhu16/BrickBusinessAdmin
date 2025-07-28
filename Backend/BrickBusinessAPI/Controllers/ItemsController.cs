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
    public class ItemsController : ControllerBase
    {
        private readonly BrickBusinessContext _context;
        private readonly IMapper _mapper;

        public ItemsController(BrickBusinessContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems([FromQuery] int? categoryId = null, [FromQuery] bool? isActive = null)
        {
            var query = _context.Items.Include(i => i.Category).AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(i => i.CategoryId == categoryId.Value);
            }

            if (isActive.HasValue)
            {
                query = query.Where(i => i.IsActive == isActive.Value);
            }

            var items = await query.ToListAsync();
            var itemDtos = _mapper.Map<List<ItemDto>>(items);

            return Ok(itemDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var item = await _context.Items
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.ItemId == id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ItemDto>(item));
        }

        [HttpPost]
        public async Task<ActionResult<ItemDto>> CreateItem(CreateItemDto createItemDto)
        {
            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == createItemDto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category does not exist.");
            }

            var item = _mapper.Map<Item>(createItemDto);
            
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Fetch the item with category for response
            var createdItem = await _context.Items
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.ItemId == item.ItemId);

            var itemDto = _mapper.Map<ItemDto>(createdItem);
            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, itemDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, UpdateItemDto updateItemDto)
        {
            var item = await _context.Items.FindAsync(id);
            
            if (item == null)
            {
                return NotFound();
            }

            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == updateItemDto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category does not exist.");
            }

            _mapper.Map(updateItemDto, item);
            item.UpdatedAt = DateTime.UtcNow;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpPatch("{id}/stock")]
        public async Task<IActionResult> UpdateItemStock(int id, ItemStockUpdateDto stockUpdateDto)
        {
            var item = await _context.Items.FindAsync(id);
            
            if (item == null)
            {
                return NotFound();
            }

            item.StockQuantity = stockUpdateDto.NewStockQuantity;
            item.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Check if item has sales
            var hasSales = await _context.SaleItems.AnyAsync(si => si.ItemId == id);
            if (hasSales)
            {
                return BadRequest("Cannot delete item that has sales records.");
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetLowStockItems([FromQuery] int threshold = 10)
        {
            var items = await _context.Items
                .Include(i => i.Category)
                .Where(i => i.StockQuantity <= threshold && i.IsActive)
                .ToListAsync();

            return Ok(_mapper.Map<List<ItemDto>>(items));
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}
