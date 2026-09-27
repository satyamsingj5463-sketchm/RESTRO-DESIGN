import React, { useState } from 'react';
import {
  Coffee,
  ShoppingBag,
  MapPin,
  Search,
  ChevronDown,
  User,
  Settings,
  X,
  Compass,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenRoadmap: () => void;
  onOpenSettingsHub: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenRoadmap,
  onOpenSettingsHub
}) => {
  const {
    role,
    cartTotalCount,
    cartSubtotal,
    setIsCartOpen,
    currentAddress,
    setCurrentAddress,
    addresses,
    searchQuery,
    setSearchQuery,
    addToast
  } = useApp();

  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleGpsDetect = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingLocation(false);
          setIsAddressMenuOpen(false);
          addToast(
            'GPS Coordinates Locked',
            `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} • Coder Cafe delivery zone active.`,
            'success'
          );
        },
        () => {
          setIsDetectingLocation(false);
          addToast('Location Fallback', 'Using Silicon Valley Tech Hub default zone.', 'info');
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
      addToast('GPS Unavailable', 'Selected Silicon Valley Tech Hub default zone.', 'info');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white border-b border-amber-400/25 shadow-md shadow-indigo-950/20 transition-all">
      <div className="max-w-md mx-auto px-3.5 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-slate-950 font-black shadow-md shadow-amber-400/30 ring-2 ring-amber-300/50 shrink-0">
              <Coffee className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm tracking-tight text-white font-mono">
                  CODER<span className="text-amber-400">CAFE</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold uppercase tracking-wider">
                  Open
                </span>
              </div>

              {/* Delivery Location Selector */}
              <div className="relative mt-0.5">
                <button
                  onClick={() => setIsAddressMenuOpen(!isAddressMenuOpen)}
                  className="flex items-center gap-1 text-[11px] text-indigo-100 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-medium truncate max-w-[130px] text-indigo-100">
                    {currentAddress.label}: {currentAddress.addressLine1}
                  </span>
                  <ChevronDown className="w-2.5 h-2.5 text-indigo-300" />
                </button>

                {/* Address dropdown */}
                {isAddressMenuOpen && (
                  <div className="fixed inset-x-3 top-16 sm:absolute sm:left-0 sm:top-full sm:inset-x-auto sm:mt-2 w-auto sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 text-slate-800 animate-slide-up">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                        Select Delivery Zone
                      </span>
                      <button
                        onClick={() => setIsAddressMenuOpen(false)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleGpsDetect}
                      disabled={isDetectingLocation}
                      className="w-full mb-2 p-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl text-xs text-indigo-800 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Compass className={`w-3.5 h-3.5 text-indigo-600 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                      {isDetectingLocation ? 'Detecting GPS...' : 'Auto-Detect Current GPS'}
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
                          className={`p-2 rounded-xl text-xs cursor-pointer transition-colors flex items-start gap-2 ${
                            currentAddress.label === addr.label
                              ? 'bg-amber-50 border border-amber-300 text-amber-950 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{addr.label}</span>
                              {currentAddress.label === addr.label && (
                                <span className="text-[8px] bg-amber-500 text-slate-950 px-1 rounded font-black">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-[10px] truncate">{addr.addressLine1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Icons: Search toggle, Settings/Portals Hub button, Cart pill */}
          <div className="flex items-center gap-1.5">
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSearchExpanded || searchQuery
                  ? 'bg-amber-400/25 border-amber-300 text-amber-300'
                  : 'bg-white/10 border-white/15 text-indigo-100 hover:bg-white/20'
              }`}
              title="Search Menu"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Settings & Portals Hub Button */}
            <button
              onClick={onOpenSettingsHub}
              className="relative p-2 rounded-xl bg-white/10 border border-amber-400/30 hover:bg-white/20 text-amber-300 transition-all cursor-pointer shadow-sm"
              title="Settings & Operational Hub (Staff, Rider, Admin, PINs)"
            >
              <Settings className="w-4 h-4" />
              {role !== 'customer' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-indigo-900" />
              )}
            </button>

            {/* Quick Cart Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/30 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-xs">
                {cartTotalCount > 0 ? `₹${cartSubtotal.toFixed(0)}` : '0'}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Luxury Mobile Search Bar */}
        {(isSearchExpanded || searchQuery) && (
          <div className="mt-2.5 pt-2 border-t border-white/10 animate-slide-up">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, smash burger, pizza, fries..."
                autoFocus
                className="w-full pl-8 pr-8 py-2 bg-indigo-950/80 border border-indigo-400/40 rounded-xl text-xs text-white placeholder-indigo-200/60 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
