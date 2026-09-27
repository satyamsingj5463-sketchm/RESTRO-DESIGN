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
  Loader2,
  Eye,
  EyeOff
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
  const [cardCvc, setCardCvc] = useState('884');
  const [showCvc, setShowCvc] = useState(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-indigo-950/20 flex items-center justify-between bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">Secure Payment Checkout</h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>RBI & PCI-DSS 256-Bit SSL Encrypted Gateway</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* Delivery Destination & Schedule Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Delivering to {currentAddress.label}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {currentAddress.addressLine1}, {currentAddress.city} {currentAddress.postalCode}
                  </p>
                  {currentAddress.instructions && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      Drop-off note: {currentAddress.instructions}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                Express Zone
              </span>
            </div>

            {/* Delivery Timing Options */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Delivery Window:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDeliverySchedule('immediate')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    deliverySchedule === 'immediate'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Express (20-30 min)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySchedule('Scheduled for Dinner')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    deliverySchedule !== 'immediate'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Select Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Pay */}
              <div
                onClick={() => setPaymentMethod('gpay')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'gpay'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                    G
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Google Pay UPI</span>
                      <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 rounded font-mono font-bold">
                        Instant
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">One-Tap UPI Authentication</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'gpay' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'gpay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* UPI QR */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">UPI App / QR Code</div>
                    <span className="text-[10px] text-slate-500">PhonePe, Paytm, CRED</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'card'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Credit & Debit Card</div>
                    <span className="text-[10px] text-slate-500">RuPay, Visa, Mastercard</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Cash on Delivery</div>
                    <span className="text-[10px] text-slate-500">Pay cash or scan UPI at door</span>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}
                >
                  {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Credit Card Input Sub-form when 'card' is selected */}
            {paymentMethod === 'card' && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 animate-fade-in text-xs shadow-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV / Security Code</label>
                    <div className="relative">
                      <input
                        type={showCvc ? 'text' : 'password'}
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvc(!showCvc)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title={showCvc ? 'Hide CVV' : 'Show CVV'}
                      >
                        {showCvc ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown in INR */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cart.length} dishes)</span>
              <span className="font-mono text-slate-900 font-semibold">₹{cartSubtotal.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Applied ({appliedPromo})</span>
                <span className="font-mono">-₹{promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Partner Fee</span>
              <span className="font-mono text-slate-900">
                {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
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
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Final Amount to Pay</span>
              <span className="font-mono text-base text-amber-700 font-black">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-white border-t border-slate-200">
          <button
            onClick={handlePayAndOrder}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-75 text-slate-950 font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment via {paymentMethod.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <span>Pay & Place Order</span>
                <span className="font-mono text-base font-black">(₹{total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
