export type UserRole = 'customer' | 'staff' | 'admin' | 'rider';

export interface MenuItem {
  id: string;
  name: string;
  codeName?: string; // geeky code name e.g. "HOTFIX_ESPRESSO_V2"
  description: string;
  price: number;
  originalPrice?: number;
  category: 'coffee' | 'burgers' | 'pizza' | 'sides' | 'desserts' | 'combos';
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  customizationGroups?: CustomizationGroup[];
  tags: string[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  minSelect: number;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: {
    groupTitle: string;
    optionName: string;
    price: number;
  }[];
  specialInstructions?: string;
  itemTotalPrice: number;
}

export type OrderStatus =
  | 'placed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: number;
  scheduledFor?: string; // 'immediate' or timestamp/time string
  status: OrderStatus;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: DeliveryAddress;
  };
  items: CartItem[];
  pricing: {
    subtotal: number;
    discount: number;
    promoCode?: string;
    deliveryFee: number;
    platformFee: number;
    gstTax: number;
    tip: number;
    total: number;
  };
  payment: {
    method: 'gpay' | 'upi' | 'card' | 'wallet' | 'cod';
    status: 'paid' | 'pending' | 'failed';
    transactionId?: string;
    cardLast4?: string;
  };
  rider?: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
    currentLocation: {
      lat: number;
      lng: number;
      progressPct: number; // 0 to 100
    };
    estimatedMinutes: number;
  };
  notes?: string;
  ratings?: {
    foodStars: number;
    deliveryStars: number;
    comment?: string;
    createdAt: number;
  };
}

export interface DeliveryAddress {
  label: 'Home' | 'Office' | 'Campus' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  instructions?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  sender: 'customer' | 'kitchen' | 'rider' | 'system';
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ReviewItem {
  id: string;
  orderId?: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  dishesOrdered?: string[];
  status: 'published' | 'hidden';
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: DeliveryAddress;
  loginTimestamp: number;
  createdAt: number;
  totalOrders?: number;
}
