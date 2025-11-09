// TypeScript types for Ilialox CRM

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Client {
  id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
}

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  trackingToken?: string;
  status: RequestStatus;
  progressPercentage: number;
  description: string;
  assignedMaster?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
  vehicle: Vehicle;
  works?: RequestWork[];
  worksCount?: number;
  statusHistory?: StatusHistoryEntry[];
}

export interface RequestWork {
  id: string;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: string;
}

export interface StatusHistoryEntry {
  id?: string;
  oldStatus?: string;
  newStatus: string;
  changedBy?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRequests: number;
  requestsByStatus: {
    new: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  todayRequests: number;
  todayRevenue: number;
  pendingRequests: number;
}

export interface RecentRequest {
  id: string;
  requestNumber: string;
  status: RequestStatus;
  clientName: string;
  vehicle: string;
  totalAmount: number;
  createdAt: string;
}

export interface PublicRequestData {
  client: {
    firstName: string;
    lastName?: string;
    phone: string;
    email?: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year?: number;
    vin?: string;
    licensePlate?: string;
  };
  description: string;
}

export interface PublicRequestResponse {
  success: boolean;
  requestNumber: string;
  trackingToken: string;
  trackingUrl: string;
  message: string;
}

export interface Master {
  id: string;
  name: string;
  specialization: string;
}

export interface CommonService {
  name: string;
  defaultPrice: number;
}
