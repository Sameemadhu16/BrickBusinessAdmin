import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { salesApi, itemsApi } from '../../services/apiService.js';

const AddSalePage = () => {
  const [saleItems, setSaleItems] = useState([]);
  const queryClient = useQueryClient();

  const { data: items } = useQuery('items', () =>
    itemsApi.getAll().then(res => res.data)
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createSaleMutation = useMutation(salesApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('sales');
      reset();
      setSaleItems([]);
      alert('Sale created successfully!');
    },
  });

  const addSaleItem = () => {
    setSaleItems([
      ...saleItems,
      {
        id: Date.now(),
        itemId: '',
        quantity: '',
        pricePerUnit: '',
        takeDownChargeApplied: false,
      },
    ]);
  };

  const removeSaleItem = (id) => {
    setSaleItems(saleItems.filter(item => item.id !== id));
  };

  const updateSaleItem = (id, field, value) => {
    setSaleItems(saleItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const onSubmit = (data) => {
    const saleData = {
      ...data,
      transportCost: parseFloat(data.transportCost || 0),
      saleItems: saleItems.map(item => ({
        itemId: parseInt(item.itemId),
        quantity: parseInt(item.quantity),
        pricePerUnit: parseFloat(item.pricePerUnit),
        takeDownChargeApplied: item.takeDownChargeApplied,
      })),
    };

    createSaleMutation.mutate(saleData);
  };

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => {
      if (item.quantity && item.pricePerUnit) {
        return total + (parseFloat(item.quantity) * parseFloat(item.pricePerUnit));
      }
      return total;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Sale</h1>
        <p className="text-gray-600">Record a new sale transaction</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                {...register('customerName', { required: 'Customer name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <input
                {...register('customerPhone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Address
            </label>
            <textarea
              {...register('customerAddress')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sale Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sale Items</h3>
              <button
                type="button"
                onClick={addSaleItem}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <span>➕</span>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {saleItems.map((saleItem) => (
                <div key={saleItem.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item
                      </label>
                      <select
                        value={saleItem.itemId}
                        onChange={(e) => updateSaleItem(saleItem.id, 'itemId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Item</option>
                        {items?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} - ₹{item.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={saleItem.quantity}
                        onChange={(e) => updateSaleItem(saleItem.id, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Unit
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={saleItem.pricePerUnit}
                        onChange={(e) => updateSaleItem(saleItem.id, 'pricePerUnit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeSaleItem(saleItem.id)}
                        className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saleItem.takeDownChargeApplied}
                        onChange={(e) => updateSaleItem(saleItem.id, 'takeDownChargeApplied', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Apply take down charge</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport Cost
              </label>
              <input
                type="number"
                step="0.01"
                {...register('transportCost')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <div className="text-2xl font-bold text-green-600">
                  ₹{calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setSaleItems([]);
              }}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saleItems.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalePage;
