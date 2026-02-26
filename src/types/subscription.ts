export type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled';

export interface ServicePackage {
    id: string;
    name: string;
    price: number;
    features: string[];
}

export interface Subscription {
    id: string;
    clientId: string;
    clientName: string;
    packageId: string;
    packageName: string;
    billingCycle: BillingCycle;
    price: number;
    startDate: string; // ISO date
    nextBillingDate: string; // ISO date
    paymentStatus: PaymentStatus;
    status: SubscriptionStatus;
    autoRenew: boolean;
    notes: string;
    createdAt: string;
    updatedAt: string;
}
