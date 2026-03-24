'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { adminAPI, inventoryAPI, orderAPI, type Stats, type Product, type InventoryItem, type Order } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders'>(
    'dashboard'
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const statsResponse = await adminAPI.getStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } else if (activeTab === 'products') {
        const productsResponse = await adminAPI.getProducts();
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } else if (activeTab === 'inventory') {
        const inventoryResponse = await inventoryAPI.getAll();
        if (inventoryResponse.success && inventoryResponse.data) {
          setInventory(inventoryResponse.data);
        }
      } else if (activeTab === 'orders') {
        const ordersResponse = await orderAPI.getAll();
        if (ordersResponse.success && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        fetchStats();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      fetchStats();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-4xl font-bold">ShopEase Admin Dashboard</h1>
        <p className="text-blue-100 mt-2">Manage products, inventory, and orders</p>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {(['dashboard', 'products', 'inventory', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Products</p>
                      <p className="text-4xl font-bold mt-2">{stats.total_products}</p>
                    </div>
                    <Package className="w-12 h-12 text-blue-500 opacity-20" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Orders</p>
                      <p className="text-4xl font-bold mt-2">{stats.total_orders}</p>
                    </div>
                    <ShoppingCart className="w-12 h-12 text-green-500 opacity-20" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Revenue</p>
                      <p className="text-4xl font-bold mt-2">${stats.total_revenue.toFixed(0)}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Low Stock Items</p>
                      <p className="text-4xl font-bold mt-2 text-orange-600">
                        {stats.low_stock_items}
                      </p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-orange-500 opacity-20" />
                  </div>
                </Card>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <Button className="mb-6">Add New Product</Button>
                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((product: Product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{product.title}</td>
                          <td className="px-6 py-4 text-sm">${product.price}</td>
                          <td className="px-6 py-4 text-sm">{product.category}</td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div>
                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Reorder Level
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {inventory.map((item: InventoryItem) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{item.product_title}</td>
                          <td className="px-6 py-4 text-sm font-medium">{item.stock}</td>
                          <td className="px-6 py-4 text-sm">{item.reorder_level}</td>
                          <td className="px-6 py-4 text-sm">
                            <Badge variant={item.status === 'In Stock' ? 'default' : 'destructive'}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((order: Order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-mono">{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                          <td className="px-6 py-4 text-sm font-medium">${order.total_amount}</td>
                          <td className="px-6 py-4 text-sm">
                            <Badge>{order.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Badge
                              variant={
                                order.payment_status === 'Completed'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {order.payment_status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value)
                              }
                              className="px-2 py-1 border rounded text-sm"
                            >
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
