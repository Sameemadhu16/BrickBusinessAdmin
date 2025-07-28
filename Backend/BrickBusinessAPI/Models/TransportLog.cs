using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickBusinessAPI.Models
{
    public class TransportLog
    {
        [Key]
        public int TransportLogId { get; set; }
        
        [Required]
        public int SaleId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string VehicleType { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string? VehicleNumber { get; set; }
        
        [StringLength(100)]
        public string? DriverName { get; set; }
        
        [StringLength(15)]
        public string? DriverPhone { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal HireCost { get; set; }
        
        [Required]
        public DateTime DeliveryDate { get; set; }
        
        [StringLength(255)]
        public string? PickupLocation { get; set; }
        
        [StringLength(255)]
        public string? DeliveryLocation { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        [ForeignKey("SaleId")]
        public virtual Sale Sale { get; set; } = null!;
    }
}
