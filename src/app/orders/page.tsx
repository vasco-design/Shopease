'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { orderAPI, type Order, type ApiResponse } from '@/lib/api';
import { Search } from 'lucide-react';

type OrderStatus = Order;

export default function OrderTrackingPage() {
  const [searchId, setSearchId] = useState('');
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response: ApiResponse<Order> = await orderAPI.getById(searchId);
      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        setError('Order not found. Please check the order ID and try again.');
      }
    } catch (err) {
      setError('Error fetching order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  ) => {
    const colors: Record<string, string> = {
      Pending: 'yellow',
      Processing: 'blue',
      Shipped: 'purple',
      Delivered: 'green',
      Cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order ID to see the latest status and updates
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter your order ID (e.g., 550e8400-e29b-41d4-a716-446655440000)"
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search size={18} />
              {loading ? 'Searching...' : 'Track'}
            </Button>
          </form>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                  <div key={status} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(status) <=
                        ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(
                          orderData.status
                        )
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(status) <
                      ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(orderData.status)
                        ? '✓'
                        : ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(status)}
                    </div>
                    <p className="text-sm font-medium">{status}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="text-lg font-bold text-blue-600">
                  <Badge
                    variant={getStatusColor(orderData.status) === 'green' ? 'default' : 'secondary'}
                  >
                    {orderData.status}
                  </Badge>
                </p>
              </div>
            </Card>

            {/* Order Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm font-medium break-all">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {new Date(orderData.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{orderData.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg">${orderData.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            {/* Payment Status */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Status</h2>
              <Badge
                variant={
                  orderData.payment_status === 'Completed' ? 'default' : 'secondary'
                }
              >
                {orderData.payment_status}
              </Badge>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Items in Order</h2>
              <div className="space-y-3">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.product_title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Help Section */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h2 className="text-lg font-bold mb-2">Need Help?</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our support team or use
                the live chat feature.
              </p>
              <Button variant="outline">Contact Support</Button>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!orderData && !error && !loading && (
          <Card className="p-12 text-center">
            <p className="text-gray-600">
              Enter an order ID above to track your order status in real-time.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
