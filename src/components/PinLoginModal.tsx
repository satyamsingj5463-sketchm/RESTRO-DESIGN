import React, { useState } from 'react';
import { Shield, X, CheckCircle, AlertCircle, Eye, EyeOff, Lock, ChefHat, Bike } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: 'staff' | 'admin' | 'rider';
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({ isOpen, onClose, targetRole }) => {
  const { verifyPin } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) return;
    const success = verifyPin(pin.trim(), targetRole);
    if (success) {
      setPin('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  const getRoleMeta = () => {
    switch (targetRole) {
      case 'admin':
        return {
          title: 'Management Console',
          subtitle: 'Authorized Administrator Authentication',
          icon: Shield,
          iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
        };
      case 'staff':
        return {
          title: 'Kitchen Staff Portal',
          subtitle: 'KDS & Prep Station Authentication',
          icon: ChefHat,
          iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
        };
      case 'rider':
        return {
          title: 'Rider Delivery Hub',
          subtitle: 'Fleet Navigation & Dispatch Access',
          icon: Bike,
          iconBg: 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
        };
      default:
        return {
          title: 'Restricted Portal Access',
          subtitle: 'Security PIN Authentication',
          icon: Lock,
          iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
        };
    }
  };

  const meta = getRoleMeta();
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-900 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {meta.title}
            </h3>
            <p className="text-xs text-slate-500">{meta.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
              Security PIN / Password
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="••••••"
                autoFocus
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-center text-xl tracking-[0.3em] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPin ? 'Hide Password' : 'Show Password'}
                aria-label={showPin ? 'Hide Password' : 'Show Password'}
              >
                {showPin ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {error && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Incorrect credentials. Please verify your PIN.</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={!pin.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
