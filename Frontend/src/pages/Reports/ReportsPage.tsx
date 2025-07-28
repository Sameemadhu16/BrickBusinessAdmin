import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { salesApi } from '../../services/apiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const currentDate = new Date();
  
  const getDateRange = () => {
    switch (reportPeriod) {
      case 'monthly':
        return {
          start: startOfMonth(currentDate).toISOString(),
          end: endOfMonth(currentDate).toISOString(),
        };
      case 'yearly':
        return {
          start: startOfYear(currentDate).toISOString(),
          end: endOfYear(currentDate).toISOString(),
        };
      case 'custom':
        return {
          start: customDateRange.startDate ? new Date(customDateRange.startDate).toISOString() : '',
          end: customDateRange.endDate ? new Date(customDateRange.endDate).toISOString() : '',
        };
      default:
        return { start: '', end: '' };
    }
  };

  const dateRange = getDateRange();

  const { data: incomeReport, isLoading: reportLoading } = useQuery(
    ['incomeReport', reportPeriod, dateRange.start, dateRange.end],
    () => salesApi.getIncomeReport(reportPeriod, dateRange.start, dateRange.end).then(res => res.data),
    { enabled: !!(dateRange.start && dateRange.end) }
  );

  const { data: salesSummary, isLoading: summaryLoading } = useQuery(
    ['salesSummary', dateRange.start, dateRange.end],
    () => salesApi.getSummary(dateRange.start, dateRange.end).then(res => res.data),
    { enabled: !!(dateRange.start && dateRange.end) }
  );

  const pieChartData = incomeReport?.categoryBreakdown?.map((item, index) => ({
    name: item.categoryName,
    value: item.revenue,
    color: COLORS[index % COLORS.length],
  })) || [];

  const dailySalesChart = salesSummary?.dailySales?.map(day => ({
    date: format(new Date(day.date), 'MM/dd'),
    sales: day.sales,
    profit: day.profit,
  })) || [];

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel file
    const reportData = {
      period: reportPeriod,
      dateRange: `${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`,
      summary: incomeReport,
      dailyBreakdown: salesSummary?.dailySales,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `brick-business-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const isLoading = reportLoading || summaryLoading;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Business Reports</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={exportReport}
          disabled={isLoading || !incomeReport}
        >
          Export Report
        </Button>
      </Box>

      {/* Report Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Configuration
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Report Period</InputLabel>
              <Select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                label="Report Period"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {reportPeriod === 'custom' && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="End Date"
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="textSecondary">
              {dateRange.start && dateRange.end && (
                `${format(new Date(dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`
              )}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading report data...</Typography>
        </Box>
      ) : incomeReport ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ₹{incomeReport.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Net Profit
                  </Typography>
                  <Typography variant="h4">
                    ₹{incomeReport.totalProfit.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Transport Cost
                  </Typography>
                  <Typography variant="h4">
                    ₹{incomeReport.totalTransportCost.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4">
                    {incomeReport.totalSales}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Sales & Profit
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailySalesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#2196f3" name="Sales (₹)" />
                    <Bar dataKey="profit" fill="#4caf50" name="Profit (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Category Breakdown Table */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Performance Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell align="right"><strong>Quantity Sold</strong></TableCell>
                    <TableCell align="right"><strong>Revenue (₹)</strong></TableCell>
                    <TableCell align="right"><strong>% of Total Revenue</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeReport.categoryBreakdown.map((category) => (
                    <TableRow key={category.categoryName}>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell align="right">{category.quantitySold.toLocaleString()}</TableCell>
                      <TableCell align="right">₹{category.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {((category.revenue / incomeReport.totalRevenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ReportIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No data available for the selected period
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try selecting a different date range or ensure you have sales data for this period.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ReportsPage;
