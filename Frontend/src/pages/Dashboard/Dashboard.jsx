import React from 'react';
import { useQuery } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { salesApi, itemsApi } from '../../services/apiService.js';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 h-full">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-4xl" style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: salesSummary, isLoading: salesLoading } = useQuery(
    ['salesSummary', startOfMonth.toISOString(), endOfMonth.toISOString()],
    () => salesApi.getSummary(
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
    ).then(res => res.data)
  );

  const { data: lowStockItems, isLoading: stockLoading } = useQuery(
    'lowStockItems',
    () => itemsApi.getLowStock(10).then(res => res.data)
  );

  const { data: incomeReport } = useQuery(
    ['incomeReport', 'monthly'],
    () => salesApi.getIncomeReport('monthly').then(res => res.data)
  );

  if (salesLoading || stockLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const chartData = salesSummary?.dailySales?.map(day => ({
    date: format(new Date(day.date), 'MM/dd'),
    sales: day.sales,
    profit: day.profit,
    orders: day.orders,
  })) || [];

  const categoryData = incomeReport?.categoryBreakdown?.map(cat => ({
    name: cat.categoryName,
    revenue: cat.revenue,
    quantity: cat.quantitySold,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">{format(currentDate, 'MMMM yyyy')} Performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`₹${salesSummary?.totalSales?.toLocaleString() || 0}`}
          icon="💰"
          color="#10b981"
        />
        <StatCard
          title="Net Profit"
          value={`₹${salesSummary?.totalProfit?.toLocaleString() || 0}`}
          icon="📈"
          color="#3b82f6"
        />
        <StatCard
          title="Total Orders"
          value={salesSummary?.totalOrders || 0}
          icon="🛒"
          color="#f59e0b"
        />
        <StatCard
          title="Transport Cost"
          value={`₹${salesSummary?.totalTransportCost?.toLocaleString() || 0}`}
          icon="🚛"
          color="#8b5cf6"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
              <p className="text-yellow-700">
                {lowStockItems.length} items are running low on stock. 
                Check Items Management for details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales (₹)" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
