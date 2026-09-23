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
      <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
        <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-200">No Active Order</h3>
        <p className="text-xs text-slate-400 mt-1">Place an order from the menu to track live GPS delivery.</p>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      sub: 'Received by Coder Cafe',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      status: 'preparing',
      label: 'Kitchen Cooking',
      sub: 'Head Chef preparing fresh',
      icon: <ChefHat className="w-4 h-4" />
    },
    {
      status: 'ready',
      label: 'Packed & Ready',
      sub: 'Insulated packaging checked',
      icon: <Package className="w-4 h-4" />
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
      {/* Top Banner with ETA & Status */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-black">ORDER #{order.orderNumber}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {order.payment.method.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
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
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Digital Invoice</span>
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Live</span>
          </button>
        </div>
      </div>

      {/* Interactive Delivery GPS Map Simulation Canvas */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-950 border-b border-slate-800 overflow-hidden select-none">
        {/* Styled Dark Street Grid Map Graphic (SVG) */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Map Grid / Blocks */}
          <rect width="800" height="400" fill="#090d16" />
          
          {/* City blocks & parks */}
          <rect x="40" y="40" width="180" height="110" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          <rect x="260" y="40" width="220" height="110" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          <rect x="520" y="40" width="240" height="110" rx="8" fill="#064e3b" fillOpacity="0.2" stroke="#065f46" strokeWidth="2" />
          
          <rect x="40" y="190" width="180" height="170" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          <rect x="260" y="190" width="220" height="170" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          <rect x="520" y="190" width="240" height="170" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />

          {/* Road Network Lines */}
          <line x1="0" y1="165" x2="800" y2="165" stroke="#374151" strokeWidth="26" />
          <line x1="0" y1="165" x2="800" y2="165" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />

          <line x1="240" y1="0" x2="240" y2="400" stroke="#374151" strokeWidth="22" />
          <line x1="500" y1="0" x2="500" y2="400" stroke="#374151" strokeWidth="22" />

          {/* Planned Delivery Polyline Path from Coder Cafe (120, 165) to Delivery Address (680, 240) */}
          <path
            d="M 120 165 L 500 165 L 500 240 L 680 240"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            className="animate-pulse"
          />

          {/* Coder Cafe Flagship Marker at (120, 165) */}
          <circle cx="120" cy="165" r="22" fill="#f59e0b" fillOpacity="0.25" className="animate-pulse-ring" />
          <circle cx="120" cy="165" r="14" fill="#f59e0b" />
          <text x="120" y="140" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="monospace">
            CODER CAFE (HUB)
          </text>

          {/* Customer Destination Marker at (680, 240) */}
          <circle cx="680" cy="240" r="22" fill="#10b981" fillOpacity="0.25" className="animate-pulse-ring" />
          <circle cx="680" cy="240" r="14" fill="#10b981" />
          <text x="680" y="275" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="bold" fontFamily="monospace">
            {order.customer.address.label.toUpperCase()} DESTINATION
          </text>
        </svg>

        {/* Dynamic Animated Delivery Scooter Positioned via CSS Percentages along Route */}
        {order.status === 'out_for_delivery' && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20 pointer-events-none"
            style={{
              left: `${15 + (progressPct * 0.7)}%`,
              top: `${progressPct < 55 ? 42 : 60}%`
            }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 border-2 border-white animate-bounce">
                <Bike className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 whitespace-nowrap shadow-md">
                Alex (Speed: 24 km/h)
              </div>
            </div>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-slate-200">Live GPS Tracking</span>
          <span className="text-[10px] text-slate-400">• Accuracy: ±2m</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2 z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Geofenced Delivery Corridor</span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="p-4 sm:p-6 border-b border-slate-800">
        <div className="grid grid-cols-5 gap-2 relative">
          {/* Progress connector line */}
          <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-slate-800 -z-0">
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{ width: `${Math.min(100, currentStepIdx * 25)}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.status} className="flex flex-col items-center text-center z-10">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 font-bold scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold truncate max-w-full ${
                    isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline truncate max-w-full mt-0.5">
                  {step.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rider Card & Contact */}
      {order.rider && (
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                AC
              </div>
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded font-mono">
                {order.rider.rating} ★
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{order.rider.name}</h4>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono">
                  {order.rider.plateNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">{order.rider.vehicle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${order.rider.phone}`}
              onClick={(e) => {
                e.preventDefault();
                addToast('Calling Rider Alex...', `Dialing ${order.rider?.phone} on secure channel`, 'info');
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-slate-700 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Call Rider</span>
            </a>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-amber-500/40 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      )}

      {/* Order Items Review Strip */}
      <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#080C14]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Order Summary ({order.items.length} dishes)
        </h4>
        <div className="space-y-2.5">
          {order.items.map((it) => (
            <div key={it.cartItemId} className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-400 font-bold">{it.quantity}x</span>
                <span className="font-medium text-white">{it.menuItem.name}</span>
                {it.selectedOptions.length > 0 && (
                  <span className="text-slate-400 text-[11px]">
                    ({it.selectedOptions.map((o) => o.optionName).join(', ')})
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-200 font-bold">₹{it.itemTotalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-slate-400">Total Billed ({order.payment.method.toUpperCase()})</span>
          <span className="font-mono text-sm font-black text-amber-400">₹{order.pricing.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivered State: Customer Rating & Feedback Submission */}
      {order.status === 'delivered' && !order.ratings && (
        <div className="p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-bold text-base text-white mb-1">How was your Coder Cafe experience?</h4>
            <p className="text-xs text-slate-400 mb-4">
              Rate your food temperature & delivery promptness.
            </p>

            <form onSubmit={handleRatingSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Food Quality & Taste
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingFood(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= ratingFood
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-2 font-mono">
                    {ratingFood}/5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Delivery Speed & Rider Service
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingDelivery(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= ratingDelivery
                            ? 'fill-sky-400 text-sky-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-sky-400 ml-2 font-mono">
                    {ratingDelivery}/5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Written Feedback (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Loved the hotfix espresso and fresh brioche burger..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Submit Feedback
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
