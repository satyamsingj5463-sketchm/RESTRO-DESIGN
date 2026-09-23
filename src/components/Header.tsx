import React, { useState } from 'react';
import {
  Coffee,
  ShoppingBag,
  MapPin,
  Search,
  SlidersHorizontal,
  ChevronDown,
  User,
  Shield,
  ChefHat,
  Bike,
  Smartphone,
  Monitor,
  Wifi,
  BatteryCharging,
  Signal,
  BookOpen,
  X,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PinLoginModal } from './PinLoginModal';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenRoadmap: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, onOpenRoadmap }) => {
  const {
    role,
    setRole,
    staffAuthenticated,
    adminAuthenticated,
    cartTotalCount,
    cartSubtotal,
    setIsCartOpen,
    currentAddress,
    setCurrentAddress,
    addresses,
    searchQuery,
    setSearchQuery,
    isMobileFrame,
    setIsMobileFrame,
    addToast
  } = useApp();

  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [pinModalRole, setPinModalRole] = useState<'staff' | 'admin' | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleRoleSelect = (targetRole: 'customer' | 'staff' | 'admin' | 'rider') => {
    if (targetRole === 'customer') {
      setRole('customer');
    } else if (targetRole === 'rider') {
      setRole('rider');
    } else if (targetRole === 'staff') {
      if (staffAuthenticated) {
        setRole('staff');
      } else {
        setPinModalRole('staff');
      }
    } else if (targetRole === 'admin') {
      if (adminAuthenticated) {
        setRole('admin');
      } else {
        setPinModalRole('admin');
      }
    }
  };

  const handleGpsDetect = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingLocation(false);
          setIsAddressMenuOpen(false);
          addToast(
            'GPS Location Locked',
            `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} • Coder Cafe delivery available in your zone.`,
            'success'
          );
        },
        () => {
          setIsDetectingLocation(false);
          addToast('Location Fallback', 'Using Silicon Valley Tech Hub as your delivery zone.', 'info');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
      addToast('GPS Unavailable', 'Selected Silicon Valley Tech Hub default zone.', 'info');
    }
  };

  // Current time for Android status bar
  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080C14]/95 backdrop-blur-md border-b border-white/[0.08] transition-all">
        {/* Android Simulated Status Bar */}
        <div className="bg-[#05080E] px-4 py-1 text-[11px] font-mono text-slate-400 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">{currentTimeStr}</span>
            <span className="text-[10px] px-2 py-0.2 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Android 14 Native (API 34)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-400 font-bold">5G Jio/Airtel</span>
            <Signal className="w-3 h-3 text-slate-400" />
            <Wifi className="w-3 h-3 text-slate-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">98%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
                <Coffee className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 text-[9px] bg-slate-950 text-amber-400 font-mono px-1 rounded border border-amber-500/40">
                  {'>_'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                    CODER<span className="text-amber-400">CAFE</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase tracking-wider">
                    Open
                  </span>
                </div>
                {/* Delivery location selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsAddressMenuOpen(!isAddressMenuOpen)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                      {currentAddress.label}: {currentAddress.addressLine1}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Address dropdown */}
                  {isAddressMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Select Delivery Zone
                        </span>
                        <button
                          onClick={() => setIsAddressMenuOpen(false)}
                          className="p-1 hover:bg-slate-800 rounded-md text-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={handleGpsDetect}
                        disabled={isDetectingLocation}
                        className="w-full mb-2 p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Compass className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                        {isDetectingLocation ? 'Detecting GPS Coordinates...' : 'Auto-Detect Current GPS Location'}
                      </button>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {addresses.map((addr, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setCurrentAddress(addr);
                              setIsAddressMenuOpen(false);
                              addToast('Address Selected', `Delivering to ${addr.label}`, 'info');
                            }}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                              currentAddress.label === addr.label
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                                : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                <span>{addr.label}</span>
                                {currentAddress.label === addr.label && (
                                  <span className="text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-[11px] truncate">{addr.addressLine1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Search Bar (Desktop / Tablet) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Hotfix Espresso, Binary Burgers, Pizza..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2">
              {/* Role Switcher Pills */}
              <div className="flex items-center bg-[#090D15] p-1 rounded-2xl border border-white/[0.08]">
                <button
                  onClick={() => handleRoleSelect('customer')}
                  title="Customer Food Ordering View"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    role === 'customer'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Menu</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('staff')}
                  title="Kitchen Staff Portal"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    role === 'staff'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Staff</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  title="Admin Management Portal"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    role === 'admin'
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('rider')}
                  title="Live Rider Simulator"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    role === 'rider'
                      ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rider</span>
                </button>
              </div>

              {/* Technical Roadmap button */}
              <button
                onClick={onOpenRoadmap}
                title="View Technical Roadmap & Architecture"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-amber-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Roadmap</span>
              </button>

              {/* Toggle Mobile Android Frame vs Full Web layout */}
              <button
                onClick={() => setIsMobileFrame(!isMobileFrame)}
                title={isMobileFrame ? 'Switch to Full Browser View' : 'Switch to Android Phone Preview Frame'}
                className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 rounded-xl border border-white/[0.08] transition-colors cursor-pointer hidden md:flex items-center justify-center"
              >
                {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Cart Drawer Trigger with INR currency */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {cartTotalCount > 0 ? `₹${cartSubtotal.toFixed(0)}` : 'Cart'}
                </span>
                {cartTotalCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black">
                    {cartTotalCount}
                  </span>
                )}
              </button>

              {/* Profile button */}
              <button
                onClick={onOpenProfile}
                title="Customer Profile & Loyalty Club"
                className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Mobile Search input */}
          <div className="mt-2.5 md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, burger, pizza, fries..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* PIN Login Modal */}
      {pinModalRole && (
        <PinLoginModal
          isOpen={true}
          targetRole={pinModalRole}
          onClose={() => setPinModalRole(null)}
        />
      )}
    </>
  );
};
