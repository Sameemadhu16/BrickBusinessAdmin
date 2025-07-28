import apiClient from './api.js';

// Categories API
export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

// Items API
export const itemsApi = {
  getAll: (categoryId, isActive) => {
    const params = new URLSearchParams();
    if (categoryId !== undefined) params.append('categoryId', categoryId.toString());
    if (isActive !== undefined) params.append('isActive', isActive.toString());
    return apiClient.get(`/items?${params.toString()}`);
  },
  getById: (id) => apiClient.get(`/items/${id}`),
  create: (data) => apiClient.post('/items', data),
  update: (id, data) => apiClient.put(`/items/${id}`, data),
  updateStock: (id, data) => apiClient.patch(`/items/${id}/stock`, data),
  delete: (id) => apiClient.delete(`/items/${id}`),
  getLowStock: (threshold) => {
    const params = threshold ? `?threshold=${threshold}` : '';
    return apiClient.get(`/items/low-stock${params}`);
  },
};

// Sales API
export const salesApi = {
  getAll: (startDate, endDate, page = 1, pageSize = 20) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    return apiClient.get(`/sales?${params.toString()}`);
  },
  getById: (id) => apiClient.get(`/sales/${id}`),
  create: (data) => apiClient.post('/sales', data),
  delete: (id) => apiClient.delete(`/sales/${id}`),
  getSummary: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get(`/sales/summary?${params.toString()}`);
  },
  getIncomeReport: (period = 'monthly', startDate, endDate) => {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get(`/sales/reports/income?${params.toString()}`);
  },
};
