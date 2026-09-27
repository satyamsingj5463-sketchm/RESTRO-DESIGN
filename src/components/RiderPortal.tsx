import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Package,
  ArrowRight
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
    <div className="space-y-4 animate-fade-in pb-16">
      {/* Mobile Top Navigation Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white border border-sky-400/30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-slate-950 font-black shadow-sm">
            <Bike className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white tracking-tight">Rider Fleet Hub</h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/40 font-bold">
                EV-4040
              </span>
            </div>
            <p className="text-[10px] text-slate-300">Rider Alex Kumar • GPS Live Navigation</p>
          </div>
        </div>

        <button
          onClick={logoutRole}
          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/15"
        >
          ← Exit
        </button>
      </div>

      {!selectedOrder ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Bike className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">No Active Deliveries</h3>
          <p className="text-xs text-slate-500 mt-1">
            Place an order in the Customer Menu to simulate real-time GPS navigation.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Active Delivery Ticket Header */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-slate-900">
                  Order #{selectedOrder.orderNumber}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase font-mono">
                  {selectedOrder.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Drop to: <strong className="text-slate-700">{selectedOrder.customer.address.label}</strong> ({selectedOrder.customer.name})
              </p>
            </div>

            <button
              onClick={() => setActiveChatOrder(selectedOrder)}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Chat</span>
            </button>
          </div>

          {/* GPS Route Telemetry Slider Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-sky-600 animate-pulse" />
                <h3 className="font-bold text-xs text-slate-900">Live Route Telemetry</h3>
              </div>
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                {progressPct.toFixed(0)}% Dispatched
              </span>
            </div>

            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPct}
                onChange={handleSliderChange}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Kitchen (0%)</span>
                <span>En Route (50%)</span>
                <span>Gate (100%)</span>
              </div>
            </div>

            {/* Quick Delivery Touch Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'out_for_delivery');
                  updateRiderLocation(selectedOrder.id, 15);
                  addToast('Pickup Done', 'Order picked up from kitchen counter.', 'success');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>Pickup Bag</span>
              </button>

              <button
                onClick={() => {
                  updateRiderLocation(selectedOrder.id, 50);
                  addToast('Telemetry', 'Scooter at 50% route midway.', 'info');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bike className="w-3.5 h-3.5 text-sky-600" />
                <span>Midway (50%)</span>
              </button>

              <button
                onClick={() => {
                  updateRiderLocation(selectedOrder.id, 95);
                  addToast('Near Customer', 'Scooter at customer gate (95%).', 'info');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>At Gate (95%)</span>
              </button>

              <button
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'delivered');
                  addToast('Delivered', `Order #${selectedOrder.orderNumber} successfully delivered!`, 'success');
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Delivered ✓</span>
              </button>
            </div>
          </div>

          {/* Customer Drop-off Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Customer & Drop-off Details
            </h4>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Recipient</span>
              <span className="font-bold text-slate-900">{selectedOrder.customer.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Phone</span>
              <div className="flex items-center gap-1 text-sky-700 font-mono font-semibold">
                <Phone className="w-3 h-3" />
                <span>{selectedOrder.customer.phone}</span>
              </div>
            </div>
            <div className="flex items-start justify-between py-1">
              <span className="text-slate-500 shrink-0">Address</span>
              <span className="text-right text-slate-800">{selectedOrder.customer.address.addressLine1}</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat modal for rider with customer */}
      <OrderChatModal
        order={activeChatOrder}
        isOpen={!!activeChatOrder}
        onClose={() => setActiveChatOrder(null)}
      />
    </div>
  );
};
