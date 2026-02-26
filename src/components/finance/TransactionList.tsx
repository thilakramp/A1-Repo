import { Trash2 } from 'lucide-react';
import type { Transaction } from '../../types/finance';
import { formatCurrencyString, getTransactionColor } from '../../utils/financeUtils';

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
    return (
        <div className="glass-box animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Transactions</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="txn-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id}>
                                <td>{new Date(txn.date).toLocaleDateString()}</td>
                                <td>
                                    <span className="txn-type-badge" style={{
                                        backgroundColor: `color-mix(in srgb, ${getTransactionColor(txn.type)} 15%, transparent)`,
                                        color: getTransactionColor(txn.type)
                                    }}>
                                        {txn.type}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 500 }}>
                                    {txn.description}
                                    {txn.invoiceId && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Invoice: {txn.invoiceId}</div>}
                                </td>
                                <td>{txn.categoryId || '-'}</td>
                                <td style={{ fontWeight: 600, color: getTransactionColor(txn.type) }}>
                                    {txn.type === 'Income' ? '+' : '-'}{formatCurrencyString(txn.amount)}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-icon delete" onClick={() => {
                                            if (confirm('Delete this transaction? This action cannot be undone.')) {
                                                onDelete(txn.id);
                                            }
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
