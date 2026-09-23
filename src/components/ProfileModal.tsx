import React, { useState } from 'react';
import {
  X,
  User,
  Award,
  MapPin,
  FileText,
  RotateCcw,
  Plus,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoice: (order: Order) => void;
  onSelectActiveOrder: (order: Order) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenInvoice,
  onSelectActiveOrder
}) => {
  const { user, updateUserProfile, orders, addresses, addAddress, setCurrentAddress, currentAddress, addToCart, setIsCartOpen } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  // Add address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Office' | 'Campus' | 'Other'>('Home');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Gurugram');
  const [newZip, setNewZip] = useState('122002');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setIsEditing(false);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim()) return;

    addAddress({
      label: newLabel,
      addressLine1: newLine1.trim(),
      city: newCity,
      postalCode: newZip,
      lat: 28.4595,
      lng: 77.0266
    });

    setIsAddingAddress(false);
    setNewLine1('');
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((it) => {
      addToCart(it.menuItem, it.quantity, it.selectedOptions, it.specialInstructions);
    });
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0D131F] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080C14]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Coder Club Loyalty Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-600/5 to-purple-500/15 border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-mono font-bold text-amber-300">Coder Rewards Club</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-mono">
                {user.tier}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-white">
                {user.loyaltyPoints}{' '}
                <span className="text-xs font-sans font-normal text-amber-300">Byte Points</span>
              </span>
              <span className="text-[11px] text-slate-300">Next tier: CTO at 1000 pts</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(user.loyaltyPoints / 1000) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-300">
              Perks: 10% Byte cashback on all orders + Free express delivery over ₹399.
            </p>
          </div>

          {/* Personal Contact Details */}
          <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Contact Profile
              </h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit Info'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0D131F] border border-white/[0.1] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0D131F] border border-white/[0.1] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0D131F] border border-white/[0.1] rounded-xl text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{user.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Saved Addresses */}
          <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Saved Delivery Addresses
              </h4>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="p-3 bg-[#0D131F] rounded-2xl space-y-2 text-xs border border-white/[0.08]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Label</label>
                    <select
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-[#080C14] border border-white/[0.1] rounded-lg text-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Campus">Campus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">PIN Code</label>
                    <input
                      type="text"
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#080C14] border border-white/[0.1] rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-0.5">Address Line</label>
                  <input
                    type="text"
                    required
                    value={newLine1}
                    onChange={(e) => setNewLine1(e.target.value)}
                    placeholder="Sector, Society, Flat / Desk"
                    className="w-full px-2 py-1.5 bg-[#080C14] border border-white/[0.1] rounded-lg text-white"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="flex-1 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 rounded-lg font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer"
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
                  onClick={() => setCurrentAddress(addr)}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                    currentAddress.label === addr.label
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-[#0D131F] border-white/[0.06] text-slate-300 hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{addr.label}</span>
                        {currentAddress.label === addr.label && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] truncate max-w-[240px]">
                        {addr.addressLine1}, {addr.city}
                      </p>
                    </div>
                  </div>
                  {currentAddress.label === addr.label && <CheckCircle className="w-4 h-4 text-amber-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Past Order History in INR */}
          <div className="p-4 rounded-2xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Past Orders ({orders.length})
            </h4>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No orders recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl bg-[#0D131F] border border-white/[0.06] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">#{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <p className="text-slate-300 truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                      <span className="font-mono font-bold text-amber-400">
                        ₹{ord.pricing.total.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectActiveOrder(ord);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-[11px] cursor-pointer"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => onOpenInvoice(ord)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Bill</span>
                        </button>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
