export type ExpenseCategory = 'Equipment' | 'Studio Rent' | 'Marketing' | 'Salary' | 'Software' | 'Miscellaneous';
export type TransactionType = 'Income' | 'Expense';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string;
    description: string;
    categoryId?: ExpenseCategory; // for expenses
    invoiceId?: string; // link to invoice if income
    createdAt: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    status: InvoiceStatus;
    notes: string;
    createdAt: string;
}
