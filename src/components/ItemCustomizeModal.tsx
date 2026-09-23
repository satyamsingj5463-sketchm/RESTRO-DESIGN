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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0D131F] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header Image */}
        <div className="relative h-44 sm:h-52 w-full shrink-0 bg-[#070A10]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-[#0D131F]/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3.5 h-3.5 rounded-[4px] flex items-center justify-center border bg-black/70 ${
                  item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">{item.name}</h3>
            <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {item.customizationGroups && item.customizationGroups.length > 0 ? (
            item.customizationGroups.map((group) => {
              const currentSelected = selectedOptions[group.id] || [];
              const isRadio = group.maxSelect === 1;

              return (
                <div key={group.id} className="p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-100">{group.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">
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
                              ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                              : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.14] text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isRadio ? 'rounded-full' : 'rounded'
                              } ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-500 text-slate-950'
                                  : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <span className="font-mono text-slate-300 font-bold">
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
            <div className="p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.08] text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Crafted fresh to order with pure culinary precision. Ready in ~{item.prepTimeMinutes} mins.</span>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Cooking & Packaging Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra mint dip, less spicy, no cutlery needed..."
              className="w-full px-3 py-2 bg-[#080C14] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none font-sans"
            />
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 bg-[#080C14] border-t border-white/[0.08] flex items-center justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.14] disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-sm text-white px-1">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="font-mono font-black">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
