import type { Subscription, ServicePackage } from '../../types/subscription';

export const MOCK_PACKAGES: ServicePackage[] = [
    { id: 'pkg-1', name: 'Standard Retainer', price: 1500, features: ['4 Shoots/mo', '10 Edited Photos', '1 Reel'] },
    { id: 'pkg-2', name: 'Premium Retainer', price: 3000, features: ['8 Shoots/mo', '30 Edited Photos', '4 Reels', 'Priority Editing'] },
    { id: 'pkg-3', name: 'Enterprise Management', price: 5000, features: ['Unlimited Shoots', 'Full Social Media Mgt', 'Dedicated Editor'] }
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
    {
        id: 'sub-1',
        clientId: 'lead-1',
        clientName: 'Sarah Jenkins',
        packageId: 'pkg-2',
        packageName: 'Premium Retainer',
        billingCycle: 'Monthly',
        price: 3000,
        startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        nextBillingDate: new Date(Date.now() + 2 * 86400000).toISOString(), // next 2 days
        paymentStatus: 'Pending',
        status: 'Active',
        autoRenew: true,
        notes: 'Requires invoices sent to accounting@sarahj.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'sub-2',
        clientId: 'lead-3',
        clientName: 'TechCorp Inc',
        packageId: 'pkg-3',
        packageName: 'Enterprise Management',
        billingCycle: 'Yearly',
        price: 50000,
        startDate: new Date(Date.now() - 300 * 86400000).toISOString(),
        nextBillingDate: new Date(Date.now() - 5 * 86400000).toISOString(), // overdue 5 days ago
        paymentStatus: 'Overdue',
        status: 'Expired',
        autoRenew: false,
        notes: 'Awaiting annual budget approval',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'sub-3',
        clientId: 'lead-4',
        clientName: 'Emma Watson',
        packageId: 'pkg-1',
        packageName: 'Standard Retainer',
        billingCycle: 'Quarterly',
        price: 4000,
        startDate: new Date(Date.now() - 10 * 86400000).toISOString(),
        nextBillingDate: new Date(Date.now() + 80 * 86400000).toISOString(),
        paymentStatus: 'Paid',
        status: 'Active',
        autoRenew: true,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class SubscriptionService {
    async getPackages(): Promise<ServicePackage[]> {
        await delay(200);
        return [...MOCK_PACKAGES];
    }

    async getSubscriptions(): Promise<Subscription[]> {
        await delay(400);
        return [...MOCK_SUBSCRIPTIONS].sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
    }

    async getDashboardSummary() {
        await delay(200);
        return {
            activeSubs: MOCK_SUBSCRIPTIONS.filter(s => s.status === 'Active').length,
            overduePayments: MOCK_SUBSCRIPTIONS.filter(s => s.paymentStatus === 'Overdue').length,
            monthlyRecurringRevenue: MOCK_SUBSCRIPTIONS.filter(s => s.status === 'Active').reduce((sum, s) => {
                if (s.billingCycle === 'Monthly') return sum + s.price;
                if (s.billingCycle === 'Quarterly') return sum + (s.price / 3);
                if (s.billingCycle === 'Yearly') return sum + (s.price / 12);
                return sum;
            }, 0)
        };
    }

    async createSubscription(subData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
        await delay(500);
        const newSub: Subscription = {
            ...subData,
            id: `sub-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_SUBSCRIPTIONS.push(newSub);
        return newSub;
    }

    async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
        await delay(400);
        const index = MOCK_SUBSCRIPTIONS.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Subscription not found');

        // Auto sync package name and price if package changes
        if (updates.packageId && updates.packageId !== MOCK_SUBSCRIPTIONS[index].packageId) {
            const pkg = MOCK_PACKAGES.find(p => p.id === updates.packageId);
            if (pkg) {
                updates.packageName = pkg.name;
                updates.price = pkg.price; // reset price to default of new package, user can override but we assume simplification
            }
        }

        const updated = {
            ...MOCK_SUBSCRIPTIONS[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_SUBSCRIPTIONS[index] = updated;
        return updated;
    }

    async generateInvoice(subId: string): Promise<string> {
        await delay(600);
        // Simulate invoice generation returning a fake URL
        return `https://a1media.com/invoices/${subId}-${Date.now()}.pdf`;
    }
}

export const subscriptionApi = new SubscriptionService();
