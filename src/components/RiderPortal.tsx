import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { OrderChatModal } from './OrderChatModal';

export const RiderPortal: React.FC = () => {
  const { orders, updateOrderStatus, updateRiderLocation, logoutRole, addToast } = useApp();
  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);

  // Find active orders assigned to rider
  const activeOrders = orders.filter(
    (o) => o.status === 'out_for_delivery' || o.status === 'ready' || o.status === 'placed' || o.status === 'preparing'
  );

  const selectedOrder = activeOrders[0] || orders[0] || null;
  const progressPct = selectedOrder?.rider?.currentLocation.progressPct || 25;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedOrder) return;
    const val = parseFloat(e.target.value);
    updateRiderLocation(selectedOrder.id, val);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Rider Delivery Hub</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                Vehicle: Electric Scooter (DL-01-EV-4040)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rider Alex Kumar • GPS Live Navigation & Customer Delivery Dispatch
            </p>
          </div>
        </div>

        <button
          onClick={logoutRole}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
        >
          Exit Rider View
        </button>
      </div>

      {!selectedOrder ? (
        <div className="p-12 text-center bg-[#0D131F] rounded-3xl border border-white/[0.08]">
          <Bike className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="font-bold text-white">No Assigned Deliveries</h3>
          <p className="text-xs text-slate-400 mt-1">
            Place an order to see real-time route navigation and telemetry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main: GPS Route Controller */}
          <div className="lg:col-span-2 p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-400 animate-pulse" />
                <h3 className="font-bold text-base text-white">Live Route Telemetry</h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-[#080C14] px-2.5 py-1 rounded-xl border border-white/[0.08]">
                Order #{selectedOrder.orderNumber}
              </span>
            </div>

            {/* GPS progress slider */}
            <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Delivery Route (Kitchen Hub → Destination)</span>
                <span className="font-mono text-sky-400 font-bold">{progressPct.toFixed(0)}% Completed</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progressPct}
                onChange={handleSliderChange}
                className="w-full h-3 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-sky-400"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0% (Kitchen Hub)</span>
                <span>50% (Main Avenue)</span>
                <span>100% (Customer Gate)</span>
              </div>
            </div>

            {/* Quick Delivery Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <button
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'out_for_delivery');
                  updateRiderLocation(selectedOrder.id, 10);
                }}
                className="p-3 rounded-2xl bg-[#080C14] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>Pickup Bag</span>
              </button>

              <button
                onClick={() => updateRiderLocation(selectedOrder.id, 50)}
                className="p-3 rounded-2xl bg-[#080C14] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Bike className="w-4 h-4 text-sky-400" />
                <span>Halfway (50%)</span>
              </button>

              <button
                onClick={() => updateRiderLocation(selectedOrder.id, 95)}
                className="p-3 rounded-2xl bg-[#080C14] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>At Gate (95%)</span>
              </button>

              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex flex-col items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered ✓</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customer Info & Drop-off notes */}
          <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] space-y-4">
            <h3 className="font-bold text-base text-white">Delivery Ticket</h3>

            <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Customer</span>
                <span className="font-bold text-white">{selectedOrder.customer.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="font-mono text-slate-300">{selectedOrder.customer.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tag</span>
                <span className="font-bold text-amber-400">{selectedOrder.customer.address.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Order Amount</span>
                <span className="font-mono font-bold text-emerald-400">₹{selectedOrder.pricing.total.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-slate-400 block mb-0.5">Drop-off Address:</span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {selectedOrder.customer.address.addressLine1}, {selectedOrder.customer.address.city}
                </p>
                {selectedOrder.customer.address.instructions && (
                  <p className="text-amber-300/90 font-mono mt-1 text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Note: {selectedOrder.customer.address.instructions}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveChatOrder(selectedOrder)}
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Customer</span>
              </button>
              <a
                href={`tel:${selectedOrder.customer.phone}`}
                onClick={(e) => {
                  e.preventDefault();
                  addToast('Calling customer', `Dialing ${selectedOrder.customer.name}`, 'info');
                }}
                className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 rounded-2xl text-xs font-semibold flex items-center justify-center border border-white/[0.08] transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Chat modal */}
      <OrderChatModal
        order={activeChatOrder}
        isOpen={!!activeChatOrder}
        onClose={() => setActiveChatOrder(null)}
      />
    </div>
  );
};
