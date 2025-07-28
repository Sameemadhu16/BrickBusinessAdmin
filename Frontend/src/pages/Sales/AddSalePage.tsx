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
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { itemsApi, salesApi } from '../../services/apiService';
import { CreateSaleDto, CreateSaleItemDto, CreateTransportLogDto } from '../../types';

interface SaleFormData extends CreateSaleDto {
  saleItems: (CreateSaleItemDto & { itemName?: string })[];
}

const AddSalePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deliveryRequired, setDeliveryRequired] = useState(false);

  const { data: items } = useQuery('items', () =>
    itemsApi.getAll().then(res => res.data)
  );

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SaleFormData>({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      saleDate: new Date().toISOString().split('T')[0],
      deliveryRequired: false,
      deliveryAddress: '',
      deliveryCharges: 0,
      notes: '',
      saleItems: [{ itemId: 0, quantity: 1, unitPrice: 0, takeDownChargePerUnit: 0 }],
      transportLog: {
        vehicleType: '',
        vehicleNumber: '',
        driverName: '',
        driverPhone: '',
        hireCost: 0,
        deliveryDate: new Date().toISOString().split('T')[0],
        pickupLocation: '',
        deliveryLocation: '',
        notes: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'saleItems',
  });

  const watchedItems = watch('saleItems');

  const createSaleMutation = useMutation(salesApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('sales');
      navigate('/sales/records');
    },
  });

  const onSubmit = (data: SaleFormData) => {
    const saleData: CreateSaleDto = {
      ...data,
      deliveryRequired,
      transportLog: deliveryRequired ? data.transportLog : undefined,
    };
    createSaleMutation.mutate(saleData);
  };

  const handleItemChange = (index: number, itemId: number) => {
    const selectedItem = items?.find(item => item.itemId === itemId);
    if (selectedItem) {
      setValue(`saleItems.${index}.unitPrice`, selectedItem.price);
      setValue(`saleItems.${index}.takeDownChargePerUnit`, selectedItem.takeDownChargePerUnit || 0);
    }
  };

  const addSaleItem = () => {
    append({ itemId: 0, quantity: 1, unitPrice: 0, takeDownChargePerUnit: 0 });
  };

  const calculateTotals = () => {
    const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const takeDownCharges = watchedItems.reduce((sum, item) => sum + (item.quantity * item.takeDownChargePerUnit), 0);
    const deliveryCharges = watch('deliveryCharges') || 0;
    const total = subTotal + takeDownCharges + deliveryCharges;
    
    return { subTotal, takeDownCharges, deliveryCharges, total };
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Sale
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="customerName"
                    control={control}
                    rules={{ required: 'Customer name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Name"
                        fullWidth
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="customerPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="saleDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Sale Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="customerAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Address"
                        multiline
                        rows={2}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sale Items */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Sale Items
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addSaleItem}
                >
                  Add Item
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price (₹)</TableCell>
                      <TableCell>Take-down (₹)</TableCell>
                      <TableCell>Total (₹)</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`saleItems.${index}.itemId`}
                            control={control}
                            rules={{ required: 'Item is required' }}
                            render={({ field }) => (
                              <FormControl fullWidth size="small">
                                <Select
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleItemChange(index, e.target.value as number);
                                  }}
                                >
                                  <MenuItem value={0}>Select Item</MenuItem>
                                  {items?.map((item) => (
                                    <MenuItem key={item.itemId} value={item.itemId}>
                                      {item.name} ({item.size})
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`saleItems.${index}.quantity`}
                            control={control}
                            rules={{ required: true, min: 1 }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 80 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`saleItems.${index}.unitPrice`}
                            control={control}
                            rules={{ required: true, min: 0 }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 100 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`saleItems.${index}.takeDownChargePerUnit`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 100 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          ₹{((watchedItems[index]?.quantity || 0) * 
                             ((watchedItems[index]?.unitPrice || 0) + 
                              (watchedItems[index]?.takeDownChargePerUnit || 0))).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Delivery & Transport */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Delivery & Transport
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={deliveryRequired}
                    onChange={(e) => setDeliveryRequired(e.target.checked)}
                  />
                }
                label="Delivery Required"
              />

              {deliveryRequired && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="deliveryAddress"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Delivery Address"
                          multiline
                          rows={2}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="deliveryCharges"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Delivery Charges (₹)"
                          type="number"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Transport Details
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="transportLog.vehicleType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Vehicle Type"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="transportLog.vehicleNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Vehicle Number"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="transportLog.hireCost"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Hire Cost (₹)"
                          type="number"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="transportLog.driverName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Driver Name"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="transportLog.driverPhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Driver Phone"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Summary */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Notes"
                        multiline
                        rows={3}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body1">
                      Subtotal: ₹{totals.subTotal.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Take-down Charges: ₹{totals.takeDownCharges.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Delivery Charges: ₹{totals.deliveryCharges.toFixed(2)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6">
                      Total: ₹{totals.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/sales/records')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={createSaleMutation.isLoading}
              >
                Create Sale
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {createSaleMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error creating sale. Please check all fields and try again.
        </Alert>
      )}
    </Box>
  );
};

export default AddSalePage;
