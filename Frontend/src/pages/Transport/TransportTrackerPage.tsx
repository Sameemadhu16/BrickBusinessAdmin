import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon,
  Person as DriverIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { salesApi } from '../../services/apiService';

const TransportTrackerPage: React.FC = () => {
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: sales, isLoading } = useQuery(
    ['sales-with-transport', dateFilter.startDate, dateFilter.endDate],
    () => salesApi.getAll(dateFilter.startDate, dateFilter.endDate).then(res => res.data)
  );

  // Filter sales that have transport logs
  const transports = sales?.filter(sale => sale.transportLog) || [];

  const totalTransportCost = transports.reduce((sum, transport) => sum + transport.transportCost, 0);
  const totalDeliveries = transports.length;
  const avgCostPerDelivery = totalDeliveries > 0 ? totalTransportCost / totalDeliveries : 0;

  const todayDeliveries = transports.filter(transport => {
    const deliveryDate = new Date(transport.transportLog?.deliveryDate || '');
    const today = new Date();
    return deliveryDate.toDateString() === today.toDateString();
  });

  const columns: GridColDef[] = [
    { field: 'saleNumber', headerName: 'Sale #', width: 150 },
    { field: 'customerName', headerName: 'Customer', width: 180 },
    {
      field: 'transportLog.vehicleType',
      headerName: 'Vehicle',
      width: 120,
      valueGetter: (params) => params.row.transportLog?.vehicleType || '',
    },
    {
      field: 'transportLog.vehicleNumber',
      headerName: 'Vehicle #',
      width: 120,
      valueGetter: (params) => params.row.transportLog?.vehicleNumber || '',
    },
    {
      field: 'transportLog.driverName',
      headerName: 'Driver',
      width: 150,
      valueGetter: (params) => params.row.transportLog?.driverName || '',
    },
    {
      field: 'transportLog.deliveryDate',
      headerName: 'Delivery Date',
      width: 130,
      valueGetter: (params) => params.row.transportLog?.deliveryDate || '',
      renderCell: (params) => {
        if (!params.value) return '';
        return format(new Date(params.value), 'dd/MM/yyyy');
      },
    },
    {
      field: 'transportLog.hireCost',
      headerName: 'Hire Cost (₹)',
      width: 130,
      valueGetter: (params) => params.row.transportLog?.hireCost || 0,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'deliveryCharges',
      headerName: 'Delivery Fee (₹)',
      width: 140,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => {
        const deliveryDate = new Date(params.row.transportLog?.deliveryDate || '');
        const today = new Date();
        const isToday = deliveryDate.toDateString() === today.toDateString();
        const isPast = deliveryDate < today;
        
        return (
          <Chip
            label={isToday ? 'Today' : isPast ? 'Completed' : 'Scheduled'}
            color={isToday ? 'warning' : isPast ? 'success' : 'info'}
            size="small"
          />
        );
      },
    },
  ];

  const handleViewDetails = (transport: any) => {
    setSelectedTransport(transport);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transport Tracker
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TruckIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Deliveries
                  </Typography>
                  <Typography variant="h4">
                    {totalDeliveries}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Transport Cost
                  </Typography>
                  <Typography variant="h4">
                    ₹{totalTransportCost.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Today's Deliveries
                  </Typography>
                  <Typography variant="h4">
                    {todayDeliveries.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DriverIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Avg Cost/Delivery
                  </Typography>
                  <Typography variant="h4">
                    ₹{avgCostPerDelivery.toFixed(0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Date Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() => setDateFilter({ startDate: '', endDate: '' })}
            >
              Clear Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Transport Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transports}
          columns={columns}
          getRowId={(row) => row.saleId}
          pageSize={25}
          loading={isLoading}
          disableSelectionOnClick
          onRowClick={(params) => handleViewDetails(params.row)}
        />
      </Paper>

      {/* Transport Details Dialog */}
      <Dialog open={!!selectedTransport} onClose={() => setSelectedTransport(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Transport Details - {selectedTransport?.saleNumber}
        </DialogTitle>
        <DialogContent>
          {selectedTransport && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Sale Information</Typography>
                <Typography><strong>Customer:</strong> {selectedTransport.customerName}</Typography>
                <Typography><strong>Sale Date:</strong> {format(new Date(selectedTransport.saleDate), 'dd/MM/yyyy')}</Typography>
                <Typography><strong>Total Amount:</strong> ₹{selectedTransport.totalAmount.toLocaleString()}</Typography>
                <Typography><strong>Delivery Address:</strong> {selectedTransport.deliveryAddress || 'Same as customer address'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Transport Information</Typography>
                {selectedTransport.transportLog && (
                  <>
                    <Typography><strong>Vehicle Type:</strong> {selectedTransport.transportLog.vehicleType}</Typography>
                    <Typography><strong>Vehicle Number:</strong> {selectedTransport.transportLog.vehicleNumber}</Typography>
                    <Typography><strong>Driver Name:</strong> {selectedTransport.transportLog.driverName}</Typography>
                    <Typography><strong>Driver Phone:</strong> {selectedTransport.transportLog.driverPhone}</Typography>
                    <Typography><strong>Delivery Date:</strong> {format(new Date(selectedTransport.transportLog.deliveryDate), 'dd/MM/yyyy')}</Typography>
                    <Typography><strong>Hire Cost:</strong> ₹{selectedTransport.transportLog.hireCost.toLocaleString()}</Typography>
                    {selectedTransport.transportLog.notes && (
                      <Typography><strong>Notes:</strong> {selectedTransport.transportLog.notes}</Typography>
                    )}
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                <Typography><strong>Delivery Charges (Customer):</strong> ₹{selectedTransport.deliveryCharges.toLocaleString()}</Typography>
                <Typography><strong>Transport Cost (Our Cost):</strong> ₹{selectedTransport.transportCost.toLocaleString()}</Typography>
                <Typography><strong>Transport Profit/Loss:</strong> ₹{(selectedTransport.deliveryCharges - selectedTransport.transportCost).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Items to Deliver</Typography>
                {selectedTransport.saleItems.map((item: any, index: number) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography><strong>{item.itemName}</strong> - Quantity: {item.quantity}</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTransport(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportTrackerPage;
