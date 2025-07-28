using System.ComponentModel.DataAnnotations;

namespace BrickBusinessAPI.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
