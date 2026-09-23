import React, { useState } from 'react';
import {
  Plus,
  Star,
  Flame,
  Clock,
  Sparkles,
  SearchX,
  AlertCircle
} from 'lucide-react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';
import { ItemCustomizeModal } from './ItemCustomizeModal';

export const MenuSection: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    searchQuery,
    filterVegOnly,
    addToCart
  } = useApp();

  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Veg only
    if (filterVegOnly && !item.isVeg) {
      return false;
    }
    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags ? item.tags.some((t) => t.toLowerCase().includes(q)) : false;
      if (!matchName && !matchDesc && !matchTags) {
        return false;
      }
    }
    return true;
  });

  const handleItemClick = (item: MenuItem) => {
    if (!item.isAvailable) return;
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setCustomizingItem(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <div className="mb-20">
      {/* Category Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white capitalize tracking-tight font-sans">
            {selectedCategory === 'all'
              ? 'Featured Culinary Selection'
              : `${selectedCategory.replace('_', ' ')}`}
          </h2>
          <p className="text-xs text-slate-400">
            {filteredItems.length} freshly prepared dishes crafted with organic, local ingredients
          </p>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0E1422]/60 rounded-3xl border border-dashed border-white/[0.1]">
          <SearchX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No dishes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords or toggle off the Veg Only filter to browse our full menu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const hasCustomizations = item.customizationGroups && item.customizationGroups.length > 0;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col rounded-3xl bg-[#0D131F] border transition-all duration-300 overflow-hidden ${
                  item.isAvailable
                    ? 'border-white/[0.08] hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-0.5'
                    : 'border-white/[0.05] opacity-60'
                }`}
              >
                {/* Dish Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-[#070A10]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      !item.isAvailable ? 'grayscale' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-transparent to-black/25" />

                  {/* Authentic Indian Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      title={item.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center border-1.5 shadow-md bg-black/60 backdrop-blur-sm ${
                        item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </span>
                    {item.isBestseller && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> Bestseller
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-md">
                        <Flame className="w-2.5 h-2.5" /> Spicy
                      </span>
                    )}
                  </div>

                  {/* Out of stock badge */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-rose-600/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg">
                        <AlertCircle className="w-3.5 h-3.5" /> Sold Out For Today
                      </span>
                    </div>
                  )}

                  {/* Prep time badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-[#070A10]/90 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-1 border border-white/[0.1]">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.prepTimeMinutes} mins</span>
                  </div>
                </div>

                {/* Dish Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors tracking-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0 bg-[#070A10] px-2 py-0.5 rounded-lg border border-white/[0.08]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 bg-white/[0.04] text-slate-400 rounded-md border border-white/[0.06]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart button in INR */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-lg font-black text-white">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={!item.isAvailable}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        item.isAvailable
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-white/5 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{hasCustomizations ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Customization Modal */}
      <ItemCustomizeModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
      />
    </div>
  );
};
