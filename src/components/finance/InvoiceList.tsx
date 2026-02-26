import { Download, Edit } from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../../types/finance';
import { formatCurrencyString, getInvoiceStatusColor } from '../../utils/financeUtils';

interface InvoiceListProps {
    invoices: Invoice[];
    onEdit: (id: string) => void;
    onGenerateDoc: (id: string) => void;
    onStatusChange: (id: string, status: InvoiceStatus) => void;
}

export function InvoiceList({ invoices, onEdit, onGenerateDoc, onStatusChange }: InvoiceListProps) {
    return (
        <div className="glass-box animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Invoices</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="txn-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Invoice #</th>
                            <th>Client</th>
                            <th>Date / Due</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td>
                                    <select
                                        value={inv.status}
                                        onChange={e => onStatusChange(inv.id, e.target.value as InvoiceStatus)}
                                        style={{
                                            padding: '4px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid currentColor',
                                            backgroundColor: `color-mix(in srgb, ${getInvoiceStatusColor(inv.status)} 15%, transparent)`,
                                            color: getInvoiceStatusColor(inv.status), cursor: 'pointer', outline: 'none'
                                        }}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Sent">Sent</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </td>
                                <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                                <td style={{ fontWeight: 500 }}>{inv.clientName}</td>
                                <td>
                                    <div style={{ fontSize: '0.875rem' }}>{new Date(inv.date).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                                </td>
                                <td style={{ fontWeight: 600 }}>
                                    {formatCurrencyString(inv.total)}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-icon" onClick={() => onEdit(inv.id)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn-icon" onClick={() => onGenerateDoc(inv.id)}>
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No invoices found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
