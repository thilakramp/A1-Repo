export type Role = 'Admin' | 'Manager' | 'Photographer' | 'Videographer' | 'Editor' | 'Accountant' | 'Client';

export interface Tenant {
  id: string; // Globally unique tenant ID
  name: string; // e.g. "A1 Media Default Workspace"
  domain?: string; // e.g. "a1media.crm.com" or a custom domain
  plan: 'Free' | 'Pro' | 'Enterprise'; // SaaS subscription tier
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface UserDocument {
  id: string;
  name: string;
  type: 'academic' | 'govt' | 'experience' | 'other';
  url: string;
}

export interface User {
  id: string;
  tenantId: string; // SaaS Multi-tenant separation
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;

  // New fields
  designation?: string;
  phone?: string;
  emergencyContact?: string;
  defaultPassword?: string;
  documents?: UserDocument[];

  whatsappNotified?: boolean;
  emailNotified?: boolean;
  createdAt?: string;
}
