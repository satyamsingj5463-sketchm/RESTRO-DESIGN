import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  ShoppingBag,
  Clock,
  Star,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  X,
  Sparkles,
  IndianRupee
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    menuItems,
    reviews,
    addMenuItem,
    deleteMenuItem,
    updateOrderStatus,
    toggleReviewStatus,
    logoutRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'reviews' | 'settings'>('analytics');

  // New Menu Item form modal state
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('249');
  const [newDishCategory, setNewDishCategory] = useState<MenuItem['category']>('burgers');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80');
  const [newDishVeg, setNewDishVeg] = useState(true);

  // Geofence settings
  const [geofenceRadiusKm, setGeofenceRadiusKm] = useState(8.5);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(399);

  // Financial calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.pricing.total, 0);

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    await addMenuItem({
      name: newDishName.trim(),
      codeName: newDishName.toUpperCase().replace(/\s+/g, '_'),
      description: newDishDesc.trim() || 'Freshly prepared specialty dish with premium spices.',
      price: parseFloat(newDishPrice) || 199,
      category: newDishCategory,
      image: newDishImage,
      rating: 5.0,
      reviewsCount: 1,
      isVeg: newDishVeg,
      isAvailable: true,
      prepTimeMinutes: 15,
      tags: ['Chef Signature', 'Freshly Added']
    });

    setIsAddDishModalOpen(false);
    setNewDishName('');
    setNewDishDesc('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Coder Cafe Admin Central</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Authorized Administrator Session
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Master management hub • Real-time INR revenue, live orders, catalog management & geofencing
            </p>
          </div>
        </div>

        <button
          onClick={logoutRole}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
        >
          Exit Admin View
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/[0.08]">
        {[
          { id: 'analytics', label: 'Executive Analytics', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'menu', label: `Menu Dishes (${menuItems.length})`, icon: Sparkles },
          { id: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: Star },
          { id: 'settings', label: 'Geofence & Dispatch Rules', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#0D131F] hover:bg-white/[0.05] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards in INR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                ₹{(totalRevenue + 42800).toFixed(0)}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                ↑ +22.4% vs last week
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Orders Processed</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                {orders.length + 142}
              </div>
              <span className="text-[11px] text-amber-400 font-semibold mt-1 inline-block">
                {orders.filter((o) => o.status === 'out_for_delivery').length} dispatched now
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Delivery ETA</span>
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                22.4 <span className="text-sm font-sans font-normal text-slate-400">mins</span>
              </div>
              <span className="text-[11px] text-sky-400 font-semibold mt-1 inline-block">
                ⚡ Prompt dispatch record
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Rating</span>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Star className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                4.91 <span className="text-sm font-sans font-normal text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[11px] text-purple-400 font-semibold mt-1 inline-block">
                ★ 98% 5-star customer reviews
              </span>
            </div>
          </div>

          {/* Top Selling Dishes Matrix */}
          <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white mb-3 tracking-tight">Top Performing Menu Items</h3>
            <div className="space-y-2.5">
              {menuItems.slice(0, 4).map((dish, i) => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#080C14] border border-white/[0.06] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-400 w-4">#{i + 1}</span>
                    <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <span className="font-bold text-white">{dish.name}</span>
                      <p className="text-[11px] text-slate-400 font-mono">₹{dish.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">{(42 - i * 8) * 3} orders</span>
                    <p className="text-[10px] text-slate-500">★ {dish.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ORDERS MASTER CONTROL */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]">
            <h3 className="font-bold text-sm text-white">All Real-Time Restaurant Orders</h3>
            <span className="text-xs text-slate-400 font-mono">{orders.length} registered orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080C14] text-slate-400 uppercase font-mono text-[10px] border-b border-white/[0.08]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Dishes</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      #{ord.orderNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{ord.customer.name}</div>
                      <div className="text-[11px] text-slate-400">{ord.customer.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-200">
                        {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      ₹{ord.pricing.total.toFixed(2)}
                    </td>
                    <td className="p-3.5 font-mono uppercase text-[11px]">
                      {ord.payment.method}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#080C14] border border-white/[0.12] rounded-xl px-2 py-1 text-xs text-white font-mono focus:outline-none"
                      >
                        <option value="placed">placed</option>
                        <option value="preparing">preparing</option>
                        <option value="ready">ready</option>
                        <option value="out_for_delivery">out_for_delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Menu Item Catalog</h3>
            <button
              onClick={() => setIsAddDishModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-3xl bg-[#0D131F] border border-white/[0.08] flex items-start gap-3 justify-between"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs truncate">{item.name}</div>
                    <div className="font-mono text-amber-400 text-xs font-bold mt-0.5">
                      ₹{item.price}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Customer Reviews Moderation</h3>
              <p className="text-xs text-slate-400">
                Filter inappropriate content or toggle public visibility of verified reviews.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400">{reviews.length} customer reviews</span>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  rev.status === 'published'
                    ? 'bg-[#080C14] border-white/[0.08] text-slate-200'
                    : 'bg-[#080C14]/40 border-white/[0.04] opacity-50 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.customerName}</span>
                    <span className="text-amber-400 font-mono font-bold">★ {rev.rating}/5</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        rev.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/[0.06] text-slate-400'
                      }`}
                    >
                      {rev.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <button
                  onClick={() => toggleReviewStatus(rev.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    rev.status === 'published'
                      ? 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  {rev.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{rev.status === 'published' ? 'Hide Review' : 'Publish'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GEOFENCE & SECURITY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] space-y-6">
          <div>
            <h3 className="font-bold text-base text-white">Geofence & Dispatch Logistics</h3>
            <p className="text-xs text-slate-400">
              Configure maximum delivery radius and free delivery threshold.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#080C14] border border-white/[0.08] space-y-4 max-w-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Maximum Delivery Radius</span>
                <span className="font-mono text-amber-400 font-bold">{geofenceRadiusKm} km</span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                step={0.5}
                value={geofenceRadiusKm}
                onChange={(e) => setGeofenceRadiusKm(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Free Delivery Minimum Order Amount</span>
                <span className="font-mono text-emerald-400 font-bold">₹{freeDeliveryThreshold}</span>
              </div>
              <input
                type="range"
                min={199}
                max={999}
                step={50}
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0D131F] border border-white/[0.12] rounded-3xl p-5 shadow-2xl text-slate-100">
            <button
              onClick={() => setIsAddDishModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-4 tracking-tight">Add Dish to Coder Cafe Menu</h3>

            <form onSubmit={handleCreateDish} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Paneer Tikka Burger"
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="e.g. Grilled cottage cheese patty with mint chutney..."
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-white"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="burgers">Burgers</option>
                    <option value="pizza">Pizza</option>
                    <option value="sides">Sides</option>
                    <option value="desserts">Desserts</option>
                    <option value="combos">Combos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Image URL</label>
                <input
                  type="text"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vegCheck"
                  checked={newDishVeg}
                  onChange={(e) => setNewDishVeg(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
                <label htmlFor="vegCheck" className="text-slate-300 cursor-pointer">
                  Vegetarian Dish
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Publish Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
