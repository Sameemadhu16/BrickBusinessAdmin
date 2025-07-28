using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickBusinessAPI.Models
{
    public class Sale
    {
        [Key]
        public int SaleId { get; set; }
        
        [Required]
        [StringLength(20)]
        public string SaleNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;
        
        [StringLength(15)]
        public string? CustomerPhone { get; set; }
        
        [StringLength(255)]
        public string? CustomerAddress { get; set; }
        
        [Required]
        public DateTime SaleDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TakeDownCharges { get; set; } = 0;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal DeliveryCharges { get; set; } = 0;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TransportCost { get; set; } = 0;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal NetProfit { get; set; } = 0;
        
        public bool DeliveryRequired { get; set; } = false;
        
        [StringLength(255)]
        public string? DeliveryAddress { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
        
        public virtual TransportLog? TransportLog { get; set; }
    }
}
