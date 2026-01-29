import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, ShoppingCart,
  DollarSign, Package, Calendar
} from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';

export default function Analytics() {
  const [period, setPeriod] = useState('monthly'); // daily, weekly, monthly
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        API.get('/admin-panel/dashboard-stats/'),
        API.get('/admin-panel/sales-report/', {
          params: { period }
        })
      ]);

      setStats(statsRes.data);
      setSalesData(salesRes.data);

      // Generate sample category data
      setCategoryData([
        { name: 'Hoodies', value: 35, revenue: 125000 },
        { name: 'T-Shirts', value: 25, revenue: 95000 },
        { name: 'Bottom Wear', value: 20, revenue: 78000 },
        { name: 'Shoes', value: 12, revenue: 92000 },
        { name: 'Accessories', value: 8, revenue: 35000 },
      ]);

      // Generate sample top products
      setTopProducts([
        { id: 1, name: 'Premium Cotton Hoodie', sales: 245, revenue: 92500 },
        { id: 2, name: 'Classic T-Shirt', sales: 189, revenue: 56700 },
        { id: 3, name: 'Denim Jeans', sales: 156, revenue: 93600 },
        { id: 4, name: 'Running Shoes', sales: 134, revenue: 80400 },
        { id: 5, name: 'Summer Cap', sales: 98, revenue: 24500 },
      ]);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate growth metrics
  const totalRevenue = stats?.total_revenue || 0;
  const todayRevenue = stats?.today_revenue || 0;
  const revenueGrowth = stats?.total_orders > 0 ? ((todayRevenue / (totalRevenue / 30)) * 100).toFixed(2) : 0;
  const avgOrderValue = stats?.avg_order_value || 0;

  const cardMetrics = [
    {
      title: 'Total Revenue',
      value: `₹${Math.round(totalRevenue).toLocaleString()}`,
      change: `+${revenueGrowth}% today`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-300',
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      change: `+${stats?.today_orders || 0} today`,
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
    },
    {
      title: 'Avg Order Value',
      value: `₹${Math.round(avgOrderValue).toLocaleString()}`,
      change: 'Per order',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.5% vs last month',
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-300',
    },
  ];

  const colorMap = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                period === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardMetrics.map((metric, idx) => {
              const IconComponent = metric.icon;
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${metric.bgColor} border ${metric.borderColor} rounded-lg p-6 shadow-sm hover:shadow-md transition`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 font-semibold text-sm">{metric.title}</p>
                    <IconComponent className={`${colorMap[metric.color]} opacity-20`} size={24} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
                  <p className="text-xs text-gray-600 mt-2">{metric.change}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Trend</h3>
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at__date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `₹${Math.round(value).toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Category Sales</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} (${entry.value}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Orders</h3>
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at__date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#10B981" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>

            {/* Category Revenue */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={90} />
                    <Tooltip
                      formatter={(value) => `₹${Math.round(value).toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px' }}
                    />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Units Sold</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avg Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topProducts.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-indigo-600">#{idx + 1}</span>
                          <span className="font-semibold text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800 font-semibold">{product.sales}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">₹{Math.round(product.revenue).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800">₹{Math.round(product.revenue / product.sales).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp size={18} />
                          <span className="text-sm font-semibold">+12%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <p className="text-blue-700 text-sm font-semibold">Avg Daily Sales</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ₹{Math.round((totalRevenue / 30)).toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-2">Based on 30 days</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <p className="text-green-700 text-sm font-semibold">Avg Orders/Day</p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {Math.round(stats?.total_orders / 30) || 0}
              </p>
              <p className="text-xs text-green-700 mt-2">Average per day</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <p className="text-purple-700 text-sm font-semibold">Total Categories</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">{categoryData.length}</p>
              <p className="text-xs text-purple-700 mt-2">Active categories</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <p className="text-orange-700 text-sm font-semibold">Best Category</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {categoryData.length > 0 ? categoryData[0].name : 'N/A'}
              </p>
              <p className="text-xs text-orange-700 mt-2">By sales volume</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}