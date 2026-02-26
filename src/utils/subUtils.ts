import type { PaymentStatus, SubscriptionStatus } from '../types/subscription';

export function getPaymentStatusColor(status: PaymentStatus): string {
    switch (status) {
        case 'Paid': return 'var(--success)';
        case 'Pending': return 'var(--warning)';
        case 'Overdue': return 'var(--danger)';
        default: return 'var(--text-secondary)';
    }
}

export function getSubStatusColor(status: SubscriptionStatus): string {
    switch (status) {
        case 'Active': return 'var(--success)';
        case 'Expired': return 'var(--danger)';
        case 'Cancelled': return 'var(--text-secondary)';
        default: return 'var(--text-secondary)';
    }
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}
