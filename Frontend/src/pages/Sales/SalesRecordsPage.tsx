import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { salesApi } from '../../services/apiService';
import { Sale } from '../../types';

const SalesRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Sale | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: sales, isLoading } = useQuery(
    ['sales', dateFilter.startDate, dateFilter.endDate],
    () => salesApi.getAll(dateFilter.startDate, dateFilter.endDate).then(res => res.data)
  );

  const deleteMutation = useMutation(salesApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('sales');
      setDeleteConfirm(null);
    },
  });

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
  };

  const handleDeleteSale = (sale: Sale) => {
    setDeleteConfirm(sale);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.saleId);
    }
  };

  const applyDateFilter = () => {
    queryClient.invalidateQueries('sales');
  };

  const columns: GridColDef[] = [
    { field: 'saleNumber', headerName: 'Sale #', width: 150 },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    {
      field: 'saleDate',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
    },
    {
      field: 'totalAmount',
      headerName: 'Total (₹)',
      width: 120,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'netProfit',
      headerName: 'Profit (₹)',
      width: 120,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'deliveryRequired',
      headerName: 'Delivery',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'saleItems',
      headerName: 'Items',
      width: 80,
      renderCell: (params) => params.value.length,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleViewSale(params.row)} size="small">
            <ViewIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteSale(params.row)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Sales Records</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sales/add')}
        >
          Add New Sale
        </Button>
      </Box>

      {/* Date Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <DateRangeIcon />
          </Grid>
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
            <Button variant="outlined" onClick={applyDateFilter}>
              Apply Filter
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() => setDateFilter({ startDate: '', endDate: '' })}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={sales || []}
          columns={columns}
          getRowId={(row) => row.saleId}
          pageSize={25}
          loading={isLoading}
          disableSelectionOnClick
        />
      </Paper>

      {/* Sale Details Dialog */}
      <Dialog open={!!selectedSale} onClose={() => setSelectedSale(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Sale Details - {selectedSale?.saleNumber}
        </DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedSale.customerName}</Typography>
                <Typography><strong>Phone:</strong> {selectedSale.customerPhone || 'N/A'}</Typography>
                <Typography><strong>Address:</strong> {selectedSale.customerAddress || 'N/A'}</Typography>
                <Typography><strong>Sale Date:</strong> {format(new Date(selectedSale.saleDate), 'dd/MM/yyyy')}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                <Typography><strong>Subtotal:</strong> ₹{selectedSale.subTotal.toLocaleString()}</Typography>
                <Typography><strong>Take-down Charges:</strong> ₹{selectedSale.takeDownCharges.toLocaleString()}</Typography>
                <Typography><strong>Delivery Charges:</strong> ₹{selectedSale.deliveryCharges.toLocaleString()}</Typography>
                <Typography><strong>Total Amount:</strong> ₹{selectedSale.totalAmount.toLocaleString()}</Typography>
                <Typography><strong>Transport Cost:</strong> ₹{selectedSale.transportCost.toLocaleString()}</Typography>
                <Typography><strong>Net Profit:</strong> ₹{selectedSale.netProfit.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Items Sold</Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {selectedSale.saleItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography><strong>{item.itemName}</strong></Typography>
                      <Typography>
                        Quantity: {item.quantity} × ₹{item.unitPrice} = ₹{item.totalPrice}
                        {item.takeDownChargePerUnit > 0 && (
                          <span> + Take-down: ₹{item.totalTakeDownCharges}</span>
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {selectedSale.deliveryRequired && selectedSale.transportLog && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Transport Details</Typography>
                  <Typography><strong>Vehicle:</strong> {selectedSale.transportLog.vehicleType} ({selectedSale.transportLog.vehicleNumber})</Typography>
                  <Typography><strong>Driver:</strong> {selectedSale.transportLog.driverName} ({selectedSale.transportLog.driverPhone})</Typography>
                  <Typography><strong>Delivery Date:</strong> {format(new Date(selectedSale.transportLog.deliveryDate), 'dd/MM/yyyy')}</Typography>
                  <Typography><strong>Hire Cost:</strong> ₹{selectedSale.transportLog.hireCost}</Typography>
                  {selectedSale.transportLog.notes && (
                    <Typography><strong>Notes:</strong> {selectedSale.transportLog.notes}</Typography>
                  )}
                </Grid>
              )}

              {selectedSale.notes && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Notes</Typography>
                  <Typography>{selectedSale.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSale(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete sale "{deleteConfirm?.saleNumber}"?
            This will restore the stock quantities but cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesRecordsPage;
