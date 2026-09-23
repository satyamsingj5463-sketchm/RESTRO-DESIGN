import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  OrderStatus,
  UserRole,
  DeliveryAddress,
  ReviewItem,
  ChatMessage
} from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_REVIEWS, DEFAULT_ADDRESSES, PROMO_CODES } from '../lib/initialData';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { sounds } from '../lib/soundEffects';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface AppContextType {
  // Role & Auth
  role: UserRole;
  setRole: (role: UserRole) => void;
  staffAuthenticated: boolean;
  adminAuthenticated: boolean;
  verifyPin: (pin: string, targetRole: 'staff' | 'admin') => boolean;
  logoutRole: () => void;

  // User Profile
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    loyaltyPoints: number;
    tier: string;
  };
  updateUserProfile: (data: Partial<{ name: string; email: string; phone: string }>) => void;
  addresses: DeliveryAddress[];
  currentAddress: DeliveryAddress;
  setCurrentAddress: (addr: DeliveryAddress) => void;
  addAddress: (addr: DeliveryAddress) => void;

  // Menu & Catalog
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => Promise<void>;
  toggleItemStock: (itemId: string, available: boolean) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterVegOnly: boolean;
  setFilterVegOnly: (val: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number, options?: CartItem['selectedOptions'], specialInstructions?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  appliedPromo: string | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  deliverySchedule: 'immediate' | string;
  setDeliverySchedule: (sched: 'immediate' | string) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (paymentMethod: Order['payment']['method']) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  rateOrder: (orderId: string, foodStars: number, deliveryStars: number, comment?: string) => Promise<void>;

  // Reviews
  reviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, 'id' | 'date'>) => Promise<void>;
  toggleReviewStatus: (reviewId: string) => Promise<void>;

  // Chat
  chatMessages: Record<string, ChatMessage[]>;
  sendMessage: (orderId: string, sender: ChatMessage['sender'], text: string) => Promise<void>;

  // Rider simulation
  updateRiderLocation: (orderId: string, progressPct: number) => Promise<void>;

  // UI / App state
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  toasts: Toast[];
  addToast: (title: string, message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  offlineMode: boolean;
  setOfflineMode: (val: boolean) => void;
  language: 'en' | 'hi' | 'es';
  setLanguage: (lang: 'en' | 'hi' | 'es') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role
  const [role, setRole] = useState<UserRole>('customer');
  const [staffAuthenticated, setStaffAuthenticated] = useState<boolean>(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(false);

  // User details
  const [user, setUser] = useState({
    id: 'user-coder-1',
    name: 'Satyam Singh',
    email: 'satyam.singh@codercafe.dev',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    loyaltyPoints: 640,
    tier: 'Tech Lead (Level 3)'
  });

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(DEFAULT_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<DeliveryAddress>(DEFAULT_ADDRESSES[0]);

  // Menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>('TASTY50');
  const [tipAmount, setTipAmount] = useState<number>(30);
  const [deliverySchedule, setDeliverySchedule] = useState<'immediate' | string>('immediate');

  // Initial Demo Order for accurate initial state
  const INITIAL_DEMO_ORDER: Order = {
    id: 'ord-101',
    orderNumber: 'CC-4180',
    createdAt: Date.now() - 1000 * 60 * 14,
    status: 'out_for_delivery',
    customer: {
      id: 'user-coder-1',
      name: 'Satyam Singh',
      phone: '+91 98765 43210',
      email: 'satyam.singh@codercafe.dev',
      address: DEFAULT_ADDRESSES[0]
    },
    items: [
      {
        cartItemId: 'm4-cheese',
        menuItem: INITIAL_MENU_ITEMS[3] || INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedOptions: [{ groupTitle: 'Cheese & Fillings', optionName: 'Melted Cheddar Slice', price: 35 }],
        itemTotalPrice: 255
      },
      {
        cartItemId: 'm2-standard',
        menuItem: INITIAL_MENU_ITEMS[1] || INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedOptions: [{ groupTitle: 'Milk Foam Choice', optionName: 'Oat Milk Velvety Foam', price: 0 }],
        itemTotalPrice: 180
      }
    ],
    pricing: {
      subtotal: 435,
      discount: 100,
      promoCode: 'TASTY50',
      deliveryFee: 0,
      platformFee: 5.0,
      gstTax: 16.75,
      tip: 30,
      total: 386.75
    },
    payment: {
      method: 'upi',
      status: 'paid',
      transactionId: 'UPI-IND-894726190'
    },
    rider: {
      id: 'rider-alex',
      name: 'Alex "Torvalds" Chen',
      phone: '+91 98112 23344',
      vehicle: 'Hero Electric (Matte Black)',
      plateNumber: 'KA-03-EK-4040',
      rating: 4.96,
      currentLocation: {
        lat: 28.4952,
        lng: 77.0891,
        progressPct: 65
      },
      estimatedMinutes: 8
    },
    notes: 'Please ring bell upon arrival. Handle food package with care!'
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>([INITIAL_DEMO_ORDER]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(INITIAL_DEMO_ORDER.id);

  // Reviews
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  // Live order chat messages
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  // UI state
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'es'>('en');

  const addToast = useCallback((title: string, message: string, type: Toast['type'] = 'info') => {
    const newToast: Toast = {
      id: 'toast-' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    sounds.playNotification();

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Seed / Sync Menu with Firebase
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    try {
      const menuRef = collection(db, 'menu_items');
      unsubscribe = onSnapshot(
        menuRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: MenuItem[] = [];
            snapshot.forEach((docSnap) => {
              items.push(docSnap.data() as MenuItem);
            });
            setMenuItems(items);
          } else {
            // First time seed initial items
            INITIAL_MENU_ITEMS.forEach(async (item) => {
              try {
                await setDoc(doc(db, 'menu_items', item.id), item);
              } catch (e) {
                console.warn('Initial seed error:', e);
              }
            });
          }
        },
        (error) => {
          console.warn('Firestore menu snapshot error, falling back to local dataset:', error);
        }
      );
    } catch (err) {
      console.warn('Firestore connection warning:', err);
    }
    return () => unsubscribe();
  }, []);

  // Sync Orders with Firebase
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            fetchedOrders.push(docSnap.data() as Order);
          });
          if (fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
          }
        },
        (err) => {
          console.warn('Firestore orders sync error:', err);
        }
      );
    } catch (e) {
      console.warn('Firestore orders listener error:', e);
    }
    return () => unsubscribe();
  }, []);

  // Sync Reviews with Firebase
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    try {
      const revRef = collection(db, 'reviews');
      unsubscribe = onSnapshot(
        revRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: ReviewItem[] = [];
            snapshot.forEach((docSnap) => fetched.push(docSnap.data() as ReviewItem));
            setReviews(fetched);
          } else {
            // Seed initial reviews
            INITIAL_REVIEWS.forEach(async (rev) => {
              try {
                await setDoc(doc(db, 'reviews', rev.id), rev);
              } catch {
                // Ignore seed error
              }
            });
          }
        },
        (err) => console.warn('Reviews snapshot error:', err)
      );
    } catch (e) {
      console.warn('Reviews listener init error:', e);
    }
    return () => unsubscribe();
  }, []);

  // PIN Verification (Customer can enter Admin or Staff with PIN: 1616)
  const verifyPin = (pin: string, targetRole: 'staff' | 'admin'): boolean => {
    if (pin === '1616') {
      if (targetRole === 'staff') {
        setStaffAuthenticated(true);
        setRole('staff');
        addToast('Staff Access Granted', 'Authenticated into Kitchen Display System.', 'success');
      } else {
        setAdminAuthenticated(true);
        setRole('admin');
        addToast('Admin Access Granted', 'Authenticated into Management Control Center.', 'success');
      }
      return true;
    }
    addToast('Access Denied', 'Invalid security PIN entered.', 'error');
    return false;
  };

  const logoutRole = () => {
    setRole('customer');
    addToast('Switched to Customer Mode', 'You are now viewing Coder Cafe as a food lover.', 'info');
  };

  const updateUserProfile = (data: Partial<{ name: string; email: string; phone: string }>) => {
    setUser((prev) => ({ ...prev, ...data }));
    addToast('Profile Updated', 'Your contact details have been saved.', 'success');
  };

  const addAddress = (addr: DeliveryAddress) => {
    setAddresses((prev) => [addr, ...prev]);
    setCurrentAddress(addr);
    addToast('Address Added', `Set ${addr.label} as active delivery point.`, 'success');
  };

  // Cart actions
  const addToCart = (
    item: MenuItem,
    qty = 1,
    options: CartItem['selectedOptions'] = [],
    specialInstructions = ''
  ) => {
    const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
    const itemTotal = (item.price + optionsTotal) * qty;

    const cartItemId = `${item.id}-${options.map((o) => o.optionName).sort().join('_')}-${specialInstructions}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + qty;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemTotalPrice: (item.price + optionsTotal) * newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity: qty,
            selectedOptions: options,
            specialInstructions,
            itemTotalPrice: itemTotal
          }
        ];
      }
    });

    sounds.playCartAdd();
    addToast('Added to Cart', `${qty}x ${item.name} added.`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const optionsTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0);
            return {
              ...item,
              quantity: newQty,
              itemTotalPrice: (item.menuItem.price + optionsTotal) * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.itemTotalPrice, 0);

  // Promo Code calculations
  let promoDiscount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (cartSubtotal >= promo.minOrder) {
      if (promo.discountPercent) {
        // TASTY50 capped at ₹100, others percentage
        const raw = (cartSubtotal * promo.discountPercent) / 100;
        promoDiscount = appliedPromo === 'TASTY50' ? Math.min(100, raw) : raw;
      } else if (promo.fixedDiscount) {
        promoDiscount = Math.min(promo.fixedDiscount, cartSubtotal);
      }
    }
  }

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (PROMO_CODES[clean]) {
      const promo = PROMO_CODES[clean];
      if (cartSubtotal < promo.minOrder) {
        return {
          success: false,
          message: `Minimum order for code ${clean} is ₹${promo.minOrder}`
        };
      }
      setAppliedPromo(clean);
      return { success: true, message: `Promo coupon ${clean} applied successfully!` };
    }
    return { success: false, message: 'Invalid promo coupon code. Try TASTY50 or FREEDEL' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Create Order with exact INR formula
  const createOrder = async (paymentMethod: Order['payment']['method']): Promise<Order> => {
    // Free delivery on orders ₹399 and above, otherwise ₹35 standard delivery fee
    const deliveryFee = cartSubtotal >= 399 ? 0 : 35;
    const platformFee = 5.00;
    const taxableAmount = Math.max(0, cartSubtotal - promoDiscount);
    // 5% GST on food services in India
    const gstTax = Math.round(taxableAmount * 0.05 * 100) / 100;
    const total = Math.max(0, Math.round((taxableAmount + deliveryFee + platformFee + gstTax + tipAmount) * 100) / 100);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'CC-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: Date.now(),
      scheduledFor: deliverySchedule,
      status: 'placed',
      customer: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: currentAddress
      },
      items: [...cart],
      pricing: {
        subtotal: cartSubtotal,
        discount: promoDiscount,
        promoCode: appliedPromo || undefined,
        deliveryFee,
        platformFee,
        gstTax,
        tip: tipAmount,
        total
      },
      payment: {
        method: paymentMethod,
        status: 'paid',
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        cardLast4: paymentMethod === 'card' ? '4242' : undefined
      },
      rider: {
        id: 'rider-alex',
        name: 'Alex "Torvalds" Chen',
        phone: '+91 98112 23344',
        vehicle: 'Hero Electric (Matte Black)',
        plateNumber: 'KA-03-EK-4040',
        rating: 4.96,
        currentLocation: {
          lat: currentAddress.lat,
          lng: currentAddress.lng,
          progressPct: 5
        },
        estimatedMinutes: 20
      },
      notes: 'Please ring bell upon arrival. Handle food package with care!'
    };

    // Update local state first
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();

    // Reward loyalty points
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(total * 10)
    }));

    sounds.playOrderSuccess();
    addToast('Order Placed Successfully! 🎉', `Order #${newOrder.orderNumber} sent to Coder Cafe kitchen.`, 'success');

    // Save to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Could not write order to Firestore, saved in local state:', e);
    }

    // Initialize greeting message in chat
    const initialChat: ChatMessage = {
      id: 'msg-' + Date.now(),
      orderId: newOrder.id,
      sender: 'kitchen',
      senderName: 'Coder Cafe Kitchen',
      text: `Hello ${user.name}! Your order #${newOrder.orderNumber} has been received by our head chef. We are preparing it fresh!`,
      timestamp: Date.now()
    };
    setChatMessages((prev) => ({
      ...prev,
      [newOrder.id]: [initialChat]
    }));

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          // If out for delivery, set progress to 25%
          if (newStatus === 'out_for_delivery' && updated.rider) {
            updated.rider = {
              ...updated.rider,
              currentLocation: {
                ...updated.rider.currentLocation,
                progressPct: 35
              },
              estimatedMinutes: 12
            };
          } else if (newStatus === 'delivered' && updated.rider) {
            updated.rider = {
              ...updated.rider,
              currentLocation: {
                ...updated.rider.currentLocation,
                progressPct: 100
              },
              estimatedMinutes: 0
            };
          }
          return updated;
        }
        return ord;
      })
    );

    const statusLabels: Record<OrderStatus, string> = {
      placed: 'Order Placed',
      preparing: 'Kitchen is Cooking 🔥',
      ready: 'Order Packed & Ready 📦',
      out_for_delivery: 'Out for Delivery 🛵',
      delivered: 'Delivered! Bon Appétit ✨',
      cancelled: 'Order Cancelled'
    };

    addToast('Order Status Updated', statusLabels[newStatus] || newStatus, 'info');

    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (e) {
      console.warn('Error updating order in Firestore:', e);
    }
  };

  const updateRiderLocation = async (orderId: string, progressPct: number) => {
    const estMin = Math.max(0, Math.round(20 * (1 - progressPct / 100)));
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.rider) {
          return {
            ...ord,
            rider: {
              ...ord.rider,
              currentLocation: {
                ...ord.rider.currentLocation,
                progressPct
              },
              estimatedMinutes: estMin
            }
          };
        }
        return ord;
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        'rider.currentLocation.progressPct': progressPct,
        'rider.estimatedMinutes': estMin
      });
    } catch {
      // Ignore
    }
  };

  const rateOrder = async (orderId: string, foodStars: number, deliveryStars: number, comment?: string) => {
    const ratingObj = {
      foodStars,
      deliveryStars,
      comment,
      createdAt: Date.now()
    };

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ratings: ratingObj } : ord))
    );

    if (comment && comment.trim().length > 0) {
      const newReview: ReviewItem = {
        id: 'rev-' + Date.now(),
        orderId,
        customerName: user.name,
        rating: foodStars,
        comment,
        date: 'Just now',
        status: 'published'
      };
      setReviews((prev) => [newReview, ...prev]);
      try {
        await setDoc(doc(db, 'reviews', newReview.id), newReview);
      } catch {
        // Ignore
      }
    }

    addToast('Thank You for the Review!', 'Your feedback helps Coder Cafe keep improving.', 'success');

    try {
      await updateDoc(doc(db, 'orders', orderId), { ratings: ratingObj });
    } catch (e) {
      console.warn('Error saving rating:', e);
    }
  };

  // Menu management (Admin / Staff)
  const updateMenuItem = async (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    addToast('Menu Item Updated', `${item.name} details saved.`, 'success');
    try {
      await setDoc(doc(db, 'menu_items', item.id), item);
    } catch (e) {
      console.warn('Error updating menu item in Firestore:', e);
    }
  };

  const toggleItemStock = async (itemId: string, available: boolean) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, isAvailable: available } : m))
    );
    addToast(
      available ? 'Item Back In Stock' : 'Item Marked Out of Stock (86)',
      `Updated availability.`,
      'info'
    );
    try {
      await updateDoc(doc(db, 'menu_items', itemId), { isAvailable: available });
    } catch {
      // Ignore
    }
  };

  const addMenuItem = async (newItem: Omit<MenuItem, 'id'>) => {
    const id = 'm-' + Date.now();
    const completeItem: MenuItem = { ...newItem, id };
    setMenuItems((prev) => [completeItem, ...prev]);
    addToast('Dish Created', `${completeItem.name} is now on the menu!`, 'success');
    try {
      await setDoc(doc(db, 'menu_items', id), completeItem);
    } catch (e) {
      console.warn('Error saving new item:', e);
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    addToast('Item Removed', 'Dish deleted from catalog.', 'info');
  };

  // Reviews
  const addReview = async (newRev: Omit<ReviewItem, 'id' | 'date'>) => {
    const rev: ReviewItem = {
      ...newRev,
      id: 'rev-' + Date.now(),
      date: 'Just now'
    };
    setReviews((prev) => [rev, ...prev]);
    addToast('Review Submitted', 'Thank you for sharing your experience!', 'success');
    try {
      await setDoc(doc(db, 'reviews', rev.id), rev);
    } catch {
      // Ignore
    }
  };

  const toggleReviewStatus = async (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: r.status === 'published' ? 'hidden' : 'published' } : r
      )
    );
    addToast('Review Visibility Toggled', 'Moderation status updated.', 'info');
  };

  // Chat
  const sendMessage = async (orderId: string, sender: ChatMessage['sender'], text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: 'msg-' + Date.now(),
      orderId,
      sender,
      senderName:
        sender === 'customer'
          ? user.name
          : sender === 'kitchen'
          ? 'Coder Cafe Kitchen'
          : 'Alex (Rider)',
      text: text.trim(),
      timestamp: Date.now()
    };

    setChatMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), msg]
    }));

    sounds.playNotification();

    // If customer sent a message, simulate smart instant kitchen or rider reply after 1.5s
    if (sender === 'customer') {
      setTimeout(() => {
        let replyText = "Received! We've noted that for your order.";
        const lower = text.toLowerCase();
        if (lower.includes('extra') || lower.includes('napkin') || lower.includes('sauce')) {
          replyText = "Got it! Adding extra packets and napkins right into your bag.";
        } else if (lower.includes('fast') || lower.includes('hurry') || lower.includes('eta') || lower.includes('when')) {
          replyText = "Kitchen is finishing up plating now. Rider will pick it up in 3 minutes!";
        } else if (lower.includes('gate') || lower.includes('door') || lower.includes('bell') || lower.includes('drop')) {
          replyText = "Noted drop-off details! Rider Alex has your delivery instructions on his navigation screen.";
        }

        const kitchenReply: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          orderId,
          sender: 'kitchen',
          senderName: 'Coder Cafe Kitchen',
          text: replyText,
          timestamp: Date.now()
        };

        setChatMessages((prev) => ({
          ...prev,
          [orderId]: [...(prev[orderId] || []), kitchenReply]
        }));
        sounds.playNotification();
      }, 1200);
    }
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        staffAuthenticated,
        adminAuthenticated,
        verifyPin,
        logoutRole,
        user,
        updateUserProfile,
        addresses,
        currentAddress,
        setCurrentAddress,
        addAddress,
        menuItems,
        updateMenuItem,
        toggleItemStock,
        addMenuItem,
        deleteMenuItem,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filterVegOnly,
        setFilterVegOnly,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        appliedPromo,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        tipAmount,
        setTipAmount,
        deliverySchedule,
        setDeliverySchedule,
        orders,
        activeOrder,
        setActiveOrder: (ord) => setActiveOrderId(ord ? ord.id : null),
        createOrder,
        updateOrderStatus,
        rateOrder,
        reviews,
        addReview,
        toggleReviewStatus,
        chatMessages,
        sendMessage,
        updateRiderLocation,
        isMobileFrame,
        setIsMobileFrame,
        isCartOpen,
        setIsCartOpen,
        toasts,
        addToast,
        dismissToast,
        offlineMode,
        setOfflineMode,
        language,
        setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
