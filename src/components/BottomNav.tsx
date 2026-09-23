import React from 'react';
import { Utensils, Compass, ChefHat, Shield, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  onOpenProfile: () => void;
  onOpenTracker: () => void;
  onOpenCart: () => void;
  activeTab: 'menu' | 'track';
  setActiveTab: (tab: 'menu' | 'track') => void;
  onOpenPinModal: (role: 'staff' | 'admin') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenProfile,
  onOpenTracker,
  onOpenCart,
  activeTab,
  setActiveTab,
  onOpenPinModal
}) => {
  const {
    role,
    setRole,
    staffAuthenticated,
    adminAuthenticated,
    cartTotalCount,
    cartSubtotal,
    orders
  } = useApp();

  const activeOrder = orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0A0E17]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-safe transition-all">
      {/* Native App Floating Quick Cart Bar */}
      {cartTotalCount > 0 && role === 'customer' && activeTab === 'menu' && (
        <div className="px-3 pt-2 pb-1.5 animate-slide-up">
          <button
            onClick={onOpenCart}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-2xl text-xs shadow-xl shadow-amber-500/25 flex items-center justify-between transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 text-[11px] flex items-center justify-center font-mono font-black">
                {cartTotalCount}
              </span>
              <span className="font-extrabold tracking-tight">View Cart & Proceed</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black">
              <span>₹{cartSubtotal.toFixed(0)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto" aria-label="Bottom Navigation">
        {/* 1. Explore Menu */}
        <button
          onClick={() => {
            setRole('customer');
            setActiveTab('menu');
          }}
          className={`relative flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            role === 'customer' && activeTab === 'menu'
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              role === 'customer' && activeTab === 'menu'
                ? 'bg-amber-500/15 shadow-sm shadow-amber-500/20'
                : 'group-hover:bg-white/5'
            }`}
          >
            <Utensils className="w-5 h-5" />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${role === 'customer' && activeTab === 'menu' ? 'font-bold text-amber-400' : 'font-medium'}`}>
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
              ? 'text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all relative ${
              activeTab === 'track'
                ? 'bg-amber-500/15 shadow-sm shadow-amber-500/20'
                : 'group-hover:bg-white/5'
            }`}
          >
            <Compass className="w-5 h-5" />
            {activeOrder && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            )}
            {activeOrder && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'track' ? 'font-bold text-amber-400' : 'font-medium'}`}>
            Orders
          </span>
        </button>

        {/* 3. Kitchen Staff Portal */}
        <button
          onClick={() => {
            if (staffAuthenticated) {
              setRole('staff');
            } else {
              onOpenPinModal('staff');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            role === 'staff' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              role === 'staff'
                ? 'bg-amber-500/15 shadow-sm shadow-amber-500/20'
                : 'group-hover:bg-white/5'
            }`}
          >
            <ChefHat className="w-5 h-5" />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${role === 'staff' ? 'font-bold text-amber-400' : 'font-medium'}`}>
            Kitchen
          </span>
        </button>

        {/* 4. Admin Management */}
        <button
          onClick={() => {
            if (adminAuthenticated) {
              setRole('admin');
            } else {
              onOpenPinModal('admin');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer group ${
            role === 'admin' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              role === 'admin'
                ? 'bg-purple-500/20 shadow-sm shadow-purple-500/20'
                : 'group-hover:bg-white/5'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${role === 'admin' ? 'font-bold text-purple-400' : 'font-medium'}`}>
            Admin
          </span>
        </button>

        {/* 5. Account & Profile */}
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition-all cursor-pointer group"
        >
          <div className="p-1.5 rounded-xl transition-all group-hover:bg-white/5">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">
            Profile
          </span>
        </button>
      </nav>
    </div>
  );
};
