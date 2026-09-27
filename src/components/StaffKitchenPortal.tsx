import React, { useState } from 'react';
import {
  ChefHat,
  Package,
  Bike,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Search,
  MessageSquare,
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock
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
  const [activeStage, setActiveStage] = useState<'new' | 'cooking' | 'ready' | 'out' | 'stock'>('new');

  const incomingOrders = orders.filter((o) => o.status === 'placed');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const outOrders = orders.filter((o) => o.status === 'out_for_delivery');

  const filteredStockItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in pb-16">
      {/* Mobile Top Navigation & Exit Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white border border-amber-400/25 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black shadow-sm">
            <ChefHat className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white tracking-tight">Kitchen KDS</h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                Staff
              </span>
            </div>
            <p className="text-[10px] text-slate-300">Order Pipelines & Prep Timers</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addToast('KDS Sound Test', 'Order chime bell active.', 'info')}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 text-xs border border-white/15 cursor-pointer"
            title="Test Bell Sound"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={logoutRole}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/15"
          >
            ← Exit
          </button>
        </div>
      </div>

      {/* Horizontal Stage Switcher Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveStage('new')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeStage === 'new'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <span>New</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeStage === 'new' ? 'bg-slate-950 text-amber-300' : 'bg-amber-100 text-amber-800'
          }`}>
            {incomingOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('cooking')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeStage === 'cooking'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <span>Cooking</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeStage === 'cooking' ? 'bg-white text-blue-900' : 'bg-blue-100 text-blue-800'
          }`}>
            {preparingOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('ready')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeStage === 'ready'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <span>Ready</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeStage === 'ready' ? 'bg-white text-emerald-900' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {readyOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('out')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeStage === 'out'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <span>Out</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeStage === 'out' ? 'bg-white text-indigo-900' : 'bg-indigo-100 text-indigo-800'
          }`}>
            {outOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveStage('stock')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeStage === 'stock'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>86-Stock</span>
        </button>
      </div>

      {/* STAGE 1: NEW ORDERS */}
      {activeStage === 'new' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Incoming Orders ({incomingOrders.length})</span>
            <span className="text-[10px] text-amber-700 font-mono font-bold">Action Needed</span>
          </div>

          {incomingOrders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <ChefHat className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Pending Orders</h4>
              <p className="text-xs text-slate-500 mt-1">New customer orders will chime here in real-time from Firestore.</p>
            </div>
          ) : (
            incomingOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-amber-300 space-y-3 shadow-sm ring-1 ring-amber-300/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                      NEW TICKET
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono font-medium">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-800 border-t border-b border-slate-100 py-2">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">{it.quantity}x {it.menuItem.name}</span>
                      {it.specialInstructions && (
                        <span className="text-[10px] text-rose-600 italic ml-2 max-w-[140px] text-right truncate">"{it.specialInstructions}"</span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateOrderStatus(ord.id, 'preparing')}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Accept Ticket & Start Prep</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* STAGE 2: COOKING */}
      {activeStage === 'cooking' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Currently in Pan / Oven ({preparingOrders.length})</span>
            <span className="text-[10px] text-blue-600 font-mono font-bold">Cooking</span>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <ChefHat className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Kitchen Station Free</h4>
              <p className="text-xs text-slate-500 mt-1">Accept tickets to see them in cooking stage.</p>
            </div>
          ) : (
            preparingOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-blue-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono">
                      COOKING
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveChatOrder(ord)}
                    className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-amber-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-800 border-t border-b border-slate-100 py-2">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between">
                      <span className="font-bold text-slate-900">{it.quantity}x {it.menuItem.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateOrderStatus(ord.id, 'ready')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Package className="w-4 h-4" />
                  <span>Pack & Mark Ready for Pickup</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* STAGE 3: READY */}
      {activeStage === 'ready' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>On Pickup Shelf ({readyOrders.length})</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Ready</span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Shelf Empty</h4>
              <p className="text-xs text-slate-500 mt-1">Ready packed orders appear here for rider handover.</p>
            </div>
          ) : (
            readyOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                      SHELF READY
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 truncate max-w-[120px]">
                    {ord.customer.name}
                  </span>
                </div>

                <p className="text-xs text-slate-700">
                  Assigned Rider: <span className="font-bold text-amber-700">{ord.rider?.name || 'Alex Kumar'}</span>
                </p>

                <button
                  onClick={() => updateOrderStatus(ord.id, 'out_for_delivery')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Bike className="w-4 h-4" />
                  <span>Hand Over to Rider</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* STAGE 4: ON ROUTE / OUT */}
      {activeStage === 'out' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>En Route Deliveries ({outOrders.length})</span>
            <span className="text-[10px] text-indigo-600 font-mono font-bold">GPS Active</span>
          </div>

          {outOrders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <Bike className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Deliveries on Route</h4>
              <p className="text-xs text-slate-500 mt-1">Dispatched orders in transit appear here.</p>
            </div>
          ) : (
            outOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-slate-900">
                    #{ord.orderNumber}
                  </span>
                  <span className="text-xs text-amber-700 font-mono font-bold">
                    ~{ord.rider?.estimatedMinutes || 10}m ETA
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p>Customer: <strong className="text-slate-900">{ord.customer.name}</strong> ({ord.customer.phone})</p>
                  <p className="text-slate-500 text-[11px] truncate">Drop: {ord.customer.address.addressLine1}</p>
                </div>

                <button
                  onClick={() => updateOrderStatus(ord.id, 'delivered')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
                >
                  Mark Delivered (Direct)
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* STAGE 5: 86-STOCK INVENTORY BOARD */}
      {activeStage === 'stock' && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 animate-fade-in shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Ingredient 86-Board</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono font-medium">
              {filteredStockItems.length} dishes
            </span>
          </div>

          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              placeholder="Search dishes to toggle stock..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredStockItems.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  item.isAvailable
                    ? 'bg-slate-50/70 border-slate-200 text-slate-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate text-slate-900">{item.name}</div>
                    <span className="font-mono text-[10px] text-slate-500">
                      ₹{item.price} • {item.isAvailable ? 'In Stock' : '86ed (Unavailable)'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemStock(item.id, !item.isAvailable)}
                  className={`p-1 rounded-lg cursor-pointer ${
                    item.isAvailable ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {item.isAvailable ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat modal for staff with customer */}
      <OrderChatModal
        order={activeChatOrder}
        isOpen={!!activeChatOrder}
        onClose={() => setActiveChatOrder(null)}
      />
    </div>
  );
};
