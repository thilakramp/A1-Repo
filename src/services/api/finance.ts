import type { Transaction, Invoice } from '../../types/finance';

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn-1', type: 'Income', amount: 3000, date: new Date(Date.now() - 5 * 86400000).toISOString(), description: 'Wedding Shoot - Sarah', invoiceId: 'inv-1001', createdAt: new Date().toISOString() },
    { id: 'txn-2', type: 'Expense', amount: 450, date: new Date(Date.now() - 10 * 86400000).toISOString(), description: 'New Lens Rental', categoryId: 'Equipment', createdAt: new Date().toISOString() },
    { id: 'txn-3', type: 'Expense', amount: 1200, date: new Date(Date.now() - 15 * 86400000).toISOString(), description: 'Monthly Studio Rent', categoryId: 'Studio Rent', createdAt: new Date().toISOString() },
    { id: 'txn-4', type: 'Income', amount: 1500, date: new Date(Date.now() - 20 * 86400000).toISOString(), description: 'Corporate Video Retainer', invoiceId: 'inv-1002', createdAt: new Date().toISOString() },
    { id: 'txn-5', type: 'Expense', amount: 60, date: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Adobe CC Subscription', categoryId: 'Software', createdAt: new Date().toISOString() },
];

const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv-1001',
        invoiceNumber: 'INV-1001',
        clientId: 'lead-1',
        clientName: 'Sarah Jenkins',
        date: new Date(Date.now() - 15 * 86400000).toISOString(),
        dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        items: [{ id: 'i1', description: 'Wedding Package', quantity: 1, rate: 3000, amount: 3000 }],
        subtotal: 3000,
        taxRate: 0,
        taxAmount: 0,
        total: 3000,
        status: 'Paid',
        notes: 'Thank you for your business!',
        createdAt: new Date().toISOString()
    },
    {
        id: 'inv-1002',
        invoiceNumber: 'INV-1002',
        clientId: 'lead-3',
        clientName: 'TechCorp Inc',
        date: new Date(Date.now() - 35 * 86400000).toISOString(),
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        items: [{ id: 'i1', description: 'Corporate Video', quantity: 1, rate: 1500, amount: 1500 }],
        subtotal: 1500,
        taxRate: 10,
        taxAmount: 150,
        total: 1650,
        status: 'Overdue',
        notes: 'Please remit payment at your earliest convenience.',
        createdAt: new Date().toISOString()
    },
    {
        id: 'inv-1003',
        invoiceNumber: 'INV-1003',
        clientId: 'lead-4',
        clientName: 'Emma Watson',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
        items: [
            { id: 'i1', description: 'Portrait Session', quantity: 1, rate: 500, amount: 500 },
            { id: 'i2', description: 'Extra Retouched Photos', quantity: 5, rate: 50, amount: 250 }
        ],
        subtotal: 750,
        taxRate: 5,
        taxAmount: 37.5,
        total: 787.5,
        status: 'Sent',
        notes: '',
        createdAt: new Date().toISOString()
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class FinanceService {
    async getTransactions(): Promise<Transaction[]> {
        await delay(300);
        return [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async getInvoices(): Promise<Invoice[]> {
        await delay(300);
        return [...MOCK_INVOICES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
        await delay(400);
        const txn: Transaction = {
            ...data,
            id: `txn-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        MOCK_TRANSACTIONS.push(txn);
        return txn;
    }

    async deleteTransaction(id: string): Promise<void> {
        await delay(400);
        const index = MOCK_TRANSACTIONS.findIndex(t => t.id === id);
        if (index > -1) MOCK_TRANSACTIONS.splice(index, 1);
    }

    async createInvoice(data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<Invoice> {
        await delay(500);
        const inv: Invoice = {
            ...data,
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-${1000 + MOCK_INVOICES.length + 1}`,
            createdAt: new Date().toISOString()
        };
        MOCK_INVOICES.push(inv);
        return inv;
    }

    async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
        await delay(400);
        const inv = MOCK_INVOICES.find(i => i.id === id);
        if (!inv) throw new Error("Invoice not found");
        inv.status = status;

        // Automatically record income if marked Paid
        if (status === 'Paid') {
            const existingIncome = MOCK_TRANSACTIONS.find(t => t.invoiceId === id);
            if (!existingIncome) {
                MOCK_TRANSACTIONS.push({
                    id: `txn-${Date.now()}`,
                    type: 'Income',
                    amount: inv.total,
                    date: new Date().toISOString(),
                    description: `Invoice Payment: ${inv.invoiceNumber}`,
                    invoiceId: id,
                    createdAt: new Date().toISOString()
                });
            }
        }
        return inv;
    }

    async getDashboardStats() {
        await delay(200);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTxns = MOCK_TRANSACTIONS.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const income = monthlyTxns.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
        const expenses = monthlyTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
        const outstanding = MOCK_INVOICES.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);

        return {
            monthlyIncome: income,
            monthlyExpenses: expenses,
            monthlyProfit: income - expenses,
            outstandingPayments: outstanding
        };
    }
}

export const financeApi = new FinanceService();
