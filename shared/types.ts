// User and Authentication Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'veterinarian' | 'receptionist' | 'cashier' | 'groomer';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Owner and Pet Types
export interface Owner {
  id: string;
  fullName: string;
  dni: string;
  address: string;
  phone: string;
  email: string;
  pets: Pet[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  weight: number;
  allergies: string[];
  ownerId: string;
  medicalHistory: MedicalRecord[];
  createdAt: Date;
  updatedAt: Date;
}

// Medical Records
export interface MedicalRecord {
  id: string;
  petId: string;
  visitDate: Date;
  veterinarianId: string;
  appointmentType: AppointmentType;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  weight: number;
  vaccines: Vaccine[];
  xrays: XRay[];
  notes: string;
  nextVisitDate?: Date;
  createdAt: Date;
}

export interface Vaccine {
  id: string;
  name: string;
  date: Date;
  nextDueDate: Date;
  veterinarianId: string;
  notes?: string;
}

export interface XRay {
  id: string;
  description: string;
  imageUrl: string;
  date: Date;
  veterinarianId: string;
  findings: string;
}

// Appointments
export interface Appointment {
  id: string;
  petId: string;
  ownerId: string;
  veterinarianId?: string;
  appointmentType: AppointmentType;
  date: Date;
  startTime: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentType = 'consultation' | 'vaccination' | 'surgery' | 'grooming' | 'emergency';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

// Inventory
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  expirationDate?: Date;
  supplierId: string;
  sku: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 'medicine' | 'food' | 'accessory';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  products: string[]; // Product IDs
  createdAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  userId: string;
  saleId?: string;
  createdAt: Date;
}

// Sales and Payments
export interface Sale {
  id: string;
  customerId?: string; // Can be null for walk-in customers
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
  cashierId: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface CashRegister {
  id: string;
  date: Date;
  openingAmount: number;
  closingAmount?: number;
  totalSales: number;
  cashierId: string;
  isOpen: boolean;
  openedAt: Date;
  closedAt?: Date;
}

// Reports
export interface ReportData {
  period: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  appointments: AppointmentReport;
  sales: SalesReport;
  inventory: InventoryReport;
}

export interface AppointmentReport {
  total: number;
  byType: Record<AppointmentType, number>;
  byStatus: Record<AppointmentStatus, number>;
  revenue: number;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  byCategory: Record<ProductCategory, { quantity: number; revenue: number }>;
  topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
}

export interface InventoryReport {
  lowStockItems: Product[];
  expiringItems: Product[];
  totalValue: number;
  movementsSummary: { in: number; out: number };
}

// Notifications
export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  reminderHours: number; // Hours before appointment to send reminder
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  type: 'email' | 'sms';
  recipient: string;
  message: string;
  status: 'sent' | 'failed';
  sentAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
