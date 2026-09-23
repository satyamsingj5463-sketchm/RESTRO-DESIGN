import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Lock,
  ArrowRight,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const {
    cart,
    cartSubtotal,
    promoDiscount,
    appliedPromo,
    tipAmount,
    currentAddress,
    deliverySchedule,
    setDeliverySchedule,
    createOrder
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['payment']['method']>('gpay');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8820');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Exact INR Calculation
  const deliveryFee = cartSubtotal >= 399 ? 0 : 35;
  const platformFee = 5.00;
  const taxableAmount = Math.max(0, cartSubtotal - promoDiscount);
  const gstTax = Math.round(taxableAmount * 0.05 * 100) / 100;
  const total = Math.max(0, Math.round((taxableAmount + deliveryFee + platformFee + gstTax + tipAmount) * 100) / 100);

  const handlePayAndOrder = async () => {
    setIsProcessing(true);

    // Simulate PCI DSS payment processing
    setTimeout(async () => {
      try {
        const newOrder = await createOrder(paymentMethod);
        setIsProcessing(false);

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }

        onClose();
        onOrderSuccess(newOrder);
      } catch (err) {
        setIsProcessing(false);
        console.error('Order checkout error:', err);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#0D131F] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-2xl border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">Secure Payment Checkout</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RBI & PCI-DSS 256-Bit SSL Encrypted Gateway</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Delivery Destination & Schedule Box */}
          <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Delivering to {currentAddress.label}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {currentAddress.addressLine1}, {currentAddress.city} {currentAddress.postalCode}
                  </p>
                  {currentAddress.instructions && (
                    <p className="text-[11px] text-amber-400/90 mt-1">
                      Drop-off note: {currentAddress.instructions}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-300 rounded-md border border-emerald-500/30">
                Express Zone
              </span>
            </div>

            {/* Delivery Timing Options */}
            <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Delivery Window:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliverySchedule('immediate')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    deliverySchedule === 'immediate'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Express Delivery (20-30 min)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySchedule('Scheduled for Dinner')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    deliverySchedule !== 'immediate'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Pay */}
              <div
                onClick={() => setPaymentMethod('gpay')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'gpay'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#080C14] border-white/[0.08] hover:border-white/[0.16] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-bold text-slate-900 text-sm shadow-sm">
                    G
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Google Pay UPI</span>
                      <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                        Instant
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">One-Tap UPI Authentication</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'gpay' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'gpay' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>

              {/* UPI QR */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#080C14] border-white/[0.08] hover:border-white/[0.16] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">UPI App / QR Code</div>
                    <span className="text-[10px] text-slate-400">PhonePe, Paytm, CRED</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#080C14] border-white/[0.08] hover:border-white/[0.16] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Credit & Debit Card</div>
                    <span className="text-[10px] text-slate-400">RuPay, Visa, Mastercard</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-[#080C14] border-white/[0.08] hover:border-white/[0.16] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Cash on Delivery</div>
                    <span className="text-[10px] text-slate-400">Pay cash or scan UPI at door</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                  }`}
                >
                  {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>
            </div>

            {/* Credit Card Input Sub-form when 'card' is selected */}
            {paymentMethod === 'card' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-2.5 animate-fade-in text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E1524] border border-white/[0.1] rounded-xl font-mono text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0E1524] border border-white/[0.1] rounded-xl font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV / Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0E1524] border border-white/[0.1] rounded-xl font-mono text-white text-xs tracking-widest"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown in INR */}
          <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Total ({cart.length} dishes)</span>
              <span className="font-mono text-slate-200">₹{cartSubtotal.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Coupon Applied ({appliedPromo})</span>
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
              <span>Platform Fee</span>
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
            <div className="pt-2 border-t border-white/[0.1] flex justify-between text-sm font-extrabold text-white">
              <span>Final Amount to Pay</span>
              <span className="font-mono text-base text-amber-400 font-black">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#080C14] border-t border-white/[0.08]">
          <button
            onClick={handlePayAndOrder}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-75 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment via {paymentMethod.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <span>Pay & Place Order</span>
                <span className="font-mono text-base">(₹{total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
