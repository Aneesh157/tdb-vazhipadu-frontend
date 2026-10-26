export interface Temple {
  id: string;
  name: string;
  location: string;
  deity: string;
}

export interface Offering {
  id: string;
  templeId: string;
  name: string;
  description: string;
  price: number; // in INR (₹)
  active: boolean;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface OrderItem {
  offeringId: string;
  offeringName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  templeId: string;
  templeName: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string; // YYYY-MM-DD
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
}

export interface CreateOrderRequest {
  templeId: string;
  devoteeName: string;
  phoneNumber: string;
  nakshatra: string;
  offeringDate: string;
  items: {
    offeringId: string;
    quantity: number;
  }[];
}

export interface GetOrdersQuery {
  date?: string;
  status?: string;
  phoneNumber?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CartItem {
  offering: Offering;
  quantity: number;
}

export const NAKSHATRAS = [
  'Ashwini (അശ്വതി)',
  'Bharani (ഭരണി)',
  'Krittika (കാർത്തിക)',
  'Rohini (രോഹിണി)',
  'Mrigashirsha (മകയിരം)',
  'Ardra (തിരുവാതിര)',
  'Punarvasu (പുണർതം)',
  'Pushya (പൂയം)',
  'Ashlesha (ആയില്യം)',
  'Magha (മകം)',
  'Purva Phalguni (പൂരം)',
  'Uttara Phalguni (ഉത്രം)',
  'Hasta (അത്തം)',
  'Chitra (ചിത്തിര)',
  'Swati (ചോതി)',
  'Vishakha (വിശാഖം)',
  'Anuradha (അനിഴം)',
  'Jyeshtha (തൃക്കേട്ട)',
  'Mula (മൂലം)',
  'Purva Ashadha (പൂരാടം)',
  'Uttara Ashadha (ഉത്രാടം)',
  'Shravana (തിരുവോണം)',
  'Dhanishta (അവിട്ടം)',
  'Shatabhisha (ചതയം)',
  'Purva Bhadrapada (പൂരുരുട്ടാതി)',
  'Uttara Bhadrapada (ഉത്രട്ടാതി)',
  'Revati (രേവതി)',
] as const;
