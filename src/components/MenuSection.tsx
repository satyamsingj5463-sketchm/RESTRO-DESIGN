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
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize tracking-tight font-sans">
            {selectedCategory === 'all'
              ? 'Featured Culinary Selection'
              : `${selectedCategory.replace('_', ' ')}`}
          </h2>
          <p className="text-xs text-slate-500">
            {filteredItems.length} freshly prepared dishes crafted with organic ingredients
          </p>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <SearchX className="w-10 h-10 text-slate-400 mx-auto mb-2.5" />
          <h3 className="text-base font-bold text-slate-800">No dishes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords or toggle off the Pure Veg filter to browse the full menu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const hasCustomizations = item.customizationGroups && item.customizationGroups.length > 0;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col rounded-3xl bg-white border transition-all duration-300 overflow-hidden shadow-xs ${
                  item.isAvailable
                    ? 'border-slate-200/90 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                {/* Dish Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      !item.isAvailable ? 'grayscale' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/15" />

                  {/* Authentic Indian Veg / Non-Veg Indicator */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      title={item.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center border-1.5 shadow-md bg-white ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </span>
                    {item.isBestseller && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Bestseller
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
                        <Flame className="w-2.5 h-2.5" /> Spicy
                      </span>
                    )}
                  </div>

                  {/* Out of stock badge */}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg">
                        <AlertCircle className="w-3.5 h-3.5" /> Sold Out For Today
                      </span>
                    </div>
                  )}

                  {/* Prep time badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{item.prepTimeMinutes} mins</span>
                  </div>
                </div>

                {/* Dish Details */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-700 transition-colors tracking-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 shrink-0 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart button in INR */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-base sm:text-lg font-black text-slate-950">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={!item.isAvailable}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs ${
                        item.isAvailable
                          ? 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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
