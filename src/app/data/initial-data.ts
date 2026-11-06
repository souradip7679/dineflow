import { Table } from '../models/table.model';
import { Reservation } from '../models/reservation.model';
import { Dish } from '../models/dish.model';

export function formatDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export const INITIAL_TABLES: Table[] = [
  {
    id: 1,
    number: 'T-01',
    zone: 'Main Dining Room',
    zoneCode: 'main',
    capacity: 2,
    shape: 'round',
    status: 'Available',
    description: 'Intimate candlelit table near the fireplace'
  },
  {
    id: 2,
    number: 'T-02',
    zone: 'Main Dining Room',
    zoneCode: 'main',
    capacity: 2,
    shape: 'square',
    status: 'Occupied',
    description: 'Cozy table with soft lighting and plush seating'
  },
  {
    id: 3,
    number: 'T-03',
    zone: 'Main Dining Room',
    zoneCode: 'main',
    capacity: 4,
    shape: 'square',
    status: 'Reserved',
    description: 'Center dining table with full view of open kitchen'
  },
  {
    id: 4,
    number: 'T-04',
    zone: 'Main Dining Room',
    zoneCode: 'main',
    capacity: 4,
    shape: 'rectangle',
    status: 'Available',
    description: 'Spacious booth with acoustic privacy panels'
  },
  {
    id: 5,
    number: 'T-05',
    zone: 'Garden Terrace',
    zoneCode: 'terrace',
    capacity: 4,
    shape: 'round',
    status: 'Occupied',
    description: 'Verdant garden view under pergola with heating lamps'
  },
  {
    id: 6,
    number: 'T-06',
    zone: 'Garden Terrace',
    zoneCode: 'terrace',
    capacity: 6,
    shape: 'rectangle',
    status: 'Available',
    description: 'Scenic outdoor dining table overlooking fountain'
  },
  {
    id: 7,
    number: 'T-07',
    zone: 'Garden Terrace',
    zoneCode: 'terrace',
    capacity: 2,
    shape: 'round',
    status: 'Cleaning',
    description: 'Romantic terrace edge table under fairy lights'
  },
  {
    id: 8,
    number: 'T-08',
    zone: 'Executive VIP Lounge',
    zoneCode: 'vip',
    capacity: 8,
    shape: 'rectangle',
    status: 'Reserved',
    description: 'Private salon with dedicated sommelier service'
  },
  {
    id: 9,
    number: 'T-09',
    zone: 'Executive VIP Lounge',
    zoneCode: 'vip',
    capacity: 10,
    shape: 'rectangle',
    status: 'Available',
    description: "Chef's table with panoramic tasting kitchen view"
  },
  {
    id: 10,
    number: 'T-10',
    zone: 'Bar & Lounge',
    zoneCode: 'bar',
    capacity: 2,
    shape: 'round',
    status: 'Available',
    description: 'High-top bistro table adjacent to artisan cocktail bar'
  },
  {
    id: 11,
    number: 'T-11',
    zone: 'Bar & Lounge',
    zoneCode: 'bar',
    capacity: 4,
    shape: 'square',
    status: 'Occupied',
    description: 'Lounge banquette seating with craft beer taps nearby'
  },
  {
    id: 12,
    number: 'T-12',
    zone: 'Bar & Lounge',
    zoneCode: 'bar',
    capacity: 6,
    shape: 'rectangle',
    status: 'Available',
    description: 'Relaxed sofa seating for appetizers and pairings'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'DF-1001',
    customerName: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 234-8901',
    date: formatDateOffset(0), // Today
    time: '19:00',
    guests: 2,
    tableId: 2,
    status: 'Confirmed',
    occasion: 'Anniversary',
    specialRequests: 'Window preference or near soft music. Anniversary dessert surprise.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'DF-1002',
    customerName: 'Marcus Sterling',
    email: 'm.sterling@example.com',
    phone: '+1 (555) 456-7890',
    date: formatDateOffset(0), // Today
    time: '20:15',
    guests: 4,
    tableId: 3,
    status: 'Confirmed',
    occasion: 'Business Dinner',
    specialRequests: 'One guest has gluten allergy. Quiet seating requested.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'DF-1003',
    customerName: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    phone: '+1 (555) 345-6712',
    date: formatDateOffset(0), // Today
    time: '18:30',
    guests: 4,
    tableId: 5,
    status: 'Confirmed',
    occasion: 'Birthday',
    specialRequests: 'Terrace garden seating requested. Bringing birthday cake.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'DF-1004',
    customerName: 'Alexander Hayes',
    email: 'alex.hayes@example.com',
    phone: '+1 (555) 789-0123',
    date: formatDateOffset(0), // Today
    time: '21:00',
    guests: 7,
    tableId: 8,
    status: 'Confirmed',
    occasion: 'Family Gathering',
    specialRequests: 'VIP private dining requested with wine pairing menu.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'DF-1005',
    customerName: 'Julian Croft',
    email: 'j.croft@example.com',
    phone: '+1 (555) 901-2345',
    date: formatDateOffset(1), // Tomorrow
    time: '19:30',
    guests: 2,
    tableId: 1,
    status: 'Pending',
    occasion: 'Casual Dining',
    specialRequests: "First time visiting. Excited to try chef's seasonal tasting.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'DF-1006',
    customerName: 'Dr. Clara Oswald',
    email: 'clara.oswald@example.com',
    phone: '+1 (555) 678-9012',
    date: formatDateOffset(1), // Tomorrow
    time: '20:00',
    guests: 5,
    tableId: 6,
    status: 'Confirmed',
    occasion: 'Reunion',
    specialRequests: 'Terrace seating preferred. Vegetarian options for 2 guests.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'DF-1007',
    customerName: 'David Kim',
    email: 'dkim.tech@example.com',
    phone: '+1 (555) 123-4567',
    date: formatDateOffset(2), // 2 days later
    time: '19:00',
    guests: 8,
    tableId: 9,
    status: 'Pending',
    occasion: 'Corporate Celebration',
    specialRequests: "Chef's table experience. High-end beverage package.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'DF-1008',
    customerName: 'Natalie Portman',
    email: 'natalie.p@example.com',
    phone: '+1 (555) 890-1234',
    date: formatDateOffset(-1), // Yesterday
    time: '19:45',
    guests: 2,
    tableId: 7,
    status: 'Completed',
    occasion: 'Romantic Date',
    specialRequests: 'Splendid service appreciated.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'DF-1009',
    customerName: 'Robert Vance',
    email: 'rvance@example.com',
    phone: '+1 (555) 234-5678',
    date: formatDateOffset(-1), // Yesterday
    time: '20:30',
    guests: 4,
    tableId: 4,
    status: 'Completed',
    occasion: 'Family Gathering',
    specialRequests: 'High chair for infant provided.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'DF-1010',
    customerName: 'Victoria Beck',
    email: 'vbeck@example.com',
    phone: '+1 (555) 876-5432',
    date: formatDateOffset(0), // Today
    time: '17:30',
    guests: 3,
    tableId: 11,
    status: 'Cancelled',
    occasion: 'Business Dinner',
    specialRequests: 'Cancelled due to travel flight delay.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const FEATURED_DISHES: Dish[] = [
  {
    name: 'Truffle-Glazed Filet Mignon',
    category: 'Main Course',
    price: '$48',
    calories: '680 kcal',
    badge: "Chef's Signature",
    description: 'Prime dry-aged beef tenderloin, black winter truffle demi-glace, parsnip puree, glazed baby heirloom carrots.',
    image: 'assets/images/dish-filet.jpg',
    tags: ['Dry-Aged', 'Gluten-Free Option', 'Signature']
  },
  {
    name: 'Wild Pan-Seared Chilean Sea Bass',
    category: 'Seafood',
    price: '$42',
    calories: '520 kcal',
    badge: 'Bestseller',
    description: 'Sustainably caught sea bass, saffron-infused champagne velouté, asparagus spears, crispy leek ribbons.',
    image: 'assets/images/dish-seabass.jpg',
    tags: ['Sustainably Sourced', 'Keto Friendly', 'Seafood']
  },
  {
    name: 'Handcrafted Wild Morel Pappardelle',
    category: 'Handmade Pasta',
    price: '$34',
    calories: '590 kcal',
    badge: 'Artisanal',
    description: 'House-made egg yolk ribbon pasta, foraged morel mushrooms, roasted garlic emulsion, 24-month Parmigiano-Reggiano.',
    image: 'assets/images/dish-pasta.jpg',
    tags: ['Handcrafted Daily', 'Vegetarian', 'Italian Heritage']
  },
  {
    name: 'Smoked Terracotta Dark Chocolate Sphere',
    category: 'Dessert',
    price: '$18',
    calories: '440 kcal',
    badge: 'Dessert Masterpiece',
    description: 'Valrhona 72% dark chocolate dome, warm salted caramel pour-over, blood orange coulis, pistachio crunch.',
    image: 'assets/images/dish-dessert.jpg',
    tags: ['Valrhona Cacao', 'Gluten-Free', 'Showcase']
  }
];
