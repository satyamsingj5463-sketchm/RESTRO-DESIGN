import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  ChefHat,
  Bike,
  Lock,
  Key,
  Eye,
  EyeOff,
  Check,
  MapPin,
  FileText,
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  ArrowRight,
  Coffee,
  Globe,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { sounds } from '../lib/soundEffects';

interface SettingsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPinModal: (role: 'staff' | 'admin' | 'rider') => void;
  onOpenRoadmap: () => void;
  onOpenInvoice?: (order: Order) => void;
}

export const SettingsHubModal: React.FC<SettingsHubModalProps> = ({
  isOpen,
  onClose,
  onOpenPinModal,
  onOpenRoadmap,
  onOpenInvoice
}) => {
  const {
    role,
    setRole,
    staffAuthenticated,
    adminAuthenticated,
    riderAuthenticated,
    securityPins,
    updateSecurityPin,
    user,
    updateUserProfile,
    addresses,
    addAddress,
    currentAddress,
    setCurrentAddress,
    language,
    setLanguage,
    addToast
  } = useApp();

  const [activeSection, setActiveSection] = useState<'portals' | 'security' | 'profile' | 'addresses'>('portals');

  // Security credentials state
  const [adminPinInput, setAdminPinInput] = useState(securityPins.admin);
  const [staffPinInput, setStaffPinInput] = useState(securityPins.staff);
  const [riderPinInput, setRiderPinInput] = useState(securityPins.rider);
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showStaffPin, setShowStaffPin] = useState(false);
  const [showRiderPin, setShowRiderPin] = useState(false);
  const [savedRole, setSavedRole] = useState<string | null>(null);

  // Profile state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);

  // Address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Office' | 'Campus' | 'Other'>('Home');
  const [newAddressLine, setNewAddressLine] = useState('');

  // Audio preference state
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const handlePortalSwitch = (targetRole: 'customer' | 'staff' | 'admin' | 'rider') => {
    if (targetRole === 'customer') {
      setRole('customer');
      addToast('Customer Mode', 'Browsing gourmet menu & dishes.', 'info');
      onClose();
      return;
    }

    if (targetRole === 'staff') {
      if (staffAuthenticated) {
        setRole('staff');
        onClose();
      } else {
        onClose();
        onOpenPinModal('staff');
      }
    } else if (targetRole === 'admin') {
      if (adminAuthenticated) {
        setRole('admin');
        onClose();
      } else {
        onClose();
        onOpenPinModal('admin');
      }
    } else if (targetRole === 'rider') {
      if (riderAuthenticated) {
        setRole('rider');
        onClose();
      } else {
        onClose();
        onOpenPinModal('rider');
      }
    }
  };

  const handleSavePin = (target: 'staff' | 'admin' | 'rider', pinValue: string) => {
    const success = updateSecurityPin(target, pinValue);
    if (success) {
      setSavedRole(target);
      setTimeout(() => setSavedRole(null), 2500);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, email });
    addToast('Profile Updated', 'Your customer details have been saved.', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim()) return;

    addAddress({
      label: newLabel,
      addressLine1: newAddressLine.trim(),
      city: 'Gurugram',
      postalCode: '122002',
      lat: 28.4595,
      lng: 77.0266
    });

    setIsAddingAddress(false);
    setNewAddressLine('');
    addToast('Address Saved', `New ${newLabel} address added.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] bg-white border border-slate-200 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col text-slate-900 overflow-hidden">
        {/* Mobile Pull Indicator */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden bg-[#1E1B4B]">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-indigo-950/20 flex items-center justify-between bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">App Settings & Hub</h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase font-black">
                  {role.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Staff, Rider, Admin & Security Controls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Navigation Pill Tabs */}
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('portals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'portals'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Portals & Modes</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'security'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>PIN Management</span>
          </button>

          <button
            onClick={() => setActiveSection('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveSection('addresses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'addresses'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {/* SECTION 1: PORTALS & APP MODES */}
          {activeSection === 'portals' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Integrated Operational Portals</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Switch between Customer food ordering, Kitchen KDS, Rider Fleet, or Executive Admin. Default authorization PIN is <span className="font-mono font-bold text-amber-800">161616</span>.
                </p>
              </div>

              {/* 1. Customer Ordering Mode */}
              <div
                onClick={() => handlePortalSwitch('customer')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  role === 'customer'
                    ? 'bg-amber-50 border-amber-400 text-slate-900 ring-1 ring-amber-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Customer Menu & Orders</h4>
                      {role === 'customer' && (
                        <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Explore food catalog, place orders, live GPS track</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* 2. Kitchen Staff (KDS) */}
              <div
                onClick={() => handlePortalSwitch('staff')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  role === 'staff'
                    ? 'bg-amber-50 border-amber-400 text-slate-900 ring-1 ring-amber-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Kitchen Display System (KDS)</h4>
                      {role === 'staff' && (
                        <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Live ticket pipeline, food preparation, ingredient stocks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    staffAuthenticated ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {staffAuthenticated ? 'Authorized' : 'PIN: 161616'}
                  </span>
                </div>
              </div>

              {/* 3. Rider Delivery Fleet */}
              <div
                onClick={() => handlePortalSwitch('rider')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  role === 'rider'
                    ? 'bg-sky-50 border-sky-400 text-slate-900 ring-1 ring-sky-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Rider Fleet Navigation</h4>
                      {role === 'rider' && (
                        <span className="text-[9px] font-black bg-sky-500 text-white px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Simulated GPS route dispatch & customer drop-off
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    riderAuthenticated ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {riderAuthenticated ? 'Authorized' : 'PIN: 161616'}
                  </span>
                </div>
              </div>

              {/* 4. Executive Admin Central */}
              <div
                onClick={() => handlePortalSwitch('admin')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  role === 'admin'
                    ? 'bg-purple-50 border-purple-400 text-slate-900 ring-1 ring-purple-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Executive Admin Central</h4>
                      {role === 'admin' && (
                        <span className="text-[9px] font-black bg-purple-600 text-white px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      INR revenue stats, dish editor, order pipeline oversight
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    adminAuthenticated ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {adminAuthenticated ? 'Authorized' : 'PIN: 161616'}
                  </span>
                </div>
              </div>

              {/* Extra Tools: Sound FX & Roadmap */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) sounds.playCartAdd();
                    addToast('Sound FX', next ? 'Sound alerts enabled' : 'Sound alerts muted', 'info');
                  }}
                  className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{soundEnabled ? 'Audio Chimes ON' : 'Audio Muted'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenRoadmap();
                  }}
                  className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 text-xs text-amber-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>App Roadmap</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: SECURITY & PIN MANAGEMENT */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Credential Privacy & PIN Security</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  All passwords and PINs are masked by default. Default PIN for all portals is <span className="font-mono font-bold text-amber-800">161616</span>. Tap the eye icon to verify input.
                </p>
              </div>

              {/* Admin PIN */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900">Executive Admin PIN</span>
                  </div>
                  {savedRole === 'admin' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showAdminPin ? 'text' : 'password'}
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      placeholder="Enter Admin PIN"
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSavePin('admin', adminPinInput)}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Kitchen Staff PIN */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Kitchen Staff (KDS) PIN</span>
                  </div>
                  {savedRole === 'staff' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showStaffPin ? 'text' : 'password'}
                      value={staffPinInput}
                      onChange={(e) => setStaffPinInput(e.target.value)}
                      placeholder="Enter Staff PIN"
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPin(!showStaffPin)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showStaffPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSavePin('staff', staffPinInput)}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Rider Delivery Fleet PIN */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">Rider Fleet PIN</span>
                  </div>
                  {savedRole === 'rider' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showRiderPin ? 'text' : 'password'}
                      value={riderPinInput}
                      onChange={(e) => setRiderPinInput(e.target.value)}
                      placeholder="Enter Rider PIN"
                      className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRiderPin(!showRiderPin)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showRiderPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSavePin('rider', riderPinInput)}
                    className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: CUSTOMER PROFILE */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                      {user.tier} Club Member
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {user.loyaltyPoints} Coins
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* SECTION 4: SAVED ADDRESSES */}
          {activeSection === 'addresses' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Delivery Zones & Addresses
                </span>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1 hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 animate-slide-up">
                  <div className="flex gap-2">
                    {(['Home', 'Office', 'Campus'] as const).map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewLabel(lbl)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          newLabel === lbl
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    placeholder="Enter street, building, apartment..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentAddress(addr);
                      addToast('Active Address', `Set to ${addr.label}`, 'info');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                      currentAddress.label === addr.label
                        ? 'bg-amber-50 border-amber-400 text-slate-900 ring-1 ring-amber-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                          {currentAddress.label === addr.label && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{addr.addressLine1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close Action Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Coder Cafe Luxury Mobile Build</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
