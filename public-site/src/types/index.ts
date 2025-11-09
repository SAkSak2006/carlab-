export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate?: string;
}

export interface Work {
  id: string;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusHistory {
  id: string;
  newStatus: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  status: string;
  description: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid';
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
  trackingToken?: string;
  assignedMaster?: string;
  client: Client;
  vehicle: Vehicle;
  works?: Work[];
  statusHistory?: StatusHistory[];
}
