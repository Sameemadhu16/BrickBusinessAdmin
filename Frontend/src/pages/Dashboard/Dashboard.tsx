import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  MonetizationOn,
  ShoppingCart,
  LocalShipping,
  Warning,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { salesApi, itemsApi } from '../../services/apiService';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading dashboard...</Typography>
      </Box>
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
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {format(currentDate, 'MMMM yyyy')} Performance
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={`₹${salesSummary?.totalSales?.toLocaleString() || 0}`}
            icon={<MonetizationOn />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Profit"
            value={`₹${salesSummary?.totalProfit?.toLocaleString() || 0}`}
            icon={<TrendingUp />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={salesSummary?.totalOrders || 0}
            icon={<ShoppingCart />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Transport Cost"
            value={`₹${salesSummary?.totalTransportCost?.toLocaleString() || 0}`}
            icon={<LocalShipping />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockItems && lowStockItems.length > 0 && (
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">Low Stock Alert</Typography>
          <Typography>
            {lowStockItems.length} items are running low on stock. 
            Check Items Management for details.
          </Typography>
        </Alert>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Sales & Profit Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2196f3" name="Sales (₹)" />
                <Line type="monotone" dataKey="profit" stroke="#4caf50" name="Profit (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Sales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
