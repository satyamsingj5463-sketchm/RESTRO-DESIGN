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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#F8FAFC] border-l border-slate-200 h-full flex flex-col shadow-2xl text-slate-900">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Your Cart</h3>
              <p className="text-xs text-slate-500">
                {cartTotalCount} {cartTotalCount === 1 ? 'dish' : 'dishes'} in order basket
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer font-medium"
                title="Clear all dishes"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Goal Meter */}
        {cart.length > 0 && (
          <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/60 text-xs">
            {cartSubtotal >= 399 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>You unlocked <strong>FREE Delivery</strong> on this order!</span>
              </span>
            ) : (
              <div className="flex items-center justify-between text-slate-700">
                <span>Add <strong>₹{(399 - cartSubtotal).toFixed(0)}</strong> more for <strong>FREE Delivery</strong></span>
                <span className="text-[10px] text-amber-700 font-bold font-mono">Goal: ₹399</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h4>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              Add some of our bestselling gourmet burgers, wood-fired pizzas, or cold brew coffee!
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs transition-colors cursor-pointer shadow-md"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Items */}
            <div className="space-y-2.5">
              {cart.map((ci) => (
                <div
                  key={ci.cartItemId}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 text-xs shadow-xs"
                >
                  <img
                    src={ci.menuItem.image}
                    alt={ci.menuItem.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 truncate">{ci.menuItem.name}</h4>
                      <button
                        onClick={() => removeFromCart(ci.cartItemId)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ci.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-amber-700 font-medium truncate mt-0.5">
                        {ci.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}

                    {ci.specialInstructions && (
                      <p className="text-[10px] text-slate-500 italic truncate mt-0.5">
                        "{ci.specialInstructions}"
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-950 text-xs">
                        ₹{ci.itemTotalPrice.toFixed(2)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(ci.cartItemId, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 cursor-pointer shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1 text-slate-900">{ci.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(ci.cartItemId, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-slate-200 text-slate-700 cursor-pointer shadow-xs"
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
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">Offers & Promo Coupons</span>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>
                      <strong className="font-mono font-bold">{appliedPromo}</strong> applied (-₹{promoDiscount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
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
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleApplyPromo()}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                    </p>
                  )}
                  {/* Quick promo coupons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => handleApplyPromo('TASTY50')}
                      className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer font-mono font-bold"
                    >
                      TASTY50 (50% OFF)
                    </button>
                    <button
                      onClick={() => handleApplyPromo('FREEDEL')}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer font-mono"
                    >
                      FREEDEL (Free Del)
                    </button>
                    <button
                      onClick={() => handleApplyPromo('FEAST20')}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer font-mono"
                    >
                      FEAST20 (20% OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rider Tip Selector in INR */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  <span>Tip your Delivery Partner</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">100% goes to rider</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[0, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 rounded-xl font-bold font-mono transition-colors cursor-pointer ${
                      tipAmount === amount
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {amount === 0 ? 'None' : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary in INR */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-₹{promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Partner Fee</span>
                <span className="font-mono text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Convenience Fee</span>
                <span className="font-mono text-slate-900">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Restaurant GST (5%)</span>
                <span className="font-mono text-slate-900">₹{gstTax.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Partner Tip</span>
                  <span className="font-mono text-slate-900">₹{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-950">
                <span>To Pay (Grand Total)</span>
                <span className="font-mono text-base text-amber-700 font-black">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-3.5 bg-white border-t border-slate-200">
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all flex items-center justify-between cursor-pointer active:scale-[0.98]"
            >
              <span>Proceed to Payment</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base">₹{grandTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
