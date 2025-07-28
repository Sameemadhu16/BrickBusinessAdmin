import React, { useState } from 'react';
import { useQuery } from 'react-query';

const TransportTrackerPage = () => {
  const [transports, setTransports] = useState([
    {
      id: 1,
      saleId: 101,
      customerName: 'John Doe',
      destination: '123 Main St, City',
      status: 'In Transit',
      driverName: 'Mike Johnson',
      vehicleNumber: 'ABC-1234',
      departureTime: '2024-01-15T09:00:00',
      estimatedArrival: '2024-01-15T11:30:00',
      transportCost: 500,
    },
    {
      id: 2,
      saleId: 102,
      customerName: 'Jane Smith',
      destination: '456 Oak Ave, Town',
      status: 'Delivered',
      driverName: 'Tom Wilson',
      vehicleNumber: 'XYZ-5678',
      departureTime: '2024-01-14T14:00:00',
      estimatedArrival: '2024-01-14T16:00:00',
      actualArrival: '2024-01-14T15:45:00',
      transportCost: 750,
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTransports = transports.filter(transport => 
    selectedStatus === 'all' || transport.status.toLowerCase().includes(selectedStatus.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateTransportStatus = (id, newStatus) => {
    setTransports(transports.map(transport => 
      transport.id === id 
        ? { 
            ...transport, 
            status: newStatus,
            ...(newStatus === 'Delivered' && !transport.actualArrival ? { actualArrival: new Date().toISOString() } : {})
          }
        : transport
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transport Tracker</h1>
        <p className="text-gray-600">Track delivery status and manage transportation</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transport Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTransports.map((transport) => (
          <div key={transport.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sale #{transport.saleId}
                </h3>
                <p className="text-gray-600">{transport.customerName}</p>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(transport.status)}`}>
                {transport.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-500 w-24">📍 Destination:</span>
                <span className="text-gray-900">{transport.destination}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">🚛 Driver:</span>
                <span className="text-gray-900">{transport.driverName}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">🚗 Vehicle:</span>
                <span className="text-gray-900">{transport.vehicleNumber}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">⏰ Departed:</span>
                <span className="text-gray-900">
                  {new Date(transport.departureTime).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">🎯 ETA:</span>
                <span className="text-gray-900">
                  {new Date(transport.estimatedArrival).toLocaleString()}
                </span>
              </div>
              
              {transport.actualArrival && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24">✅ Delivered:</span>
                  <span className="text-green-600 font-medium">
                    {new Date(transport.actualArrival).toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center">
                <span className="text-gray-500 w-24">💰 Cost:</span>
                <span className="text-gray-900 font-medium">₹{transport.transportCost}</span>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Update Status:</p>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'In Transit', 'Delivered', 'Delayed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateTransportStatus(transport.id, status)}
                    disabled={transport.status === status}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      transport.status === status
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransports.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No transport records found</div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {transports.filter(t => t.status === 'Pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {transports.filter(t => t.status === 'In Transit').length}
          </div>
          <div className="text-sm text-gray-600">In Transit</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {transports.filter(t => t.status === 'Delivered').length}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {transports.filter(t => t.status === 'Delayed').length}
          </div>
          <div className="text-sm text-gray-600">Delayed</div>
        </div>
      </div>
    </div>
  );
};

export default TransportTrackerPage;
