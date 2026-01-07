// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'seller' | 'admin';
  avatar?: string;
  createdAt: Date;
}

// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock: number;
  rating?: number;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  longDescription?: string;
  features?: string[];
  pricing?: ServicePricing[];
}

export interface ServicePricing {
  name: string;
  price: string;
  features: string[];
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  shippingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Invoice types
export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
}

// LivePulse types
export interface Signal {
  id: string;
  content: string;
  category: string;
  source: string;
  createdAt: Date;
  qualityScore: number;
}

export interface Insight {
  id: string;
  title: string;
  signals: Signal[];
  type: 'risk' | 'opportunity';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  insightId?: string;
  status: 'proposed' | 'testing' | 'implemented' | 'measured';
  assignee?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Stats types
export interface Stat {
  label: string;
  value: string;
  change: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
