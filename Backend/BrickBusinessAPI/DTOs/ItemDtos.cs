namespace BrickBusinessAPI.DTOs
{
    public class ItemDto
    {
        public int ItemId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Size { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Unit { get; set; } = "pieces";
        public decimal? TakeDownChargePerUnit { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateItemDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string? Size { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Unit { get; set; } = "pieces";
        public decimal? TakeDownChargePerUnit { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateItemDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string? Size { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Unit { get; set; } = "pieces";
        public decimal? TakeDownChargePerUnit { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class ItemStockUpdateDto
    {
        public int ItemId { get; set; }
        public int NewStockQuantity { get; set; }
    }
}
