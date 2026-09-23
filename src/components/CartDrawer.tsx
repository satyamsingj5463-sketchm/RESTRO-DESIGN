import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShoppingBag,
  ArrowRight,
  HeartHandshake,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    tipAmount,
    setTipAmount
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Indian standard pricing logic: Free delivery over ₹399, ₹35 standard, ₹5 platform fee, 5% GST
  const deliveryFee = cartSubtotal >= 399 ? 0 : 35;
  const platformFee = 5.00;
  const taxableAmount = Math.max(0, cartSubtotal - promoDiscount);
  const gstTax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const grandTotal = Math.max(0, Math.round((taxableAmount + deliveryFee + platformFee + gstTax + tipAmount) * 100) / 100);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    const res = applyPromoCode(code);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#0C111D] border-l border-white/[0.1] h-full flex flex-col shadow-2xl text-slate-100">
        {/* Top Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Your Cart</h3>
              <p className="text-xs text-slate-400">
                {cartTotalCount} {cartTotalCount === 1 ? 'dish' : 'dishes'} in order basket
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                title="Clear all dishes"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Goal Meter */}
        {cart.length > 0 && (
          <div className="px-4 py-2.5 bg-[#090E18] border-b border-white/[0.06] text-xs">
            {cartSubtotal >= 399 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>You unlocked <strong>FREE Delivery</strong> on this order!</span>
              </span>
            ) : (
              <div className="flex items-center justify-between text-slate-300">
                <span>Add <strong>₹{(399 - cartSubtotal).toFixed(0)}</strong> more for <strong>FREE Delivery</strong></span>
                <span className="text-[10px] text-amber-400 font-bold">Goal: ₹399</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Your cart is empty</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Add some of our bestselling gourmet burgers, wood-fired pizzas, or cold brew coffee!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {cart.map((ci) => (
                <div
                  key={ci.cartItemId}
                  className="p-3.5 rounded-2xl bg-[#090E18] border border-white/[0.08] flex items-start gap-3 text-xs"
                >
                  <img
                    src={ci.menuItem.image}
                    alt={ci.menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white truncate">{ci.menuItem.name}</h4>
                      <button
                        onClick={() => removeFromCart(ci.cartItemId)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ci.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-amber-400/90 truncate mt-0.5">
                        {ci.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}

                    {ci.specialInstructions && (
                      <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                        "{ci.specialInstructions}"
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-xs">
                        ₹{ci.itemTotalPrice.toFixed(2)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 bg-[#0E1524] border border-white/[0.1] rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(ci.cartItemId, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1 text-white">{ci.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(ci.cartItemId, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Offers & Promo Coupons</span>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>
                      <strong className="font-mono font-bold">{appliedPromo}</strong> applied (-₹{promoDiscount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-[11px] text-rose-400 hover:underline font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(null);
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-[#0E1524] border border-white/[0.1] rounded-xl text-xs uppercase font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleApplyPromo()}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                    </p>
                  )}
                  {/* Quick promo coupons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleApplyPromo('TASTY50')}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer font-mono font-bold"
                    >
                      TASTY50 (50% OFF)
                    </button>
                    <button
                      onClick={() => handleApplyPromo('FREEDEL')}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] cursor-pointer font-mono"
                    >
                      FREEDEL (Free ₹35 Del)
                    </button>
                    <button
                      onClick={() => handleApplyPromo('FEAST20')}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] cursor-pointer font-mono"
                    >
                      FEAST20 (20% OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rider Tip Selector in INR */}
            <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  <span>Tip your Delivery Partner</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% goes to rider</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[0, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 rounded-xl font-bold font-mono transition-colors cursor-pointer ${
                      tipAmount === amount
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-[#0E1524] border border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
                    }`}
                  >
                    {amount === 0 ? 'None' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary in INR */}
            <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Item Subtotal</span>
                <span className="font-mono text-slate-200">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-₹{promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Delivery Partner Fee</span>
                <span className="font-mono text-slate-200">
                  {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform Convenience Fee</span>
                <span className="font-mono text-slate-200">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Restaurant GST (5%)</span>
                <span className="font-mono text-slate-200">₹{gstTax.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Partner Tip</span>
                  <span className="font-mono text-slate-200">₹{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2.5 border-t border-white/[0.1] flex justify-between text-sm font-extrabold text-white">
                <span>To Pay (Grand Total)</span>
                <span className="font-mono text-base text-amber-400 font-black">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-[#080C14] border-t border-white/[0.08]">
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-between cursor-pointer active:scale-[0.98]"
            >
              <span>Proceed to Payment</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base">₹{grandTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
