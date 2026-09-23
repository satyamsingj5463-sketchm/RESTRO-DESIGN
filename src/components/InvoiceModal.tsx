import React from 'react';
import { X, Printer, Coffee, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Modal Top Actions */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tax Invoice (GST Compliant)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
              PAID IN FULL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Coffee className="w-4 h-4" />
                </div>
                <h1 className="font-sans text-xl font-extrabold tracking-tight text-slate-900">
                  CODER <span className="text-amber-600">CAFE</span>
                </h1>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Coder Cafe Gourmet Kitchens Ltd.<br />
                DLF Cyber City, Sector 24, Cyber Hub, Gurugram 122002<br />
                <strong>GSTIN:</strong> 06AABCC9240M1ZS • FSSAI Lic: 10822005000123
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-black text-slate-900 block">
                INVOICE #{order.orderNumber}
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </span>
              <span className="text-slate-500 text-[11px] block">
                Time: {new Date(order.createdAt).toLocaleTimeString('en-IN')}
              </span>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To Customer
              </span>
              <div className="font-bold text-slate-800 text-xs">{order.customer.name}</div>
              <div className="text-slate-500 text-[11px]">{order.customer.email}</div>
              <div className="text-slate-500 text-[11px] font-mono">{order.customer.phone}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Delivery Address
              </span>
              <div className="font-bold text-slate-800 text-xs">{order.customer.address.label}</div>
              <div className="text-slate-500 text-[11px] leading-tight">
                {order.customer.address.addressLine1}<br />
                {order.customer.address.city}, {order.customer.address.postalCode}
              </div>
            </div>
          </div>

          {/* Itemized Table in INR */}
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] uppercase font-bold text-slate-500">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it) => (
                  <tr key={it.cartItemId} className="text-xs">
                    <td className="py-2.5">
                      <span className="font-bold text-slate-800 block">{it.menuItem.name}</span>
                      {it.selectedOptions.length > 0 && (
                        <span className="text-[10px] text-slate-500 block">
                          {it.selectedOptions.map((o) => o.optionName).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">
                      ₹{it.menuItem.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{it.itemTotalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation in INR */}
          <div className="border-t-2 border-slate-900 pt-3 space-y-1.5 max-w-xs ml-auto text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal:</span>
              <span className="font-mono">₹{order.pricing.subtotal.toFixed(2)}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon ({order.pricing.promoCode || 'DISCOUNT'}):</span>
                <span className="font-mono">-₹{order.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Partner Fee:</span>
              <span className="font-mono">
                {order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee:</span>
              <span className="font-mono">₹{order.pricing.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5% CGST + SGST):</span>
              <span className="font-mono">₹{order.pricing.gstTax.toFixed(2)}</span>
            </div>
            {order.pricing.tip > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Delivery Partner Tip:</span>
                <span className="font-mono">₹{order.pricing.tip.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-amber-600">
                ₹{order.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment & Security Footnote */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Paid via <strong>{order.payment.method.toUpperCase()}</strong> (Txn: {order.payment.transactionId})
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Authenticated Order</span>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
            Thank you for ordering with Coder Cafe! For any queries, write to support@codercafe.in
          </div>
        </div>
      </div>
    </div>
  );
};
