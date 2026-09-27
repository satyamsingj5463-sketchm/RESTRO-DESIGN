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
  IndianRupee,
  Lock,
  Key,
  Check,
  ChefHat,
  Bike
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
    logoutRole,
    securityPins,
    updateSecurityPin,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'menu' | 'reviews' | 'settings'>('analytics');
  const [privacyMode, setPrivacyMode] = useState(true);

  // Security Credentials settings state (Default: 161616)
  const [adminPinInput, setAdminPinInput] = useState(securityPins.admin);
  const [staffPinInput, setStaffPinInput] = useState(securityPins.staff);
  const [riderPinInput, setRiderPinInput] = useState(securityPins.rider);
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showStaffPin, setShowStaffPin] = useState(false);
  const [showRiderPin, setShowRiderPin] = useState(false);

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

  // 100% Real Financial & Business calculations from Firestore data
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.pricing.total, 0);
  const totalOrdersCount = orders.length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'out_for_delivery').length;

  const publishedReviews = reviews.filter((r) => r.status === 'published');
  const avgCustomerRating =
    publishedReviews.length > 0
      ? (publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length).toFixed(1)
      : 'New';

  // Compute actual dish order volume
  const dishOrderCounts = new Map<string, number>();
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      const prev = dishOrderCounts.get(item.menuItem.id) || 0;
      dishOrderCounts.set(item.menuItem.id, prev + item.quantity);
    });
  });

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
      reviewsCount: 0,
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
    <div className="space-y-4 animate-fade-in pb-16">
      {/* Mobile Top Header */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/30 shadow-md text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/30 text-white font-black shadow-xs">
            <Shield className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white tracking-tight">Admin Central</h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-purple-400/20 text-purple-200 border border-purple-300/30 font-bold">
                Master
              </span>
            </div>
            <p className="text-[10px] text-purple-200/80">Real Revenue, Orders, Dishes & Security</p>
          </div>
        </div>

        <button
          onClick={logoutRole}
          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
        >
          ← Exit
        </button>
      </div>

      {/* Navigation Tabs (Mobile horizontal scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'menu', label: `Dishes (${menuItems.length})`, icon: Sparkles },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'settings', label: 'Security & PINs', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Key Metric KPI Cards in INR */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                ₹{totalRevenue.toFixed(0)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 inline-block">
                • 100% Real Firestore data
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Orders Placed</span>
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                {totalOrdersCount}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold mt-0.5 inline-block">
                {dispatchedOrdersCount} out for delivery
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Prep ETA</span>
                <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                15-25 <span className="text-xs font-sans font-normal text-slate-500">mins</span>
              </div>
              <span className="text-[10px] text-sky-600 font-semibold mt-0.5 inline-block">
                ⚡ Express Kitchen speed
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Real Diner Rating</span>
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Star className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                {avgCustomerRating}
              </div>
              <span className="text-[10px] text-purple-600 font-semibold mt-0.5 inline-block">
                ★ {publishedReviews.length} real verified reviews
              </span>
            </div>
          </div>

          {/* Top Selling Dishes Matrix */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Menu Item Popularity (Real Orders)
            </h3>
            <div className="space-y-2">
              {menuItems.slice(0, 4).map((dish, i) => {
                const count = dishOrderCounts.get(dish.id) || 0;
                return (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-amber-600 w-4">#{i + 1}</span>
                      <img src={dish.image} alt={dish.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-slate-900">{dish.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono">₹{dish.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600">{count} ordered</span>
                      <p className="text-[10px] text-slate-400 capitalize">{dish.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ORDERS MASTER CONTROL */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Live Orders Queue</h3>
              <span className="text-[10px] text-slate-500 font-mono">{orders.length} registered orders</span>
            </div>

            {/* Data Privacy Toggle */}
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                privacyMode
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{privacyMode ? 'Privacy: Masked' : 'Privacy: Visible'}</span>
            </button>
          </div>

          {/* Touch-Friendly Mobile Order Cards */}
          <div className="p-3 space-y-3">
            {orders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No orders placed yet in database</p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-amber-600">
                        #{ord.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="font-mono font-black text-xs text-slate-900">
                      ₹{ord.pricing.total.toFixed(0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{ord.customer.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {privacyMode
                        ? ord.customer.phone.replace(/(\+?\d{2})\s?(\d{2})\d{4}(\d{4})/, '$1 $2•••• ••$3')
                        : ord.customer.phone}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 truncate border-t border-b border-slate-200/60 py-1.5">
                    {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">
                      {ord.payment.method} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <select
                      value={ord.status}
                      onChange={(e) => {
                        updateOrderStatus(ord.id, e.target.value as OrderStatus);
                        addToast('Status Updated', `Order #${ord.orderNumber} set to ${e.target.value}`, 'success');
                      }}
                      className="bg-white border border-amber-300 rounded-xl px-2 py-1 text-xs text-amber-800 font-mono focus:outline-none shadow-xs"
                    >
                      <option value="placed">placed</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="out_for_delivery">out_for_delivery</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Menu Item Catalog</h3>
            <button
              onClick={() => setIsAddDishModalOpen(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 justify-between shadow-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">{item.name}</div>
                    <div className="font-mono text-amber-700 text-xs font-bold mt-0.5">
                      ₹{item.price}
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Reviews Moderation</h3>
              <p className="text-xs text-slate-500">
                Filter inappropriate content or toggle public visibility of real reviews.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-600 font-bold">{reviews.length} reviews</span>
          </div>

          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No reviews submitted yet</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    rev.status === 'published'
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-50/50 border-slate-200 opacity-50 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.customerName}</span>
                      <span className="text-amber-600 font-mono font-bold">★ {rev.rating}/5</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          rev.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {rev.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 text-xs italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <button
                    onClick={() => toggleReviewStatus(rev.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                      rev.status === 'published'
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {rev.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{rev.status === 'published' ? 'Hide Review' : 'Publish'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: GEOFENCE & SECURITY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Geofence & Dispatch Logistics</h3>
            <p className="text-xs text-slate-500">
              Configure delivery radius and free delivery threshold.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Maximum Delivery Radius</span>
                <span className="font-mono text-amber-700 font-bold">{geofenceRadiusKm} km</span>
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
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Free Delivery Minimum Order Amount</span>
                <span className="font-mono text-emerald-700 font-bold">₹{freeDeliveryThreshold}</span>
              </div>
              <input
                type="range"
                min={199}
                max={999}
                step={50}
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Security & Password Management Section */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Security Credentials</h3>
                <p className="text-xs text-slate-500">
                  Update PIN access for Admin Panel, Kitchen Staff, and Rider Fleet.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Admin PIN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-xs text-slate-900">Admin PIN</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Master Gate</span>
                </div>

                <div className="relative">
                  <input
                    type={showAdminPin ? 'text' : 'password'}
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="••••••"
                    maxLength={10}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                    title={showAdminPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => updateSecurityPin('admin', adminPinInput)}
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Admin PIN</span>
                </button>
              </div>

              {/* 2. Staff Kitchen PIN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-xs text-slate-900">Kitchen Staff PIN</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">KDS Station</span>
                </div>

                <div className="relative">
                  <input
                    type={showStaffPin ? 'text' : 'password'}
                    value={staffPinInput}
                    onChange={(e) => setStaffPinInput(e.target.value)}
                    placeholder="••••••"
                    maxLength={10}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPin(!showStaffPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                    title={showStaffPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showStaffPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => updateSecurityPin('staff', staffPinInput)}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Staff PIN</span>
                </button>
              </div>

              {/* 3. Rider Hub PIN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-sky-600" />
                    <h4 className="font-bold text-xs text-slate-900">Rider Hub PIN</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Fleet Access</span>
                </div>

                <div className="relative">
                  <input
                    type={showRiderPin ? 'text' : 'password'}
                    value={riderPinInput}
                    onChange={(e) => setRiderPinInput(e.target.value)}
                    placeholder="••••••"
                    maxLength={10}
                    className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRiderPin(!showRiderPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                    title={showRiderPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showRiderPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => updateSecurityPin('rider', riderPinInput)}
                  className="w-full py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Rider PIN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl text-slate-900">
            <button
              onClick={() => setIsAddDishModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 mb-3 tracking-tight">Add Dish to Coder Cafe Menu</h3>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Paneer Tikka Burger"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description</label>
                <input
                  type="text"
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="e.g. Grilled cottage cheese patty with mint chutney..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
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
                <label className="block text-slate-700 mb-1 font-semibold">Image URL</label>
                <input
                  type="text"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
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
                <label htmlFor="vegCheck" className="text-slate-700 cursor-pointer font-medium">
                  Vegetarian Dish
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Publish to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
