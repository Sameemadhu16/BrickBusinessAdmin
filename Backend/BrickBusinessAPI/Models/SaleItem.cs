using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickBusinessAPI.Models
{
    public class SaleItem
    {
        [Key]
        public int SaleItemId { get; set; }
        
        [Required]
        public int SaleId { get; set; }
        
        [Required]
        public int ItemId { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TakeDownChargePerUnit { get; set; } = 0;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalTakeDownCharges { get; set; } = 0;
        
        // Navigation properties
        [ForeignKey("SaleId")]
        public virtual Sale Sale { get; set; } = null!;
        
        [ForeignKey("ItemId")]
        public virtual Item Item { get; set; } = null!;
    }
}
