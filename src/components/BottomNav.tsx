import React from 'react';
import {
  Utensils,
  Compass,
  ShoppingBag,
  Settings,
  ArrowRight,
  LogOut,
  Coffee
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  onOpenSettingsHub: () => void;
  onOpenTracker: () => void;
  onOpenCart: () => void;
  activeTab: 'menu' | 'track';
  setActiveTab: (tab: 'menu' | 'track') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenSettingsHub,
  onOpenTracker,
  onOpenCart,
  activeTab,
  setActiveTab
}) => {
  const {
    role,
    setRole,
    cartTotalCount,
    cartSubtotal,
    orders,
    logoutRole
  } = useApp();

  const activeOrder = orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] pb-safe transition-all">
      {/* If currently in Staff, Admin, or Rider mode: show quick exit bar */}
      {role !== 'customer' && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white px-4 py-1.5 border-b border-indigo-900 flex items-center justify-between text-xs max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono text-amber-300 font-bold uppercase">
              Mode: {role === 'staff' ? 'Kitchen KDS' : role === 'admin' ? 'Executive Admin' : 'Rider Fleet'}
            </span>
          </div>
          <button
            onClick={logoutRole}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-white/15"
          >
            <Coffee className="w-3 h-3 text-amber-400" />
            <span>Customer Menu</span>
          </button>
        </div>
      )}

      {/* Floating Quick Cart Bar (when items are in cart and viewing customer menu) */}
      {cartTotalCount > 0 && role === 'customer' && activeTab === 'menu' && (
        <div className="px-3 pt-2 pb-1 max-w-md mx-auto animate-slide-up">
          <button
            onClick={onOpenCart}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/25 flex items-center justify-between transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 text-[11px] flex items-center justify-center font-mono font-black">
                {cartTotalCount}
              </span>
              <span className="font-extrabold tracking-tight">View Cart & Checkout</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black">
              <span>₹{cartSubtotal.toFixed(0)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      )}

      {/* 4-Tab Native Mobile App Navigation */}
      <nav className="grid grid-cols-4 h-14 items-center px-2 max-w-md mx-auto" aria-label="Mobile Navigation">
        {/* 1. Explore Menu */}
        <button
          onClick={() => {
            setRole('customer');
            setActiveTab('menu');
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            role === 'customer' && activeTab === 'menu'
              ? 'text-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              role === 'customer' && activeTab === 'menu'
                ? 'bg-amber-100/80 shadow-xs'
                : 'group-hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              role === 'customer' && activeTab === 'menu' ? 'font-bold text-amber-700' : 'font-medium'
            }`}
          >
            Menu
          </span>
        </button>

        {/* 2. Live Order Tracking */}
        <button
          onClick={() => {
            setActiveTab('track');
            onOpenTracker();
          }}
          className={`relative flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            activeTab === 'track'
              ? 'text-amber-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all relative ${
              activeTab === 'track'
                ? 'bg-amber-100/80 shadow-xs'
                : 'group-hover:bg-slate-100'
            }`}
          >
            <Compass className="w-5 h-5" />
            {activeOrder && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            )}
            {activeOrder && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            )}
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              activeTab === 'track' ? 'font-bold text-amber-700' : 'font-medium'
            }`}
          >
            Orders
          </span>
        </button>

        {/* 3. Floating Counter Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-slate-500 hover:text-amber-600 transition-all cursor-pointer group"
        >
          <div className="p-1.5 rounded-xl transition-all relative group-hover:bg-slate-100">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-[9px] flex items-center justify-center shadow-md">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight group-hover:text-amber-600">
            Cart
          </span>
        </button>

        {/* 4. Settings & Portals Hub (Staff, Rider, Admin, PINs, Profile) */}
        <button
          onClick={onOpenSettingsHub}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            role !== 'customer' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all relative ${
              role !== 'customer'
                ? 'bg-amber-100/80 shadow-xs'
                : 'group-hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            {role !== 'customer' && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              role !== 'customer' ? 'font-bold text-amber-700' : 'font-medium'
            }`}
          >
            {role === 'customer' ? 'Settings' : 'Hub'}
          </span>
        </button>
      </nav>
    </div>
  );
};
