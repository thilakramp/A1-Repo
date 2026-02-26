import type { PaymentGatewayConfig, WebhookEndpoint, WhatsAppConfig, PublicApiConfig } from '../../types/integration';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class IntegrationService {
    // Webhook Management
    async getWebhooks(): Promise<WebhookEndpoint[]> {
        await delay(300);
        return []; // Empty mock array
    }

    async createWebhook(data: Omit<WebhookEndpoint, 'id' | 'createdAt'>): Promise<WebhookEndpoint> {
        await delay(400);
        return { ...data, id: `wh-${Date.now()}`, createdAt: new Date().toISOString() };
    }

    // Payment Gateway Configuration Readiness
    async getPaymentGateways(tenantId: string): Promise<PaymentGatewayConfig[]> {
        await delay(300);
        return [
            {
                id: 'pg-1',
                tenantId,
                provider: 'Stripe',
                isActive: false, // Setup needed
                isTestMode: true,
                publicKey: 'pk_test_...',
                secretKey: 'sk_test_...',
                createdAt: new Date().toISOString()
            },
            {
                id: 'pg-2',
                tenantId,
                provider: 'Razorpay',
                isActive: false, // Setup needed
                isTestMode: true,
                publicKey: 'rzp_test_...',
                secretKey: '...',
                createdAt: new Date().toISOString()
            }
        ];
    }

    async updatePaymentGateway(): Promise<PaymentGatewayConfig> {
        await delay(500);
        throw new Error('Not implemented: Ready for server-side auth integration');
    }

    // WhatsApp Business API Configuration
    async getWhatsAppConfig(): Promise<WhatsAppConfig | null> {
        await delay(300);
        return null; // Initial state: not connected
    }

    async connectWhatsApp(data: Omit<WhatsAppConfig, 'id' | 'createdAt' | 'isActive'>): Promise<WhatsAppConfig> {
        await delay(800);
        // Simulating OAuth/API key validation flow
        return { ...data, id: `wa-${Date.now()}`, isActive: true, createdAt: new Date().toISOString() };
    }

    // Public API endpoint management for forms/lead generation
    async generatePublicApiKey(tenantId: string, permissions: PublicApiConfig['permissions']): Promise<PublicApiConfig> {
        await delay(500);
        return {
            id: `api-${Date.now()}`,
            tenantId,
            apiKey: `pub_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
            permissions,
            isActive: true,
            createdAt: new Date().toISOString()
        };
    }

    async revokePublicApiKey(): Promise<void> {
        await delay(300);
    }
}

export const integrationApi = new IntegrationService();
