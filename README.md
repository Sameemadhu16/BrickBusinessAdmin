# Brick Business Admin Dashboard

A comprehensive admin dashboard for managing block cement brick business operations including inventory, sales, transport, and reporting.

## Project Structure

```
BrickBusinessAdmin/
├── Backend/                 # ASP.NET Core Web API
│   └── BrickBusinessAPI/
│       ├── Controllers/     # API Controllers
│       ├── Models/         # Entity Models
│       ├── DTOs/           # Data Transfer Objects
│       ├── Data/           # Database Context
│       ├── Profiles/       # AutoMapper Profiles
│       └── Program.cs      # Main application entry
└── Frontend/               # React Application
    └── src/
        ├── components/     # React Components
        ├── pages/         # Page Components
        ├── services/      # API Services
        ├── types/         # TypeScript Interfaces
        └── App.tsx        # Main App Component
```

## Features

### Inventory Management
- Add, edit, and delete items (bricks, interlocks, kanu, cylinders)
- Track stock quantities with low stock alerts
- Manage item categories and pricing
- Set take-down charges for items

### Sales Management
- Create detailed sales records
- Track customer information
- Calculate totals including take-down charges
- Manage delivery requirements

### Transport & Delivery
- Track hired vehicles and drivers
- Monitor delivery costs and profits
- Schedule and track deliveries
- Transport cost analysis

### Reports & Analytics
- Income reports (daily, monthly, yearly)
- Category-wise sales breakdown
- Profit/loss analysis
- Export reports

### Dashboard
- Real-time business metrics
- Sales trends and charts
- Low stock alerts
- Daily performance summary

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core
- **Mapping**: AutoMapper
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query
- **Routing**: React Router
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Build Tool**: Vite

## Database Schema

### Tables
- **Categories**: Item categories (bricks, interlocks, etc.)
- **Items**: Product catalog with pricing and stock
- **Sales**: Sales transactions
- **SaleItems**: Line items for each sale
- **TransportLogs**: Delivery and transport records

### Key Relationships
- Items belong to Categories
- Sales have multiple SaleItems
- Sales can have one TransportLog
- SaleItems reference Items

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- SQL Server (LocalDB or full instance)
- Node.js 18+ and npm/yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend/BrickBusinessAPI
   ```

2. Install dependencies:
   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=BrickBusinessDB;Trusted_Connection=true;TrustServerCertificate=true;"
     }
   }
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7001` and `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Items
- `GET /api/items` - Get all items (with optional filtering)
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `PATCH /api/items/{id}/stock` - Update item stock
- `DELETE /api/items/{id}` - Delete item
- `GET /api/items/low-stock` - Get low stock items

### Sales
- `GET /api/sales` - Get sales with pagination and filtering
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale
- `DELETE /api/sales/{id}` - Delete sale (restores stock)
- `GET /api/sales/summary` - Get sales summary
- `GET /api/sales/reports/income` - Get income reports

## Business Logic

### Sale Process Flow
1. Select items and quantities
2. Set customer information
3. Calculate item totals and take-down charges
4. Add delivery charges if required
5. Configure transport details for delivery
6. Calculate final totals and profit
7. Update item stock quantities
8. Generate sale record

### Stock Management
- Stock is automatically reduced when sales are created
- Stock is restored when sales are deleted
- Low stock alerts when quantity ≤ 10 units

### Financial Calculations
- **Subtotal**: Sum of (item price × quantity) for all items
- **Take-down Charges**: Sum of (take-down rate × quantity) for applicable items
- **Total Amount**: Subtotal + Take-down Charges + Delivery Charges
- **Net Profit**: Total Amount - Transport Cost

## Development Notes

### Data Validation
- Required fields are validated on both frontend and backend
- Stock quantities cannot go negative
- Prices and costs must be positive values

### Error Handling
- API returns appropriate HTTP status codes
- Frontend displays user-friendly error messages
- Database transactions ensure data consistency

### Performance Considerations
- Pagination for large data sets
- Indexed database columns for common queries
- Efficient React Query caching

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Multi-location support
- [ ] SMS/email notifications for deliveries
- [ ] Barcode scanning for inventory
- [ ] Mobile app for field operations
- [ ] Advanced reporting with PDF generation
- [ ] Integration with accounting software

## Support

For questions or issues, please refer to the project documentation or contact the development team.
