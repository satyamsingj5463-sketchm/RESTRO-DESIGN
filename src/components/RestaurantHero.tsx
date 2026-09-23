import React from 'react';
import {
  Star,
  Clock,
  MapPin,
  Tag,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RestaurantHeroProps {
  onOpenReviews: () => void;
}

export const RestaurantHero: React.FC<RestaurantHeroProps> = ({ onOpenReviews }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    filterVegOnly,
    setFilterVegOnly,
    applyPromoCode,
    appliedPromo,
    addToast
  } = useApp();

  const categories = [
    { id: 'all', label: 'All Items', icon: '✨' },
    { id: 'coffee', label: 'Artisan Coffee', icon: '☕' },
    { id: 'burgers', label: 'Gourmet Burgers', icon: '🍔' },
    { id: 'pizza', label: 'Wood-Fired Pizza', icon: '🍕' },
    { id: 'sides', label: 'Crispy Sides', icon: '🍟' },
    { id: 'desserts', label: 'Desserts & Lava', icon: '🍰' },
    { id: 'combos', label: 'Feast Combos', icon: '🍱' }
  ];

  const handleApplyBannerPromo = () => {
    const res = applyPromoCode('TASTY50');
    if (res.success) {
      addToast('Coupon Applied', 'Code TASTY50 unlocked 50% discount up to ₹100!', 'success');
    } else {
      addToast('Promo Coupon', res.message, 'info');
    }
  };

  return (
    <section className="relative overflow-hidden mb-6">
      {/* Background Banner with premium gradient overlay */}
      <div className="relative h-48 sm:h-60 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08]">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
          alt="Coder Cafe Kitchen"
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/75 to-transparent" />

        {/* Cafe Information overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20">
              <Sparkles className="w-3 h-3" /> Gourmet Kitchen Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] text-slate-200 text-[11px] font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Artisan Roasts & Smashed Burgers
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            CODER CAFE <span className="text-amber-400 font-light text-base sm:text-2xl">| Premium Tech Kitchen</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-300 mt-2.5">
            <button
              onClick={onOpenReviews}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>4.9</span>
              <span className="text-slate-400 font-normal underline">(1,240+ reviews)</span>
            </button>

            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>20-30 mins</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>1.2 km • Express Corridor</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Free delivery on orders ₹399+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promos Strip */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 text-amber-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                Use code <span className="font-mono text-amber-300 font-black tracking-wider">TASTY50</span>
              </p>
              <p className="text-slate-400 text-[11px]">Flat 50% discount up to ₹100 on orders ₹199+</p>
            </div>
          </div>
          <button
            onClick={handleApplyBannerPromo}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              appliedPromo === 'TASTY50'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            }`}
          >
            {appliedPromo === 'TASTY50' ? 'Applied ✓' : 'Apply 50%'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0D131F] border border-white/[0.08] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Live GPS Delivery Tracking</p>
              <p className="text-slate-400 text-[11px]">Real-time rider telemetry, direct in-app chat & UPI payments</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Active Hub
          </span>
        </div>
      </div>

      {/* Filter Row: Category pills & Veg Only Toggle */}
      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-[#0E1422] hover:bg-[#141C2E] text-slate-300 border border-white/[0.06]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Veg Only Switch */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs ${
              filterVegOnly
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                : 'bg-[#0E1422] border-white/[0.08] text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Standard Indian Veg Dot */}
            <span className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center p-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${filterVegOnly ? 'bg-emerald-400' : 'bg-transparent'}`} />
            </span>
            <span className="font-bold">Pure Veg Only</span>
          </button>
        </div>
      </div>
    </section>
  );
};
