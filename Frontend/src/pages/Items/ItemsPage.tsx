import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { itemsApi, categoriesApi } from '../../services/apiService';
import { Item, CreateItemDto, UpdateItemDto } from '../../types';

const ItemsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Item | null>(null);
  
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery('items', () =>
    itemsApi.getAll().then(res => res.data)
  );

  const { data: categories } = useQuery('categories', () =>
    categoriesApi.getAll().then(res => res.data)
  );

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateItemDto | UpdateItemDto>();

  const createMutation = useMutation(itemsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('items');
      setOpenDialog(false);
      reset();
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateItemDto }) => itemsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('items');
        setOpenDialog(false);
        setEditingItem(null);
        reset();
      },
    }
  );

  const deleteMutation = useMutation(itemsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('items');
      setDeleteConfirm(null);
    },
  });

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      reset(item);
    } else {
      setEditingItem(null);
      reset({
        name: '',
        description: '',
        categoryId: 0,
        size: '',
        price: 0,
        stockQuantity: 0,
        unit: 'pieces',
        takeDownChargePerUnit: 0,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = (data: CreateItemDto | UpdateItemDto) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.itemId, data: data as UpdateItemDto });
    } else {
      createMutation.mutate(data as CreateItemDto);
    }
  };

  const handleDelete = (item: Item) => {
    setDeleteConfirm(item);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.itemId);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'categoryName', headerName: 'Category', width: 150 },
    { field: 'size', headerName: 'Size', width: 100 },
    {
      field: 'price',
      headerName: 'Price (₹)',
      width: 120,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.value}
          {params.value <= 10 && (
            <WarningIcon sx={{ color: 'orange', ml: 1, fontSize: 16 }} />
          )}
        </Box>
      ),
    },
    { field: 'unit', headerName: 'Unit', width: 100 },
    {
      field: 'takeDownChargePerUnit',
      headerName: 'Take-down (₹)',
      width: 130,
      renderCell: (params) => params.value ? `₹${params.value}` : '-',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const lowStockItems = items?.filter(item => item.stockQuantity <= 10) || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Items Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Item
        </Button>
      </Box>

      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="h6">Low Stock Alert</Typography>
          <Typography>
            {lowStockItems.length} items have stock ≤ 10 units:
            {lowStockItems.slice(0, 3).map(item => ` ${item.name}`)}
            {lowStockItems.length > 3 && ' and more...'}
          </Typography>
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={items || []}
          columns={columns}
          getRowId={(row) => row.itemId}
          pageSize={25}
          loading={isLoading}
          disableSelectionOnClick
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Item Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoryId}>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        {categories?.map((category) => (
                          <MenuItem key={category.categoryId} value={category.categoryId}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Size"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unit"
                      fullWidth
                      defaultValue="pieces"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be positive' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Price (₹)"
                      type="number"
                      fullWidth
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="stockQuantity"
                  control={control}
                  rules={{ required: 'Stock quantity is required', min: { value: 0, message: 'Stock must be positive' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="takeDownChargePerUnit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Take-down Charge Per Unit (₹)"
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteConfirm?.name}"?
            This action cannot be undone.
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

export default ItemsPage;
