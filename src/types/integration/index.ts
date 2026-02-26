// Multi-Tenancy / Settings Integration Types

export type PaymentGatewayProvider = 'Stripe' | 'Razorpay' | 'PayPal';

export interface PaymentGatewayConfig {
    id: string;
    tenantId: string;
    provider: PaymentGatewayProvider;
    isActive: boolean;
    isTestMode: boolean;
    publicKey: string;
    secretKey: string; // In a real app, this should never be exposed to the frontend
    webhookSecret?: string;
    createdAt: string;
}

export interface WebhookEndpoint {
    id: string;
    tenantId: string;
    url: string;
    description: string;
    events: WebhookEvent[];
    isActive: boolean;
    secretKey: string; // Used to sign payloads
    createdAt: string;
}

export type WebhookEvent =
    | 'lead.created'
    | 'invoice.paid'
    | 'project.completed'
    | 'payment.failed';

export interface WhatsAppConfig {
    id: string;
    tenantId: string;
    provider: 'Meta' | 'Twilio' | 'MessageBird';
    phoneNumberId: string;
    accountId: string;
    accessToken: string; // Hidden in real prod apps
    isActive: boolean;
    webhookUrl?: string;
    createdAt: string;
}

// Public API Types
export interface PublicApiConfig {
    id: string;
    tenantId: string;
    apiKey: string; // Base64 encoded key
    permissions: Array<'leads.create' | 'invoices.read'>;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
}
