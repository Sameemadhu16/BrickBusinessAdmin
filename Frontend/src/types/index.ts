export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name: string;
  description?: string;
}

export interface Item {
  itemId: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  size?: string;
  price: number;
  stockQuantity: number;
  unit: string;
  takeDownChargePerUnit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  categoryId: number;
  size?: string;
  price: number;
  stockQuantity: number;
  unit?: string;
  takeDownChargePerUnit?: number;
  isActive?: boolean;
}

export interface UpdateItemDto {
  name: string;
  description?: string;
  categoryId: number;
  size?: string;
  price: number;
  stockQuantity: number;
  unit?: string;
  takeDownChargePerUnit?: number;
  isActive?: boolean;
}

export interface ItemStockUpdateDto {
  itemId: number;
  newStockQuantity: number;
}

export interface SaleItem {
  saleItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  takeDownChargePerUnit: number;
  totalPrice: number;
  totalTakeDownCharges: number;
}

export interface CreateSaleItemDto {
  itemId: number;
  quantity: number;
  unitPrice: number;
  takeDownChargePerUnit: number;
}

export interface TransportLog {
  transportLogId: number;
  vehicleType: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  hireCost: number;
  deliveryDate: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateTransportLogDto {
  vehicleType: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  hireCost: number;
  deliveryDate?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  notes?: string;
}

export interface Sale {
  saleId: number;
  saleNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  saleDate: string;
  subTotal: number;
  takeDownCharges: number;
  deliveryCharges: number;
  totalAmount: number;
  transportCost: number;
  netProfit: number;
  deliveryRequired: boolean;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  saleItems: SaleItem[];
  transportLog?: TransportLog;
}

export interface CreateSaleDto {
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  saleDate?: string;
  deliveryRequired: boolean;
  deliveryAddress?: string;
  deliveryCharges: number;
  notes?: string;
  saleItems: CreateSaleItemDto[];
  transportLog?: CreateTransportLogDto;
}

export interface SalesSummary {
  totalSales: number;
  totalProfit: number;
  totalTransportCost: number;
  totalOrders: number;
  dailySales: DailySales[];
}

export interface DailySales {
  date: string;
  sales: number;
  profit: number;
  orders: number;
}

export interface IncomeReport {
  period: string;
  totalRevenue: number;
  totalProfit: number;
  totalTransportCost: number;
  totalSales: number;
  categoryBreakdown: CategorySales[];
}

export interface CategorySales {
  categoryName: string;
  revenue: number;
  quantitySold: number;
}
