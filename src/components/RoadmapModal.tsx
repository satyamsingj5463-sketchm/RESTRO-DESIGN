import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Database,
  Smartphone,
  Cpu,
  CheckCircle2,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-indigo-950/20 flex items-center justify-between bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-bold shadow-sm">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white font-sans tracking-tight">
                  CODER CAFE: Architecture & Compliance Specs
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-mono border border-emerald-400/30 font-bold">
                  Production Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                End-to-end engineering specification, Firestore database schema, role security, and Google Play Store policies
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

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 text-xs leading-relaxed">
          {/* Section 1: Executive Overview */}
          <div className="p-5 rounded-3xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4" /> 1. Project Overview & Role Architecture
            </h3>
            <p className="text-slate-300 text-xs">
              Coder Cafe is architected as an offline-resilient, real-time food delivery ecosystem serving developers, students, and tech hubs with Indian Rupee (₹) pricing and authenticated role access:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3 rounded-2xl bg-[#0D131F] border border-white/[0.06]">
                <span className="text-amber-300 font-bold block mb-1">🍔 Customer Client</span>
                <span className="text-slate-400">Customization, multi-gateway payments (UPI, Cards, GPay, COD), live GPS tracking, in-app chat.</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0D131F] border border-white/[0.06]">
                <span className="text-emerald-300 font-bold block mb-1">👨‍🍳 Kitchen KDS</span>
                <span className="text-slate-400">Real-time order pipeline, status stepper, 86 item inventory toggle.</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0D131F] border border-white/[0.06]">
                <span className="text-purple-300 font-bold block mb-1">⚡ Admin Operations</span>
                <span className="text-slate-400">INR revenue analytics, menu CRUD, reviews moderation, geofence radius settings.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Firestore Database Schema Design */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
                <Database className="w-4 h-4" /> 2. Firebase Firestore Database Schema
              </h3>
              <button
                onClick={() =>
                  handleCopy(
                    `// Firebase Firestore Collections:
1. orders/{orderId}
   - orderNumber: string (e.g. CC-4029)
   - createdAt: number (timestamp)
   - status: 'placed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered'
   - customer: { id, name, phone, email, address: { label, line1, lat, lng } }
   - items: Array<{ menuItemId, quantity, selectedOptions, specialInstructions, itemTotalPrice }>
   - pricing: { subtotal, discount, deliveryFee, platformFee, gstTax, tip, total }
   - payment: { method, status, transactionId, cardLast4 }
   - rider: { id, name, phone, vehicle, currentLocation: { lat, lng, progressPct }, estimatedMinutes }
   - notes: string

2. menu_items/{itemId}
   - name: string
   - codeName: string
   - price: number
   - category: 'coffee' | 'burgers' | 'pizza' | 'sides' | 'desserts' | 'combos'
   - isVeg: boolean
   - isAvailable: boolean
   - prepTimeMinutes: number

3. reviews/{reviewId}
   - customerName: string
   - rating: number (1-5)
   - comment: string
   - status: 'published' | 'hidden'
   - date: string`,
                    'schema'
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer border border-white/[0.08]"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'schema' ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-[#080C14] border border-white/[0.08] font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto">
              <div><strong className="text-amber-300">/orders/{'{orderId}'}</strong>: Real-time synced order documents with sub-second onSnapshot triggers.</div>
              <div><strong className="text-amber-300">/menu_items/{'{itemId}'}</strong>: Dynamic catalog with live stock toggling (isAvailable: true/false).</div>
              <div><strong className="text-amber-300">/reviews/{'{reviewId}'}</strong>: User ratings with moderation status.</div>
              <div><strong className="text-amber-300">/chats/{'{orderId}'}/messages</strong>: 3-way live order communications.</div>
            </div>
          </div>

          {/* Section 3: Google Play Store Compliance */}
          <div className="p-5 rounded-3xl bg-[#080C14] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> 3. Android & Google Play Store Policy Compliance
            </h3>
            <ul className="space-y-2.5 text-slate-300 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Location Transparency:</strong> GPS permissions are requested solely upon user tap with clear in-app rationale explaining delivery address geofencing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Payment & Financial Transactions:</strong> Complies with Google Play Physical Goods policy: external payment providers (UPI, Cards, GPay, COD) allowed with zero Google commission cut.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Privacy & Masking:</strong> Sensitive user credentials, payment details, and security PINs are strictly masked and protected.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: 4-Phase Development Roadmap */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4" /> 4. Development & Deployment Roadmap
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#080C14] border-l-4 border-amber-500 border border-white/[0.06]">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Phase 1: Foundation & Firebase Provisioning</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">COMPLETED ✓</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Provisioned Firebase Firestore database. Initialized seed menus, pricing rules in INR (₹), and security access guards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#080C14] border-l-4 border-blue-500 border border-white/[0.06]">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Phase 2: Ordering Engine, Customization & Payments</span>
                  <span className="text-[10px] text-blue-400 font-mono font-bold">COMPLETED ✓</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Built item option customization, scheduled deliveries, Indian payment options (UPI, GPay, NetBanking, Cards, COD), and promo codes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-purple-500 border border-slate-200">
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Phase 3: Staff KDS & Live GPS Telemetry</span>
                  <span className="text-[10px] text-purple-700 font-mono font-bold">COMPLETED ✓</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Implemented Kitchen KDS portal, 86-inventory stock board, animated SVG delivery tracker map, and Rider companion simulator.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-emerald-500 border border-slate-200">
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Phase 4: Mobile-App Layout, Security & Launch</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">READY FOR LAUNCH</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">
                  Packaged with mobile native navigation bar, masked secure inputs, INR currency parity, and complete GST printable tax invoices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-sm"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
