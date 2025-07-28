using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickBusinessAPI.Models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        [StringLength(50)]
        public string? Size { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        public int StockQuantity { get; set; }
        
        [StringLength(20)]
        public string Unit { get; set; } = "pieces";
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? TakeDownChargePerUnit { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } = null!;
        
        public virtual ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}
