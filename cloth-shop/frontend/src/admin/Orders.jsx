import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, Package, Filter } from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const itemsPerPage = 10;

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'yellow', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', color: 'blue', icon: CheckCircle },
    { value: 'processing', label: 'Processing', color: 'purple', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'indigo', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'green', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'red', icon: Package },
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders/', {
        params: {
          page: currentPage,
          status: filterStatus,
        },
      });
      setOrders(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      await API.patch(`/orders/${orderId}/`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = STATUS_OPTIONS.find((s) => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const statusObj = STATUS_OPTIONS.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shipping_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        <div className="text-sm text-gray-600">
          Total Orders: <span className="font-bold text-gray-800">{orders.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none flex items-center gap-2"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-indigo-600">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{order.user_email}</p>
                        <p className="text-xs text-gray-600">{order.shipping_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                        {order.items.length} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">₹{Math.round(order.total).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-700">{order.payment_method}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded w-fit font-semibold ${
                            order.payment_status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                          colorClasses[getStatusColor(order.status)]
                        }`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-indigo-600 hover:bg-indigo-100 p-2 rounded transition flex items-center gap-2"
                      >
                        <Eye size={18} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-indigo-100 text-sm">{selectedOrder.order_number}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-indigo-500 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status.value)}
                      disabled={updatingStatus === selectedOrder.id}
                      className={`p-3 rounded-lg font-semibold transition text-sm ${
                        selectedOrder.status === status.value
                          ? 'ring-2 ring-indigo-600 ' + colorClasses[status.color]
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Shipping Name</p>
                  <p className="text-gray-800">{selectedOrder.shipping_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-800">{selectedOrder.shipping_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                  <p className="text-gray-800">{selectedOrder.shipping_email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Date</p>
                  <p className="text-gray-800">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-2">Shipping Address</h3>
                <p className="text-gray-800">{selectedOrder.shipping_address_line1}</p>
                {selectedOrder.shipping_address_line2 && (
                  <p className="text-gray-800">{selectedOrder.shipping_address_line2}</p>
                )}
                <p className="text-gray-800">
                  {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_pincode}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                        {item.variant_info && (
                          <p className="text-sm text-gray-600">{item.variant_info}</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{Math.round(item.price).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">₹{Math.round(item.total).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-800">₹{Math.round(selectedOrder.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-gray-800">₹{Math.round(selectedOrder.shipping_charge).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold text-gray-800">₹{Math.round(selectedOrder.tax).toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-₹{Math.round(selectedOrder.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-indigo-600">₹{Math.round(selectedOrder.total).toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-2">Payment Information</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Method:</span> {selectedOrder.payment_method}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Status:</span> {selectedOrder.payment_status}
                  </p>
                  {selectedOrder.transaction_id && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Transaction ID:</span>{' '}
                      <span className="font-mono">{selectedOrder.transaction_id}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}