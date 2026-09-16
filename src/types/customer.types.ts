export interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  profileImageUrl?: string;
  isLoggedIn?: boolean;
  createdAt: string;
}

export interface CustomerCallback {
  id: number;
  name: string;
  phone: string;
  preferredTime?: string;
  status: string;
  createdAt: string;
}

export interface CustomerAuthResponse {
  token: string;
  tokenType: string;
  customer: Customer;
}

export interface CustomerDocumentStatusDto {
  checklistItemId: number;
  itemEn: string;
  itemHi: string;
  isReceived: boolean;
  notes?: string;
}

export interface CustomerAppointment {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  requiredDocuments?: CustomerDocumentStatusDto[];
}

export interface CustomerEnquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  serviceId?: number;
  message?: string;
  status: "NEW" | "CONTACTED" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}
