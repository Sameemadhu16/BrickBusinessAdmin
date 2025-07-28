import apiClient from './api';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  Item,
  CreateItemDto,
  UpdateItemDto,
  ItemStockUpdateDto,
  Sale,
  CreateSaleDto,
  SalesSummary,
  IncomeReport,
} from '../types';

// Categories API
export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories'),
  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryDto) => apiClient.post<Category>('/categories', data),
  update: (id: number, data: UpdateCategoryDto) => apiClient.put(`/categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/categories/${id}`),
};

// Items API
export const itemsApi = {
  getAll: (categoryId?: number, isActive?: boolean) => {
    const params = new URLSearchParams();
    if (categoryId !== undefined) params.append('categoryId', categoryId.toString());
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    return apiClient.get<Item[]>(`/items?${params.toString()}`);
  },
  getById: (id: number) => apiClient.get<Item>(`/items/${id}`),
  create: (data: CreateItemDto) => apiClient.post<Item>('/items', data),
  update: (id: number, data: UpdateItemDto) => apiClient.put(`/items/${id}`, data),
  updateStock: (id: number, data: ItemStockUpdateDto) => apiClient.patch(`/items/${id}/stock`, data),
  delete: (id: number) => apiClient.delete(`/items/${id}`),
  getLowStock: (threshold?: number) => {
    const params = threshold ? `?threshold=${threshold}` : '';
    return apiClient.get<Item[]>(`/items/low-stock${params}`);
  },
};

// Sales API
export const salesApi = {
  getAll: (startDate?: string, endDate?: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    return apiClient.get<Sale[]>(`/sales?${params.toString()}`);
  },
  getById: (id: number) => apiClient.get<Sale>(`/sales/${id}`),
  create: (data: CreateSaleDto) => apiClient.post<Sale>('/sales', data),
  delete: (id: number) => apiClient.delete(`/sales/${id}`),
  getSummary: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get<SalesSummary>(`/sales/summary?${params.toString()}`);
  },
  getIncomeReport: (period = 'monthly', startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get<IncomeReport>(`/sales/reports/income?${params.toString()}`);
  },
};
