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
    public class SalesController : ControllerBase
    {
        private readonly BrickBusinessContext _context;
        private readonly IMapper _mapper;

        public SalesController(BrickBusinessContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Sales
                .Include(s => s.SaleItems)
                .ThenInclude(si => si.Item)
                .Include(s => s.TransportLog)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(s => s.SaleDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(s => s.SaleDate <= endDate.Value);
            }

            var totalCount = await query.CountAsync();
            var sales = await query
                .OrderByDescending(s => s.SaleDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var salesDtos = _mapper.Map<List<SaleDto>>(sales);

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return Ok(salesDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.SaleItems)
                .ThenInclude(si => si.Item)
                .Include(s => s.TransportLog)
                .FirstOrDefaultAsync(s => s.SaleId == id);

            if (sale == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<SaleDto>(sale));
        }

        [HttpPost]
        public async Task<ActionResult<SaleDto>> CreateSale(CreateSaleDto createSaleDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Generate sale number
                var saleCount = await _context.Sales.CountAsync();
                var saleNumber = $"SALE-{DateTime.Now:yyyyMMdd}-{(saleCount + 1):D4}";

                var sale = _mapper.Map<Sale>(createSaleDto);
                sale.SaleNumber = saleNumber;

                // Calculate totals
                decimal subTotal = 0;
                decimal totalTakeDownCharges = 0;

                foreach (var saleItemDto in createSaleDto.SaleItems)
                {
                    // Check if item exists and has enough stock
                    var item = await _context.Items.FindAsync(saleItemDto.ItemId);
                    if (item == null)
                    {
                        return BadRequest($"Item with ID {saleItemDto.ItemId} not found.");
                    }

                    if (item.StockQuantity < saleItemDto.Quantity)
                    {
                        return BadRequest($"Insufficient stock for item {item.Name}. Available: {item.StockQuantity}, Requested: {saleItemDto.Quantity}");
                    }

                    var saleItem = new SaleItem
                    {
                        ItemId = saleItemDto.ItemId,
                        Quantity = saleItemDto.Quantity,
                        UnitPrice = saleItemDto.UnitPrice,
                        TakeDownChargePerUnit = saleItemDto.TakeDownChargePerUnit,
                        TotalPrice = saleItemDto.UnitPrice * saleItemDto.Quantity,
                        TotalTakeDownCharges = saleItemDto.TakeDownChargePerUnit * saleItemDto.Quantity
                    };

                    sale.SaleItems.Add(saleItem);
                    subTotal += saleItem.TotalPrice;
                    totalTakeDownCharges += saleItem.TotalTakeDownCharges;

                    // Update item stock
                    item.StockQuantity -= saleItemDto.Quantity;
                    item.UpdatedAt = DateTime.UtcNow;
                }

                sale.SubTotal = subTotal;
                sale.TakeDownCharges = totalTakeDownCharges;
                sale.TotalAmount = subTotal + totalTakeDownCharges + createSaleDto.DeliveryCharges;

                // Calculate transport cost and profit
                decimal transportCost = 0;
                if (createSaleDto.TransportLog != null)
                {
                    transportCost = createSaleDto.TransportLog.HireCost;
                    var transportLog = _mapper.Map<TransportLog>(createSaleDto.TransportLog);
                    sale.TransportLog = transportLog;
                }

                sale.TransportCost = transportCost;
                sale.NetProfit = sale.TotalAmount - transportCost;

                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Fetch the created sale with all related data
                var createdSale = await _context.Sales
                    .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Item)
                    .Include(s => s.TransportLog)
                    .FirstOrDefaultAsync(s => s.SaleId == sale.SaleId);

                var saleDto = _mapper.Map<SaleDto>(createdSale);
                return CreatedAtAction(nameof(GetSale), new { id = sale.SaleId }, saleDto);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<SalesSummaryDto>> GetSalesSummary(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Sales.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(s => s.SaleDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(s => s.SaleDate <= endDate.Value);
            }

            var sales = await query.ToListAsync();

            var summary = new SalesSummaryDto
            {
                TotalSales = sales.Sum(s => s.TotalAmount),
                TotalProfit = sales.Sum(s => s.NetProfit),
                TotalTransportCost = sales.Sum(s => s.TransportCost),
                TotalOrders = sales.Count,
                DailySales = sales
                    .GroupBy(s => s.SaleDate.Date)
                    .Select(g => new DailySalesDto
                    {
                        Date = g.Key,
                        Sales = g.Sum(s => s.TotalAmount),
                        Profit = g.Sum(s => s.NetProfit),
                        Orders = g.Count()
                    })
                    .OrderBy(d => d.Date)
                    .ToList()
            };

            return Ok(summary);
        }

        [HttpGet("reports/income")]
        public async Task<ActionResult<IncomeReportDto>> GetIncomeReport(
            [FromQuery] string period = "monthly",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Sales
                .Include(s => s.SaleItems)
                .ThenInclude(si => si.Item)
                .ThenInclude(i => i.Category)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(s => s.SaleDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(s => s.SaleDate <= endDate.Value);
            }

            var sales = await query.ToListAsync();

            var categoryBreakdown = sales
                .SelectMany(s => s.SaleItems)
                .GroupBy(si => si.Item.Category.Name)
                .Select(g => new CategorySalesDto
                {
                    CategoryName = g.Key,
                    Revenue = g.Sum(si => si.TotalPrice + si.TotalTakeDownCharges),
                    QuantitySold = g.Sum(si => si.Quantity)
                })
                .ToList();

            var report = new IncomeReportDto
            {
                Period = period,
                TotalRevenue = sales.Sum(s => s.TotalAmount),
                TotalProfit = sales.Sum(s => s.NetProfit),
                TotalTransportCost = sales.Sum(s => s.TransportCost),
                TotalSales = sales.Count,
                CategoryBreakdown = categoryBreakdown
            };

            return Ok(report);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefaultAsync(s => s.SaleId == id);

            if (sale == null)
            {
                return NotFound();
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Restore item stock
                foreach (var saleItem in sale.SaleItems)
                {
                    var item = await _context.Items.FindAsync(saleItem.ItemId);
                    if (item != null)
                    {
                        item.StockQuantity += saleItem.Quantity;
                        item.UpdatedAt = DateTime.UtcNow;
                    }
                }

                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
