import { Calendar, Download, RefreshCw } from 'lucide-react';
import type { Subscription } from '../../types/subscription';
import { getPaymentStatusColor, getSubStatusColor, formatCurrency } from '../../utils/subUtils';
import './SubscriptionListView.css';

interface SubscriptionListViewProps {
    subscriptions: Subscription[];
    onSubClick: (sub: Subscription) => void;
    onGenerateInvoice: (e: React.MouseEvent, sub: Subscription) => void;
    isGenerating: string | null;
}

export function SubscriptionListView({ subscriptions, onSubClick, onGenerateInvoice, isGenerating }: SubscriptionListViewProps) {
    return (
        <div className="subs-table-container animate-fade-in">
            <table className="subs-table">
                <thead>
                    <tr>
                        <th>Client & Package</th>
                        <th>Billing</th>
                        <th>Next Renewal</th>
                        <th>Payment Status</th>
                        <th>Sub Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map(sub => {
                        const isOverdue = new Date(sub.nextBillingDate) < new Date() && sub.paymentStatus !== 'Paid';

                        return (
                            <tr key={sub.id} onClick={() => onSubClick(sub)}>
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sub.clientName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {sub.packageName}
                                        {sub.autoRenew && <span style={{ marginLeft: '6px', color: 'var(--accent-primary)' }}><RefreshCw size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />Auto-renew</span>}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{formatCurrency(sub.price)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>per {sub.billingCycle}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOverdue ? 'var(--danger)' : 'var(--text-primary)' }}>
                                        <Calendar size={14} />
                                        <span style={{ fontWeight: isOverdue ? 600 : 400 }}>
                                            {new Date(sub.nextBillingDate).toLocaleDateString()}
                                            {isOverdue && ' (Overdue)'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className="sub-badge"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${getPaymentStatusColor(sub.paymentStatus)} 15%, transparent)`,
                                            color: getPaymentStatusColor(sub.paymentStatus)
                                        }}
                                    >
                                        <span className="sub-dot" style={{ backgroundColor: getPaymentStatusColor(sub.paymentStatus) }} />
                                        {sub.paymentStatus}
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className="sub-badge"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${getSubStatusColor(sub.status)} 15%, transparent)`,
                                            color: getSubStatusColor(sub.status)
                                        }}
                                    >
                                        <span className="sub-dot" style={{ backgroundColor: getSubStatusColor(sub.status) }} />
                                        {sub.status}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="invoice-btn"
                                        onClick={(e) => onGenerateInvoice(e, sub)}
                                        disabled={isGenerating === sub.id}
                                        style={{ opacity: isGenerating === sub.id ? 0.7 : 1 }}
                                    >
                                        <Download size={14} />
                                        {isGenerating === sub.id ? 'Generating...' : 'Invoice'}
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    {subscriptions.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                No active subscriptions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
