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
import { SettingsHubModal } from './components/SettingsHubModal';
import { Order } from './types';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Sparkles
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
    orders
  } = useApp();

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsHubOpen, setIsSettingsHubOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [pinModalTarget, setPinModalTarget] = useState<'staff' | 'admin' | 'rider' | null>(null);

  // Mobile active tab ('menu' vs 'track')
  const [mobileTab, setMobileTab] = useState<'menu' | 'track'>('menu');

  const handleOrderSuccess = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setMobileTab('track');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 flex justify-center items-start selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Centered Luxury Mobile Application Shell */}
      <div className="w-full max-w-md min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col relative sm:border-x sm:border-slate-300/80 sm:shadow-2xl pb-24 sm:pb-28">
        {/* Header */}
        <Header
          onOpenProfile={() => setIsSettingsHubOpen(true)}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
          onOpenSettingsHub={() => setIsSettingsHubOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-3.5 py-3">
          {/* Role: Customer View */}
          {role === 'customer' && (
            <>
              {/* Show Live Order Tracker if user has an active order and selected track tab, or if there's an ongoing active delivery */}
              {(mobileTab === 'track' || (activeOrder && activeOrder.status !== 'delivered')) && (
                <div className="mb-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-950">
                        Live Delivery Progress
                      </h3>
                    </div>
                    {mobileTab === 'track' && (
                      <button
                        onClick={() => setMobileTab('menu')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
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
                <div className="space-y-4">
                  <RestaurantHero onOpenReviews={() => setIsReviewsOpen(true)} />
                  <MenuSection />
                </div>
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

        {/* Fixed Native Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={mobileTab}
          setActiveTab={setMobileTab}
          onOpenSettingsHub={() => setIsSettingsHubOpen(true)}
          onOpenTracker={() => setMobileTab('track')}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Toast Notifications Overlay (Anchored to top of mobile screen) */}
        <div className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3 rounded-2xl shadow-xl border flex items-start gap-2.5 text-xs backdrop-blur-xl animate-fade-in ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : toast.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-800 shadow-lg'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold text-xs">{toast.title}</div>
                <p className="text-[11px] opacity-90 leading-tight mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Modals & Bottom Sheets */}
        <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Settings & Operational Hub (Staff, Rider, Admin, PINs, Profile) */}
        <SettingsHubModal
          isOpen={isSettingsHubOpen}
          onClose={() => setIsSettingsHubOpen(false)}
          onOpenPinModal={(target) => setPinModalTarget(target)}
          onOpenRoadmap={() => setIsRoadmapOpen(true)}
          onOpenInvoice={(ord) => setInvoiceOrder(ord)}
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
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
