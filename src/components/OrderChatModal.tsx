import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ChefHat, Bike, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, ChatMessage } from '../types';

interface OrderChatModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderChatModal: React.FC<OrderChatModalProps> = ({ order, isOpen, onClose }) => {
  const { chatMessages, sendMessage, role, user } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = order ? chatMessages[order.id] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen || !order) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    let sender: ChatMessage['sender'] = 'customer';
    if (role === 'staff') sender = 'kitchen';
    else if (role === 'rider') sender = 'rider';

    await sendMessage(order.id, sender, inputText);
    setInputText('');
  };

  const quickReplies = [
    'Please add extra napkins & ketchup',
    'Rider, please leave package at the main door',
    'How long until ready?',
    'Thank you so much!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg h-[600px] max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-indigo-950/20 flex items-center justify-between bg-gradient-to-r from-[#1E1B4B] via-[#2A2368] to-[#1E1B4B] text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                <ChefHat className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1E1B4B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Coder Cafe Order Chat</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono font-bold">
                  #{order.orderNumber}
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Connected with Kitchen & Rider {order.rider?.name || 'Alex'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Encrypted in-app delivery channel
          </span>
          <span className="font-mono text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Active
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <p className="text-xs">No messages yet. Send a note to the kitchen or delivery rider!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe =
                (role === 'customer' && msg.sender === 'customer') ||
                (role === 'staff' && msg.sender === 'kitchen') ||
                (role === 'rider' && msg.sender === 'rider');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
                    {msg.sender === 'kitchen' && <ChefHat className="w-3 h-3 text-amber-600" />}
                    {msg.sender === 'rider' && <Bike className="w-3 h-3 text-sky-600" />}
                    {msg.sender === 'customer' && <User className="w-3 h-3 text-emerald-600" />}
                    <span className="font-semibold">{msg.senderName}</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-amber-400 text-slate-950 font-bold rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(order.id, 'customer', qr)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to kitchen or rider..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
