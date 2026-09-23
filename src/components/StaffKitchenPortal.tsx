import React, { useState } from 'react';
import {
  ChefHat,
  Package,
  Bike,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Search,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { OrderChatModal } from './OrderChatModal';

export const StaffKitchenPortal: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    toggleItemStock,
    logoutRole,
    addToast
  } = useApp();

  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
  const [stockSearch, setStockSearch] = useState('');

  const incomingOrders = orders.filter((o) => o.status === 'placed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const outOrders = orders.filter((o) => o.status === 'out_for_delivery');

  const filteredStockItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Staff Navigation & Info Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Coder Cafe Kitchen Display (KDS)</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Staff Station Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kitchen Display System • Managing live order pipelines and item inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => addToast('KDS Sound Test', 'Order chime bell active.', 'info')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
          >
            Bell Test 🔔
          </button>
          <button
            onClick={logoutRole}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-white/[0.08] transition-colors cursor-pointer"
          >
            Switch to Customer View
          </button>
        </div>
      </div>

      {/* 4 Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Placed (Needs Acceptance) */}
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-col overflow-hidden">
          <div className="p-3 bg-amber-500/15 border-b border-white/[0.08] flex items-center justify-between text-amber-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                1. New Orders ({incomingOrders.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/30 px-1.5 py-0.5 rounded">
              Needs Prep
            </span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {incomingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No incoming tickets</p>
            ) : (
              incomingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 border-t border-b border-white/[0.06] py-2">
                    {ord.items.map((it) => (
                      <div key={it.cartItemId} className="flex justify-between">
                        <span className="font-bold text-amber-300">{it.quantity}x {it.menuItem.name}</span>
                        {it.specialInstructions && (
                          <span className="text-[10px] text-rose-300 italic">"{it.specialInstructions}"</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'preparing')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Accept & Start Cooking</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-col overflow-hidden">
          <div className="p-3 bg-blue-500/15 border-b border-white/[0.08] flex items-center justify-between text-blue-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                2. Cooking ({preparingOrders.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-500/30 px-1.5 py-0.5 rounded">
              In Pan
            </span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {preparingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No dishes in cooking</p>
            ) : (
              preparingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#080C14] border border-blue-500/30 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">
                      #{ord.orderNumber}
                    </span>
                    <button
                      onClick={() => setActiveChatOrder(ord)}
                      className="text-slate-400 hover:text-amber-400 p-1 cursor-pointer"
                      title="Chat with customer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 border-t border-b border-white/[0.06] py-2">
                    {ord.items.map((it) => (
                      <div key={it.cartItemId} className="flex justify-between">
                        <span className="font-semibold text-slate-200">{it.quantity}x {it.menuItem.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'ready')}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Pack & Mark Ready</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Rider */}
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-col overflow-hidden">
          <div className="p-3 bg-emerald-500/15 border-b border-white/[0.08] flex items-center justify-between text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                3. Ready ({readyOrders.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/30 px-1.5 py-0.5 rounded">
              Pickup Shelf
            </span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {readyOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">Shelf is clear</p>
            ) : (
              readyOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#080C14] border border-emerald-500/30 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Packed ✓</span>
                  </div>

                  <p className="text-xs text-slate-400 truncate">
                    Assigned: {ord.rider?.name || 'Rider Alex'} ({ord.rider?.vehicle})
                  </p>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'out_for_delivery')}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Hand Over to Rider</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Out for Delivery */}
        <div className="rounded-3xl bg-[#0D131F] border border-white/[0.08] flex flex-col overflow-hidden">
          <div className="p-3 bg-purple-500/15 border-b border-white/[0.08] flex items-center justify-between text-purple-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                4. On Route ({outOrders.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-500/30 px-1.5 py-0.5 rounded">
              GPS Active
            </span>
          </div>

          <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {outOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No active deliveries</p>
            ) : (
              outOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-white">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400">
                      ~{ord.rider?.estimatedMinutes || 10}m ETA
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Destination: {ord.customer.address.label} ({ord.customer.name})
                  </p>

                  <button
                    onClick={() => updateOrderStatus(ord.id, 'delivered')}
                    className="w-full py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Force Mark Delivered
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 86-Item Management Board: Toggle Stock in Real Time */}
      <div className="p-5 rounded-3xl bg-[#0D131F] border border-white/[0.08] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Kitchen 86-Board (Live Item Availability)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Instantly toggle dishes In-Stock or Out-of-Stock when ingredients run out.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              placeholder="Search dishes to 86..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#080C14] border border-white/[0.1] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredStockItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                item.isAvailable
                  ? 'bg-[#080C14] border-white/[0.08] text-slate-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs truncate">{item.name}</div>
                  <span className="font-mono text-[10px] text-slate-400">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleItemStock(item.id, !item.isAvailable)}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  item.isAvailable
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-rose-400 hover:text-rose-300'
                }`}
                title={item.isAvailable ? 'Click to mark OUT OF STOCK' : 'Click to mark IN STOCK'}
              >
                {item.isAvailable ? (
                  <ToggleRight className="w-7 h-7" />
                ) : (
                  <ToggleLeft className="w-7 h-7" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat modal for staff with customer */}
      <OrderChatModal
        order={activeChatOrder}
        isOpen={!!activeChatOrder}
        onClose={() => setActiveChatOrder(null)}
      />
    </div>
  );
};
