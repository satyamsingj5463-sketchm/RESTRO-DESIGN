import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RestaurantHero } from './components/RestaurantHero';
import { MenuSection } from './components/MenuSection';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { StaffKitchenPortal } from './components/StaffKitchenPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { RiderPortal } from './components/RiderPortal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProfileModal } from './components/ProfileModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ReviewsModal } from './components/ReviewsModal';
import { RoadmapModal } from './components/RoadmapModal';
import { PinLoginModal } from './components/PinLoginModal';
import { BottomNav } from './components/BottomNav';
import { Order } from './types';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Smartphone,
  Sparkles,
  MapPin,
  Bike
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    role,
    activeOrder,
    setActiveOrder,
    isCartOpen,
    setIsCartOpen,
    toasts,
    dismissToast,
    isMobileFrame,
    setIsMobileFrame,
    orders
  } = useApp();

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [pinModalTarget, setPinModalTarget] = useState<'staff' | 'admin' | null>(null);

  // Mobile active tab ('menu' vs 'track')
  const [mobileTab, setMobileTab] = useState<'menu' | 'track'>('menu');

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setMobileTab('track');
  };

  const appContent = (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 pb-20 md:pb-6">
      {/* Header */}
      <Header
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Role: Customer View */}
        {role === 'customer' && (
          <>
            {/* Show Live Order Tracker if user has an active order and selected track tab, or if there's an ongoing active delivery */}
            {(mobileTab === 'track' || (activeOrder && activeOrder.status !== 'delivered')) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                      Live Delivery Progress
                    </h3>
                  </div>
                  {mobileTab === 'track' && (
                    <button
                      onClick={() => setMobileTab('menu')}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Back to Menu
                    </button>
                  )}
                </div>
                <LiveOrderTracker
                  order={activeOrder}
                  onOpenInvoice={(ord) => setInvoiceOrder(ord)}
                />
              </div>
            )}

            {/* Menu and Restaurant Hero */}
            {mobileTab === 'menu' && (
              <>
                <RestaurantHero onOpenReviews={() => setIsReviewsOpen(true)} />
                <MenuSection />
              </>
            )}
          </>
        )}

        {/* Role: Staff Kitchen Portal */}
        {role === 'staff' && <StaffKitchenPortal />}

        {/* Role: Admin Dashboard */}
        {role === 'admin' && <AdminDashboard />}

        {/* Role: Rider Simulator */}
        {role === 'rider' && <RiderPortal />}
      </main>

      {/* Bottom Nav on Mobile */}
      <BottomNav
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTracker={() => setMobileTab('track')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPinModal={(target) => setPinModalTarget(target)}
      />

      {/* Toast Notifications Overlay */}
      <div className="fixed top-14 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border flex items-start gap-3 text-xs backdrop-blur-md animate-fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold text-white text-xs">{toast.title}</div>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenInvoice={(ord) => setInvoiceOrder(ord)}
        onSelectActiveOrder={(ord) => {
          setActiveOrder(ord);
          setMobileTab('track');
        }}
      />

      <InvoiceModal
        order={invoiceOrder}
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      {pinModalTarget && (
        <PinLoginModal
          isOpen={true}
          targetRole={pinModalTarget}
          onClose={() => setPinModalTarget(null)}
        />
      )}
    </div>
  );

  // If in Android Phone Frame mode, wrap in realistic Android phone mockup frame
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-[#05080E] flex flex-col items-center justify-center p-2 sm:p-6 select-none">
        {/* Top Control to Exit Frame */}
        <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-amber-400">
            <Smartphone className="w-4 h-4" /> Android 14 Frame (Pixel 8 Pro)
          </span>
          <button
            onClick={() => setIsMobileFrame(false)}
            className="px-3 py-1 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 rounded-lg font-medium transition-colors cursor-pointer border border-white/[0.08]"
          >
            Switch to Full Width
          </button>
        </div>

        {/* Android Phone Device Frame */}
        <div className="relative w-full max-w-[420px] h-[860px] max-h-[95vh] rounded-[48px] bg-[#080C14] border-[10px] border-[#131B2A] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/[0.1]">
          {/* Top Speaker / Camera Punch-Hole */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#05080E] rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 mr-2" />
            <div className="w-8 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Scrollable Phone Screen */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {appContent}
          </div>

          {/* Android Bottom Home Navigation Bar Pill */}
          <div className="h-4 bg-[#05080E] w-full flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return appContent;
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
