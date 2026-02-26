import type { InvoiceStatus, TransactionType } from '../types/finance';

export const EXPENSE_CATEGORIES = [
    'Equipment', 'Studio Rent', 'Marketing', 'Salary', 'Software', 'Miscellaneous'
] as const;

export function formatCurrencyString(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

export function getInvoiceStatusColor(status: InvoiceStatus): string {
    switch (status) {
        case 'Paid': return 'var(--success)';
        case 'Overdue': return 'var(--danger)';
        case 'Draft': return 'var(--text-secondary)';
        case 'Sent': return 'var(--warning)';
        default: return 'var(--text-secondary)';
    }
}

export function getTransactionColor(type: TransactionType): string {
    if (type === 'Income') return 'var(--success)';
    return 'var(--danger)';
}
