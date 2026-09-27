import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Bike,
  CheckCircle2,
  ChefHat,
  Package,
  Phone,
  MessageSquare,
  FileText,
  Star,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useApp } from '../context/AppContext';
import { OrderChatModal } from './OrderChatModal';

interface LiveOrderTrackerProps {
  order: Order | null;
  onOpenInvoice: (order: Order) => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ order, onOpenInvoice }) => {
  const { updateRiderLocation, updateOrderStatus, rateOrder, addToast } = useApp();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ratingFood, setRatingFood] = useState(5);
  const [ratingDelivery, setRatingDelivery] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Auto-simulate rider movement if status is 'out_for_delivery'
  useEffect(() => {
    if (!order || order.status !== 'out_for_delivery') return;

    const interval = setInterval(() => {
      const currentPct = order.rider?.currentLocation.progressPct || 25;
      if (currentPct < 98) {
        const nextPct = Math.min(98, currentPct + 2.5);
        updateRiderLocation(order.id, nextPct);
      } else if (currentPct >= 98 && order.status !== 'delivered') {
        updateOrderStatus(order.id, 'delivered');
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.id, order?.status, order?.rider?.currentLocation.progressPct]);

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm my-4">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
          <Package className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">No Active Order</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Explore our artisan cafe menu, customize items, and place an order to track live delivery in real time.
        </p>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      sub: 'Received by Kitchen',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      status: 'preparing',
      label: 'Cooking',
      sub: 'Chef preparing fresh',
      icon: <ChefHat className="w-4 h-4" />
    },
    {
      status: 'ready',
      label: 'Packed',
      sub: 'Insulated packaging',
      icon: <Package className="w-4 h-4" />
    },
    {
      status: 'out_for_delivery',
      label: 'On the Way',
      sub: `With ${order.rider?.name || 'Rider Alex'}`,
      icon: <Bike className="w-4 h-4" />
    },
    {
      status: 'delivered',
      label: 'Delivered',
      sub: 'Handed to customer',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  const statusOrderIndex: Record<OrderStatus, number> = {
    placed: 0,
    preparing: 1,
    ready: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -1
  };

  const currentStepIdx = statusOrderIndex[order.status] ?? 0;
  const progressPct = order.rider?.currentLocation.progressPct || (currentStepIdx * 25);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    await rateOrder(order.id, ratingFood, ratingDelivery, reviewComment);
    setIsSubmittingRating(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-md my-4">
      {/* Top Banner with ETA & Status */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1E1B4B] via-[#2D2875] to-[#1E1B4B] text-white flex flex-wrap items-center justify-between gap-3 border-b border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-bold rounded-2xl shadow-md shadow-amber-500/20">
            <Bike className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-300 font-extrabold tracking-wider">#{order.orderNumber}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-slate-200 font-mono font-semibold border border-white/20">
                {order.payment.method.toUpperCase()}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5 leading-snug">
              {order.status === 'delivered'
                ? 'Order Delivered! Enjoy your meal 🍔'
                : order.status === 'out_for_delivery'
                ? `Arriving in ~${order.rider?.estimatedMinutes || 12} mins`
                : order.status === 'ready'
                ? 'Ready for pickup & Rider assignment'
                : 'Coder Cafe is preparing your food'}
            </h2>
          </div>
        </div>

        {/* Invoice & Chat buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenInvoice(order)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Invoice</span>
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Live</span>
          </button>
        </div>
      </div>

      {/* Interactive Delivery GPS Map Simulation Canvas */}
      <div className="relative h-60 sm:h-72 w-full bg-[#182032] border-b border-slate-200 overflow-hidden select-none">
        {/* Styled Street Grid Map Graphic (SVG) */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Map Base */}
          <rect width="800" height="400" fill="#1b253b" />
          
          {/* City blocks & parks */}
          <rect x="40" y="40" width="180" height="110" rx="10" fill="#24314c" stroke="#334155" strokeWidth="2" />
          <rect x="260" y="40" width="220" height="110" rx="10" fill="#24314c" stroke="#334155" strokeWidth="2" />
          <rect x="520" y="40" width="240" height="110" rx="10" fill="#065f46" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
          
          <rect x="40" y="190" width="180" height="170" rx="10" fill="#24314c" stroke="#334155" strokeWidth="2" />
          <rect x="260" y="190" width="220" height="170" rx="10" fill="#24314c" stroke="#334155" strokeWidth="2" />
          <rect x="520" y="190" width="240" height="170" rx="10" fill="#24314c" stroke="#334155" strokeWidth="2" />

          {/* Road Network Lines */}
          <line x1="0" y1="165" x2="800" y2="165" stroke="#3b4d6b" strokeWidth="26" />
          <line x1="0" y1="165" x2="800" y2="165" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />

          <line x1="240" y1="0" x2="240" y2="400" stroke="#3b4d6b" strokeWidth="22" />
          <line x1="500" y1="0" x2="500" y2="400" stroke="#3b4d6b" strokeWidth="22" />

          {/* Planned Delivery Polyline Path from Coder Cafe (120, 165) to Delivery Address (680, 240) */}
          <path
            d="M 120 165 L 500 165 L 500 240 L 680 240"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
          />

          {/* Coder Cafe Flagship Marker at (120, 165) */}
          <circle cx="120" cy="165" r="20" fill="#f59e0b" fillOpacity="0.25" />
          <circle cx="120" cy="165" r="12" fill="#f59e0b" />
          <text x="120" y="140" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="monospace">
            CODER CAFE (HUB)
          </text>

          {/* Customer Destination Marker at (680, 240) */}
          <circle cx="680" cy="240" r="20" fill="#10b981" fillOpacity="0.25" />
          <circle cx="680" cy="240" r="12" fill="#10b981" />
          <text x="680" y="275" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {order.customer.address.label.toUpperCase()} DESTINATION
          </text>
        </svg>

        {/* Dynamic Animated Delivery Scooter */}
        {order.status === 'out_for_delivery' && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20 pointer-events-none"
            style={{
              left: `${15 + (progressPct * 0.7)}%`,
              top: `${progressPct < 55 ? 42 : 60}%`
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-white animate-bounce">
                <Bike className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-400/40 whitespace-nowrap shadow-md">
                Alex (24 km/h)
              </div>
            </div>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 z-10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-slate-100 text-[11px] font-semibold">Live GPS Tracking</span>
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700 text-[11px] text-slate-200 flex items-center gap-1.5 z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Geofenced Corridor</span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
          {/* Progress connector line */}
          <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-slate-200 -z-0 rounded-full">
            <div
              className="h-full bg-amber-500 transition-all duration-700 rounded-full"
              style={{ width: `${Math.min(100, currentStepIdx * 25)}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.status} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/25 font-bold scale-110 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-1.5 text-[10px] sm:text-xs font-bold truncate max-w-full ${
                    isCurrent ? 'text-amber-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 hidden sm:inline truncate max-w-full">
                  {step.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rider Card & Contact */}
      {order.rider && (
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AC
              </div>
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-400 text-slate-950 font-black text-[9px] rounded font-mono shadow-xs">
                {order.rider.rating} ★
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">{order.rider.name}</h4>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-mono font-medium border border-slate-200">
                  {order.rider.plateNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{order.rider.vehicle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${order.rider.phone}`}
              onClick={(e) => {
                e.preventDefault();
                addToast('Calling Rider Alex...', `Dialing ${order.rider?.phone} on secure channel`, 'info');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-slate-200 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Rider</span>
            </a>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors flex items-center gap-1.5 text-xs font-bold border border-amber-300 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      )}

      {/* Order Items Review Strip */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Order Summary ({order.items.length} items)
        </h4>
        <div className="space-y-1.5">
          {order.items.map((it) => (
            <div key={it.cartItemId} className="flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-600 font-bold">{it.quantity}x</span>
                <span className="font-medium text-slate-900">{it.menuItem.name}</span>
                {it.selectedOptions.length > 0 && (
                  <span className="text-slate-500 text-[10px]">
                    ({it.selectedOptions.map((o) => o.optionName).join(', ')})
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-900 font-bold">₹{it.itemTotalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Total Billed ({order.payment.method.toUpperCase()})</span>
          <span className="font-mono text-sm font-black text-amber-700">₹{order.pricing.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivered State: Customer Rating & Feedback Submission */}
      {order.status === 'delivered' && !order.ratings && (
        <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/60 to-white animate-fade-in border-t border-amber-100">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-0.5">How was your Coder Cafe experience?</h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Rate your food taste & rider delivery promptness. Your rating syncs directly to Firestore!
            </p>

            <form onSubmit={handleRatingSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Food Quality & Taste
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingFood(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= ratingFood
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 ml-2 font-mono">
                    {ratingFood}/5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Delivery Speed & Rider Service
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingDelivery(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= ratingDelivery
                            ? 'fill-sky-500 text-sky-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-sky-700 ml-2 font-mono">
                    {ratingDelivery}/5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Written Feedback (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Loved the hotfix espresso and fresh brioche burger..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                Submit Feedback to Restaurant
              </button>
            </form>
          </div>
        </div>
      )}

      {/* In-app live chat modal */}
      <OrderChatModal
        order={order}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
