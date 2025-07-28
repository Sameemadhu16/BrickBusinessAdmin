using Microsoft.EntityFrameworkCore;
using BrickBusinessAPI.Models;

namespace BrickBusinessAPI.Data
{
    public class BrickBusinessContext : DbContext
    {
        public BrickBusinessContext(DbContextOptions<BrickBusinessContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<TransportLog> TransportLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Item>()
                .HasOne(i => i.Category)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SaleItem>()
                .HasOne(si => si.Sale)
                .WithMany(s => s.SaleItems)
                .HasForeignKey(si => si.SaleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SaleItem>()
                .HasOne(si => si.Item)
                .WithMany(i => i.SaleItems)
                .HasForeignKey(si => si.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TransportLog>()
                .HasOne(tl => tl.Sale)
                .WithOne(s => s.TransportLog)
                .HasForeignKey<TransportLog>(tl => tl.SaleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed data
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, Name = "Cement Bricks", Description = "Standard cement bricks" },
                new Category { CategoryId = 2, Name = "Interlocks", Description = "Interlocking cement blocks" },
                new Category { CategoryId = 3, Name = "Cement Kanu", Description = "Cement kanu of various sizes" },
                new Category { CategoryId = 4, Name = "Cement Cylinders", Description = "Cement cylinders of various sizes" }
            );

            modelBuilder.Entity<Item>().HasData(
                new Item { ItemId = 1, Name = "Standard Cement Brick", CategoryId = 1, Size = "Standard", Price = 12.00m, StockQuantity = 1000, TakeDownChargePerUnit = 2.00m },
                new Item { ItemId = 2, Name = "Interlock Block", CategoryId = 2, Size = "Standard", Price = 25.00m, StockQuantity = 500, TakeDownChargePerUnit = 0.00m },
                new Item { ItemId = 3, Name = "Small Cement Kanu", CategoryId = 3, Size = "Small", Price = 150.00m, StockQuantity = 50, TakeDownChargePerUnit = 0.00m },
                new Item { ItemId = 4, Name = "Large Cement Kanu", CategoryId = 3, Size = "Large", Price = 250.00m, StockQuantity = 30, TakeDownChargePerUnit = 0.00m },
                new Item { ItemId = 5, Name = "Small Cement Cylinder", CategoryId = 4, Size = "Small", Price = 200.00m, StockQuantity = 25, TakeDownChargePerUnit = 0.00m },
                new Item { ItemId = 6, Name = "Large Cement Cylinder", CategoryId = 4, Size = "Large", Price = 350.00m, StockQuantity = 15, TakeDownChargePerUnit = 0.00m }
            );
        }
    }
}
