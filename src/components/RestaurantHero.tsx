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
    reviews,
    selectedCategory,
    setSelectedCategory,
    filterVegOnly,
    setFilterVegOnly,
    applyPromoCode,
    appliedPromo,
    addToast
  } = useApp();

  const publishedReviews = reviews.filter((r) => r.status === 'published');
  const reviewCount = publishedReviews.length;
  const avgRating = reviewCount > 0
    ? (publishedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : null;

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
    <section className="relative overflow-hidden mb-5">
      {/* Background Banner with luxury gradient overlay */}
      <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80"
          alt="Coder Cafe Kitchen"
          className="w-full h-full object-cover object-center filter brightness-[0.70] scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/95 via-[#1E1B4B]/40 to-transparent" />

        {/* Cafe Information overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 flex flex-col justify-end">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Gourmet Kitchen Hub
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-300" /> Artisan Roasts & Smashed Burgers
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm">
            CODER CAFE <span className="text-amber-300 font-light text-xs sm:text-lg">| Premium Tech Kitchen</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/90 mt-2">
            {/* Real Rating Button - Dynamically computed from Firestore */}
            <button
              onClick={onOpenReviews}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-bold hover:bg-emerald-500/35 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
              <span>{avgRating ? avgRating : 'New'}</span>
              <span className="text-white/80 font-normal underline ml-0.5">
                {reviewCount > 0 ? `(${reviewCount} review${reviewCount > 1 ? 's' : ''})` : '(Be first to review)'}
              </span>
            </button>

            <div className="flex items-center gap-1 text-white font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>20-30 mins</span>
            </div>

            <div className="flex items-center gap-1 text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>1.2 km • Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promos Strip - Clean, separated modern mobile cards */}
      <div className="mt-3 grid grid-cols-1 gap-2.5">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/60 border border-amber-200/90 text-amber-950 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-slate-950 font-black rounded-xl shadow-sm">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                Use coupon code <span className="font-mono text-amber-700 font-black tracking-wider">TASTY50</span>
              </p>
              <p className="text-slate-600 text-[11px]">Flat 50% discount up to ₹100 on orders ₹199+</p>
            </div>
          </div>
          <button
            onClick={handleApplyBannerPromo}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              appliedPromo === 'TASTY50'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-sm'
            }`}
          >
            {appliedPromo === 'TASTY50' ? 'Applied ✓' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Filter Row: Category pills & Veg Only Toggle */}
      <div className="mt-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Explore Categories
          </h3>
          {/* Veg Only Switch */}
          <button
            type="button"
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer text-xs ${
              filterVegOnly
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {/* Standard Indian Veg Dot */}
            <span className="w-3.5 h-3.5 rounded border border-emerald-600 flex items-center justify-center p-0.5 bg-white">
              <span className={`w-1.5 h-1.5 rounded-full ${filterVegOnly ? 'bg-emerald-600' : 'bg-transparent'}`} />
            </span>
            <span className="font-semibold text-[11px]">Pure Veg Only</span>
          </button>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
