import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Users, Package, ShoppingCart, CreditCard, AlertTriangle,
  TrendingUp, DollarSign, Menu, X, LogOut, ExternalLink, Search,
  LayoutDashboard, Archive, ClipboardList, Truck, FileText, Headphones, Settings, Link2
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { adminAPI } from '../api/admin';
import toast from 'react-hot-toast';

// Import child components
import ProductsPage from './Products';
import OrdersPage from './Orders';
import UsersPage from './Users';
import PaymentsPage from './Payments';
import AnalyticsPage from './Analystics';
import HeroSlidesPage from './HeroSlides';
import MensHoodiesGridPage from './MensHoodiesGrid';
import CategoryCardsPage from './CategoryCards';
import BottomStylesPage from './BottomStyles';
import JacketsGridPage from './JacketsGrid';
import PromotionalBannersPage from './PromotionalBanners';
import TshirtGridPage from './TshirtGrid';
import ShoesGridPage from './ShoesGrid';
import ShoesCardPage from './ShoesCard';
import RelatedProductsPage from './RelatedProducts';

// Colors for the inventory pie chart
const INVENTORY_COLORS = ['#4B9CD3', '#A7C7E7'];

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getSalesReport('monthly')
      ]);

      setStats(statsRes.data);
      setSalesData(Array.isArray(salesRes.data) ? salesRes.data : []);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Archive },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'related-products', label: 'Related Products', icon: Link2 },
    { id: 'hero-slides', label: 'Hero Slides', icon: FileText },
    { id: 'category-cards', label: 'Category Cards', icon: Package },
    { id: 'mens-hoodies-grid', label: 'Hoodies Grid', icon: Package },
    { id: 'bottom-styles', label: 'Bottom Styles', icon: Package },
    { id: 'jackets-grid', label: 'Jackets Grid', icon: Package },
    { id: 'promotional-banners', label: 'Promo Banner', icon: FileText },
    { id: 'tshirt-grid', label: 'T-Shirt Grid', icon: Package },
    { id: 'shoes-grid', label: 'Shoes Grid', icon: Package },
    { id: 'shoes-card', label: 'Shoes Card', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Reporting', icon: TrendingUp },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Inventory pie chart data - using real stats
  const inventoryData = stats ? [
    { name: 'Sold/Out of Stock', value: stats.sold_percentage || 0 },
    { name: 'Available', value: stats.available_percentage || 100 },
  ] : [
    { name: 'Sold/Out of Stock', value: 0 },
    { name: 'Available', value: 100 },
  ];

  // Top categories data from API
  const topCategoriesData = stats?.top_categories || [];

  // Monthly revenue data from API
  const monthlyRevenueData = stats?.monthly_revenue || [];

  return (
    <div className="flex h-screen bg-[#e8f4f8]">
      {/* Sidebar - Dark Teal */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-[#1a3a4a] to-[#2d5a6a] text-white transition-all duration-300 shadow-xl flex flex-col relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 bg-[#1a3a4a] p-1.5 rounded-full shadow-lg hover:bg-[#2d5a6a] transition z-10"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Profile Section */}
        <div className={`p-6 border-b border-white/10 ${sidebarOpen ? 'text-center' : 'flex justify-center'}`}>
          <div className="relative inline-block">
            <img
              src={user?.profile_image || 'https://placehold.co/80x80/1a3a4a/fff?text=U'}
              alt="Profile"
              className={`${sidebarOpen ? 'w-20 h-20' : 'w-10 h-10'} rounded-full object-cover border-3 border-white/30 shadow-lg`}
            />
            <span className={`absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a3a4a] ${!sidebarOpen && 'hidden'}`}></span>
          </div>
          {sidebarOpen && (
            <div className="mt-3">
              <p className="font-semibold text-white">{user?.first_name || 'Admin User'}</p>
              <p className="text-xs text-white/60 truncate">{user?.email || 'admin@email.com'}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.slice(0, 15).map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${activeTab === item.id
                  ? 'bg-white/20 text-white font-medium'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
                  } ${!sidebarOpen && 'justify-center'}`}
              >
                <IconComponent size={18} />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white ${!sidebarOpen && 'justify-center'}`}
          >
            <ExternalLink size={18} />
            {sidebarOpen && <span className="text-sm">View Site</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/20 transition text-white/80 hover:text-red-300 ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-sm px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome {user?.first_name || 'Admin'} !
          </h1>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B9CD3] focus:border-transparent"
              />
            </div>
            {/* Notification & Profile */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <img
                src={user?.profile_image || 'https://placehold.co/40x40/4B9CD3/fff?text=U'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#4B9CD3]"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Section Title */}
              <h2 className="text-lg font-semibold text-gray-700">Over View</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-[#4B9CD3] mb-4"></div>
                  <p className="text-gray-600">Loading stats...</p>
                </div>
              ) : stats ? (
                <>
                  {/* Overview Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Products */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#e8f4f8] rounded-xl">
                          <Package className="text-[#4B9CD3]" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{stats.total_products ?? 0}</p>
                          <p className="text-sm text-gray-500">Total Products</p>
                        </div>
                      </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#fff3e6] rounded-xl">
                          <ShoppingCart className="text-[#E89B4E]" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{stats.total_orders ?? 0}</p>
                          <p className="text-sm text-gray-500">Orders</p>
                        </div>
                      </div>
                    </div>

                    {/* Total Stock */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#e6f7f0] rounded-xl">
                          <Archive className="text-[#4CAF8C]" size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{stats.total_stock ?? 0}</p>
                          <p className="text-sm text-gray-500">Total Stock</p>
                        </div>
                      </div>
                    </div>

                    {/* Out of Stock */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#fef3e6] rounded-xl">
                          <AlertTriangle className="text-[#E8A84E]" size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-gray-800">{stats.out_of_stock ?? 0}</p>
                          <p className="text-sm text-gray-500">Out of Stock</p>
                        </div>
                        <button className="text-[#4B9CD3] hover:underline text-sm">i</button>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* No of Users Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">No of users</h3>
                        <button className="text-gray-400 hover:text-gray-600">⋮</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-[#e8f4f8] rounded-xl">
                          <Users className="text-[#4B9CD3]" size={32} />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-gray-800">
                            {stats.total_users >= 1000
                              ? `${(stats.total_users / 1000).toFixed(1)}K`
                              : stats.total_users || 0}
                          </p>
                          <p className="text-sm text-gray-500">Total Customers</p>
                        </div>
                      </div>
                    </div>

                    {/* Inventory Values Pie Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <h3 className="font-semibold text-gray-700 mb-4">Inventory Values</h3>
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width={150} height={150}>
                          <PieChart>
                            <Pie
                              data={inventoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {inventoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={INVENTORY_COLORS[index % INVENTORY_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="ml-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#A7C7E7] rounded"></div>
                            <span className="text-sm text-gray-600">Sold units</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#4B9CD3] rounded"></div>
                            <span className="text-sm text-gray-600">Total units</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-lg font-bold text-gray-700">{stats.sold_percentage || 0}%</span>
                        <span className="text-gray-500 mx-2">/</span>
                        <span className="text-lg font-bold text-gray-700">{stats.available_percentage || 100}%</span>
                      </div>
                    </div>

                    {/* Top Categories by Products */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <h3 className="font-semibold text-gray-700 mb-4">Top Categories</h3>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {topCategoriesData.length > 0 ? topCategoriesData.map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-24 truncate">{cat.name}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min((cat.product_count / Math.max(...topCategoriesData.map(c => c.product_count), 1)) * 100, 100)}%`,
                                  backgroundColor: idx < 3 ? '#4B9CD3' : idx < 6 ? '#7BC6E3' : '#A7C7E7'
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 w-12 text-right">{cat.product_count}</span>
                          </div>
                        )) : (
                          <p className="text-gray-400 text-sm text-center py-4">No category data</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Monthly Revenue Trend Chart */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-700">Monthly Revenue</h3>
                      <span className="text-sm text-gray-500">Last 6 months</span>
                    </div>
                    {monthlyRevenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={monthlyRevenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4B9CD3" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#4B9CD3" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value, name) => [name === 'revenue' ? `₹${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#4B9CD3" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="revenue" />
                          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 10 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <p>No revenue data available yet</p>
                        <p className="text-sm mt-2">Data will appear once orders are placed</p>
                      </div>
                    )}
                    {/* Summary */}
                    <div className="flex justify-center gap-8 mt-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                        <span className="text-[#4B9CD3]">Total Revenue: ₹{stats.total_revenue?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                        <span className="text-[#4CAF8C]">Avg Order: ₹{Math.round(stats.avg_order_value || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeTab === 'hero-slides' && <HeroSlidesPage />}
          {activeTab === 'category-cards' && <CategoryCardsPage />}
          {activeTab === 'mens-hoodies-grid' && <MensHoodiesGridPage />}
          {activeTab === 'bottom-styles' && <BottomStylesPage />}
          {activeTab === 'jackets-grid' && <JacketsGridPage />}
          {activeTab === 'promotional-banners' && <PromotionalBannersPage />}
          {activeTab === 'tshirt-grid' && <TshirtGridPage />}
          {activeTab === 'shoes-grid' && <ShoesGridPage />}
          {activeTab === 'shoes-card' && <ShoesCardPage />}
          {activeTab === 'related-products' && <RelatedProductsPage />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'orders' && <OrdersPage />}
          {activeTab === 'users' && <UsersPage />}
          {activeTab === 'payments' && <PaymentsPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'support' && (
            <div className="text-center py-12">
              <Headphones size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Support</h3>
              <p className="text-gray-500">Support features coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">Settings</h3>
              <p className="text-gray-500">Settings features coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}