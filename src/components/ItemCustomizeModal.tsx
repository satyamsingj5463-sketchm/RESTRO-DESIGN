import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { MenuItem, CartItem, CustomizationOption } from '../types';
import { useApp } from '../context/AppContext';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({ item, isOpen, onClose }) => {
  const { addToCart } = useApp();

  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CustomizationOption[]>>({});
  const [instructions, setInstructions] = useState('');

  // Pre-select first required option if available
  React.useEffect(() => {
    if (item && item.customizationGroups) {
      const initial: Record<string, CustomizationOption[]> = {};
      item.customizationGroups.forEach((group) => {
        if (group.minSelect > 0 && group.options.length > 0) {
          initial[group.id] = [group.options[0]];
        } else {
          initial[group.id] = [];
        }
      });
      setSelectedOptions(initial);
    }
  }, [item]);

  const handleOptionToggle = (groupId: string, option: CustomizationOption, maxSelect: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      const exists = current.some((o) => o.id === option.id);

      if (maxSelect === 1) {
        // Radio style
        return {
          ...prev,
          [groupId]: [option]
        };
      } else {
        // Checkbox style
        if (exists) {
          return {
            ...prev,
            [groupId]: current.filter((o) => o.id !== option.id)
          };
        } else {
          if (current.length < maxSelect) {
            return {
              ...prev,
              [groupId]: [...current, option]
            };
          }
          return prev;
        }
      }
    });
  };

  // Calculate total price in INR
  const optionsPrice = Object.entries(selectedOptions).reduce((sum, [, opts]) => {
    return sum + opts.reduce((s, opt) => s + opt.price, 0);
  }, 0);

  const totalPrice = (item.price + optionsPrice) * quantity;

  const handleAddToCart = () => {
    const flattenedOptions: CartItem['selectedOptions'] = [];
    if (item.customizationGroups) {
      item.customizationGroups.forEach((group) => {
        const chosen = selectedOptions[group.id] || [];
        chosen.forEach((opt) => {
          flattenedOptions.push({
            groupTitle: group.title,
            optionName: opt.name,
            price: opt.price
          });
        });
      });
    }

    addToCart(item, quantity, flattenedOptions, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[88vh] sm:max-h-[90vh] flex flex-col bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden z-20 shrink-0" />

        {/* Header Image */}
        <div className="relative h-44 sm:h-52 w-full shrink-0 bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3.5 h-3.5 rounded-[4px] flex items-center justify-center border bg-white ${
                  item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              </span>
              <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">{item.name}</h3>
            <p className="text-xs text-slate-200 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {item.customizationGroups && item.customizationGroups.length > 0 ? (
            item.customizationGroups.map((group) => {
              const currentSelected = selectedOptions[group.id] || [];
              const isRadio = group.maxSelect === 1;

              return (
                <div key={group.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm text-slate-900">{group.title}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isRadio ? 'Choose 1' : `Choose up to ${group.maxSelect}`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = currentSelected.some((o) => o.id === option.id);
                      return (
                        <div
                          key={option.id}
                          onClick={() => handleOptionToggle(group.id, option, group.maxSelect)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 text-slate-900 ring-1 ring-amber-400/30'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isRadio ? 'rounded-full' : 'rounded'
                              } ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold'
                                  : 'border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="font-medium text-slate-900">{option.name}</span>
                          </div>
                          <span className="font-mono text-slate-900 font-bold">
                            {option.price > 0 ? `+₹${option.price}` : 'Included'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Crafted fresh to order with pure culinary precision. Ready in ~{item.prepTimeMinutes} mins.</span>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Cooking & Packaging Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra mint dip, less spicy, no cutlery needed..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
            />
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-200 disabled:opacity-40 text-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-sm text-slate-900 px-1">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="font-mono font-black text-base">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
