import { MenuItem, ReviewItem, DeliveryAddress } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Artisan Double Espresso',
    codeName: 'CODER_ESPRESSO',
    description: 'Ultra-concentrated double shot of dark roasted Chikmagalur single-origin beans. Bold, full-bodied with notes of dark cacao and hazelnut.',
    price: 120,
    originalPrice: 150,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 142,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    tags: ['Single Origin', 'Zero Sugar', 'Dark Roast'],
    customizationGroups: [
      {
        id: 'shots',
        title: 'Espresso Strength',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'sh1', name: 'Standard Double Shot (60ml)', price: 0 },
          { id: 'sh2', name: 'Triple Shot (+30ml)', price: 40 },
          { id: 'sh3', name: 'Quadruple Shot Booster', price: 70 }
        ]
      },
      {
        id: 'sweetener',
        title: 'Sweetener & Flavor',
        minSelect: 0,
        maxSelect: 2,
        options: [
          { id: 'sw1', name: 'Raw Demerara Sugar', price: 0 },
          { id: 'sw2', name: 'Vanilla Bean Extract', price: 30 },
          { id: 'sw3', name: 'Hazelnut Gourmet Syrup', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'm2',
    name: 'Async Cold Brew with Oat Foam',
    codeName: 'ASYNC_COLD_BREW',
    description: 'Steeped for 20 hours in cold-filtered mountain spring water, crowned with silky whipped vanilla oat cream.',
    price: 180,
    originalPrice: 220,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 98,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 4,
    tags: ['Slow Brewed', 'Vegan Friendly', 'Chilled'],
    customizationGroups: [
      {
        id: 'ice',
        title: 'Ice Level',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'ic1', name: 'Standard Chilled Ice', price: 0 },
          { id: 'ic2', name: 'Less Ice (More Cold Brew)', price: 20 },
          { id: 'ic3', name: 'No Ice', price: 20 }
        ]
      },
      {
        id: 'milk_type',
        title: 'Milk Foam Choice',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'mk1', name: 'Oat Milk Velvety Foam', price: 0 },
          { id: 'mk2', name: 'Almond Milk Cream', price: 25 },
          { id: 'mk3', name: 'Salted Caramel Silk Cream', price: 35 }
        ]
      }
    ]
  },
  {
    id: 'm3',
    name: 'Salted Caramel Latte Macchiato',
    codeName: 'CARAMEL_LATTE',
    description: 'Steamed creamy whole milk marked with bold espresso shots, layered with warm artisanal salted caramel drizzle.',
    price: 195,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 86,
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 6,
    tags: ['Warm Comfort', 'Artisan Caramel'],
    customizationGroups: [
      {
        id: 'temp',
        title: 'Serving Style',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'tp1', name: 'Steaming Hot', price: 0 },
          { id: 'tp2', name: 'Iced & Shaken', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'm4',
    name: 'Crispy Paneer Tikka Burger',
    codeName: 'PANEER_TIKKA_BURGER',
    description: 'Thick marinated cottage cheese steak crisped in tandoori spices, mint coriander aioli, crunchy laccha onions on toasted brioche.',
    price: 220,
    originalPrice: 260,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 224,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 14,
    tags: ['Tandoori Spiced', 'Fresh Paneer', 'Chef Special'],
    customizationGroups: [
      {
        id: 'cheese',
        title: 'Cheese & Fillings',
        minSelect: 0,
        maxSelect: 2,
        options: [
          { id: 'ch1', name: 'Melted Cheddar Slice', price: 35 },
          { id: 'ch2', name: 'Extra Smoky Tandoori Dip', price: 25 },
          { id: 'ch3', name: 'Spicy Jalapeno Slices', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'm5',
    name: 'Royal Chicken Smashed Burger',
    codeName: 'ROYAL_CHICKEN_BURGER',
    description: 'Double hand-smashed minced chicken patties, smoked gouda, habanero chipotle slaw, grilled onions on buttered brioche.',
    price: 260,
    originalPrice: 295,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 178,
    isVeg: false,
    isBestseller: true,
    isSpicy: true,
    isAvailable: true,
    prepTimeMinutes: 15,
    tags: ['Double Patty', 'Signature Smoked', 'Crisp Bacon Option'],
    customizationGroups: [
      {
        id: 'spice',
        title: 'Heat Level',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'sp1', name: 'Mild & Herb Infused', price: 0 },
          { id: 'sp2', name: 'Medium Chipotle Spice', price: 0 },
          { id: 'sp3', name: 'Extra Hot Peri-Peri Kick 🔥', price: 15 }
        ]
      },
      {
        id: 'addons',
        title: 'Gourmet Add-ons',
        minSelect: 0,
        maxSelect: 2,
        options: [
          { id: 'ad1', name: 'Fried Farm-Fresh Egg', price: 30 },
          { id: 'ad2', name: 'Extra Melted Cheddar', price: 35 }
        ]
      }
    ]
  },
  {
    id: 'm6',
    name: 'Crispy Butter-Garlic Veggie Burger',
    codeName: 'VEGGIE_DELUXE_BURGER',
    description: 'Golden quinoa, sweet corn, and crisp garden vegetable patty, garlic truffle mayo, crisp lettuce on artisanal multigrain bun.',
    price: 190,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 112,
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    prepTimeMinutes: 12,
    tags: ['Pure Veg', 'Multigrain Bun', 'Light & Fresh']
  },
  {
    id: 'm7',
    name: 'Artisan Wood-Fired Margherita Pizza',
    codeName: 'MARGHERITA_PIZZA',
    description: 'Neapolitan style 48-hr fermented sourdough crust, San Marzano tomato sauce, fresh bocconcini mozzarella, sweet basil, extra virgin olive oil.',
    price: 340,
    originalPrice: 390,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 164,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 18,
    tags: ['Wood-Fired', 'Fresh Mozzarella', 'Authentic Crust'],
    customizationGroups: [
      {
        id: 'crust',
        title: 'Crust Style',
        minSelect: 1,
        maxSelect: 1,
        options: [
          { id: 'cr1', name: 'Classic Thin Neapolitan Crust', price: 0 },
          { id: 'cr2', name: 'Cheese Burst Edge', price: 65 },
          { id: 'cr3', name: 'Herb & Garlic Stuffed Crust', price: 55 }
        ]
      }
    ]
  },
  {
    id: 'm8',
    name: 'Smoked Chicken & BBQ Pizza',
    codeName: 'BBQ_CHICKEN_PIZZA',
    description: 'Tender tandoori chicken tikka cubes, smoky BBQ swirl, charred red bell peppers, mozzarella, and sprinkled oregano.',
    price: 380,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 195,
    isVeg: false,
    isSpicy: true,
    isAvailable: true,
    prepTimeMinutes: 18,
    tags: ['Smoked Chicken', 'BBQ Glaze', 'Top Pick']
  },
  {
    id: 'm9',
    name: 'Peri-Peri Crinkle Fries with Truffle Dip',
    codeName: 'PERI_PERI_FRIES',
    description: 'Golden triple-cooked potato fries dusted in aromatic African birds eye chili spice mix, served with velvety garlic aioli.',
    price: 140,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 310,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 8,
    tags: ['Crispy Hot', 'Peri-Peri Masala', 'Crowd Favorite']
  },
  {
    id: 'm10',
    name: 'Loaded Cheesy Nachos Supreme',
    codeName: 'CHEESY_NACHOS',
    description: 'Crisp stone-ground corn tortilla crisps layered with molten queso blanco, refried beans, pico de gallo, fresh guacamole, sliced jalapeños.',
    price: 210,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 140,
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 10,
    tags: ['Shareable Plate', 'Fresh Guacamole', 'Extra Cheesy']
  },
  {
    id: 'm11',
    name: 'Molten Belgian Chocolate Brownie',
    codeName: 'LAVA_BROWNIE',
    description: 'Warm fudge cake with flowing Belgian dark chocolate center, topped with creamy vanilla bean ice cream and toasted almond flakes.',
    price: 160,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 205,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 7,
    tags: ['Warm Center', 'Vanilla Scoop', 'Pure Indulgence']
  },
  {
    id: 'm12',
    name: 'Developers Night Feast Combo',
    codeName: 'NIGHT_FEAST_COMBO',
    description: 'Complete meal box: 1x Paneer Tikka or Chicken Burger + 1x Peri-Peri Fries + 1x Cold Brew Coffee + 1x Chocolate Lava Bite.',
    price: 449,
    originalPrice: 560,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 380,
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    prepTimeMinutes: 16,
    tags: ['Best Value', 'Save 25%', 'Complete Box']
  }
];

// Real Customer Reviews (Loaded strictly from Firestore reviews collection)
export const INITIAL_REVIEWS: ReviewItem[] = [];

export const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    label: 'Office',
    addressLine1: 'Tower 4B, 7th Floor, DLF Cyber City',
    addressLine2: 'Tech Park Zone, Phase 3',
    landmark: 'Opposite Cyber Hub Metro Station',
    city: 'Gurugram',
    postalCode: '122002',
    lat: 28.4952,
    lng: 77.0891,
    instructions: 'Drop off at Tower 4B security reception desk.'
  },
  {
    label: 'Home',
    addressLine1: 'Flat 402, Oakwood Heights, 100ft Road',
    addressLine2: 'Indiranagar 1st Stage',
    landmark: 'Near Metro Pillar 114',
    city: 'Bengaluru',
    postalCode: '560038',
    lat: 12.9716,
    lng: 77.5946,
    instructions: 'Leave with security guard or ring door bell.'
  },
  {
    label: 'Campus',
    addressLine1: 'B-Block Innovation Incubator, Hitech City',
    addressLine2: 'Main Tech Campus',
    landmark: 'Behind Bio-Diversity Park',
    city: 'Hyderabad',
    postalCode: '500081',
    lat: 17.4435,
    lng: 78.3772,
    instructions: 'Call on mobile arrival at Gate 2.'
  }
];

export const PROMO_CODES: Record<string, { discountPercent?: number; fixedDiscount?: number; minOrder: number; desc: string }> = {
  'TASTY50': {
    discountPercent: 50,
    minOrder: 199,
    desc: 'Grand Opening: 50% Off (up to ₹100) on orders above ₹199'
  },
  'FREEDEL': {
    fixedDiscount: 35,
    minOrder: 249,
    desc: 'Free Express Delivery: ₹35 discount on delivery charges'
  },
  'FEAST20': {
    discountPercent: 20,
    minOrder: 399,
    desc: 'Party Feast: 20% Off on orders above ₹399'
  }
};
