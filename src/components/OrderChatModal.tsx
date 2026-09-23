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
    'Rider, please leave at door #1616',
    'How long until ready?',
    'Thank you so much!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg h-[600px] max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Coder Cafe Order Chat</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                  #{order.orderNumber}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Connected with Kitchen & Rider {order.rider?.name || 'Alex'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Encrypted in-app delivery channel
          </span>
          <span className="font-mono text-amber-400/90 text-[10px]">Active</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
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
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                    {msg.sender === 'kitchen' && <ChefHat className="w-3 h-3 text-amber-400" />}
                    {msg.sender === 'rider' && <Bike className="w-3 h-3 text-sky-400" />}
                    {msg.sender === 'customer' && <User className="w-3 h-3 text-emerald-400" />}
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
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-md'
                        : 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/80'
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
        <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(order.id, 'customer', qr)}
              className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to kitchen or rider..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
