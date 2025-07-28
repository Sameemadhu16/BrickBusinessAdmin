namespace BrickBusinessAPI.DTOs
{
    public class SaleDto
    {
        public int SaleId { get; set; }
        public string SaleNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public DateTime SaleDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TakeDownCharges { get; set; }
        public decimal DeliveryCharges { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TransportCost { get; set; }
        public decimal NetProfit { get; set; }
        public bool DeliveryRequired { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SaleItemDto> SaleItems { get; set; } = new List<SaleItemDto>();
        public TransportLogDto? TransportLog { get; set; }
    }

    public class CreateSaleDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        public bool DeliveryRequired { get; set; }
        public string? DeliveryAddress { get; set; }
        public decimal DeliveryCharges { get; set; }
        public string? Notes { get; set; }
        public List<CreateSaleItemDto> SaleItems { get; set; } = new List<CreateSaleItemDto>();
        public CreateTransportLogDto? TransportLog { get; set; }
    }

    public class SaleItemDto
    {
        public int SaleItemId { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TakeDownChargePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal TotalTakeDownCharges { get; set; }
    }

    public class CreateSaleItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TakeDownChargePerUnit { get; set; }
    }

    public class TransportLogDto
    {
        public int TransportLogId { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public string? VehicleNumber { get; set; }
        public string? DriverName { get; set; }
        public string? DriverPhone { get; set; }
        public decimal HireCost { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string? PickupLocation { get; set; }
        public string? DeliveryLocation { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateTransportLogDto
    {
        public string VehicleType { get; set; } = string.Empty;
        public string? VehicleNumber { get; set; }
        public string? DriverName { get; set; }
        public string? DriverPhone { get; set; }
        public decimal HireCost { get; set; }
        public DateTime DeliveryDate { get; set; } = DateTime.UtcNow;
        public string? PickupLocation { get; set; }
        public string? DeliveryLocation { get; set; }
        public string? Notes { get; set; }
    }

    public class SalesSummaryDto
    {
        public decimal TotalSales { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalTransportCost { get; set; }
        public int TotalOrders { get; set; }
        public List<DailySalesDto> DailySales { get; set; } = new List<DailySalesDto>();
    }

    public class DailySalesDto
    {
        public DateTime Date { get; set; }
        public decimal Sales { get; set; }
        public decimal Profit { get; set; }
        public int Orders { get; set; }
    }

    public class IncomeReportDto
    {
        public string Period { get; set; } = string.Empty;
        public decimal TotalRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalTransportCost { get; set; }
        public int TotalSales { get; set; }
        public List<CategorySalesDto> CategoryBreakdown { get; set; } = new List<CategorySalesDto>();
    }

    public class CategorySalesDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int QuantitySold { get; set; }
    }
}
