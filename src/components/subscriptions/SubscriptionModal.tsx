import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Subscription, ServicePackage, BillingCycle, PaymentStatus, SubscriptionStatus } from '../../types/subscription';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<Subscription>) => Promise<void>;
    existingSub?: Subscription | null;
    packages: ServicePackage[];
}

const emptySubData = {
    clientId: '',
    clientName: '',
    packageId: '',
    packageName: '',
    billingCycle: 'Monthly' as BillingCycle,
    price: 0,
    startDate: new Date().toISOString().split('T')[0],
    nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    paymentStatus: 'Pending' as PaymentStatus,
    status: 'Active' as SubscriptionStatus,
    autoRenew: true,
    notes: '',
};

export function SubscriptionModal({ isOpen, onClose, onSave, onUpdate, existingSub, packages }: SubscriptionModalProps) {
    const [formData, setFormData] = useState(emptySubData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        if (existingSub) {
            setFormData({
                ...existingSub,
                startDate: existingSub.startDate.split('T')[0],
                nextBillingDate: existingSub.nextBillingDate.split('T')[0],
            });
        } else {
            if (packages.length > 0) {
                setFormData({
                    ...emptySubData,
                    packageId: packages[0].id,
                    packageName: packages[0].name,
                    price: packages[0].price
                });
            } else {
                setFormData(emptySubData);
            }
        }
    }, [existingSub, isOpen, packages]);

    // Handle auto-updating price when package changes if creating new
    const handlePackageChange = (pkgId: string) => {
        const pkg = packages.find(p => p.id === pkgId);
        if (pkg) {
            setFormData({
                ...formData,
                packageId: pkg.id,
                packageName: pkg.name,
                price: pkg.price // Default price, user can still override
            });
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                nextBillingDate: new Date(formData.nextBillingDate).toISOString()
            };

            if (existingSub && onUpdate) {
                await onUpdate(existingSub.id, submissionData);
            } else {
                await onSave(submissionData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving subscription:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusCancel = async () => {
        if (!existingSub || !onUpdate) return;
        setIsSubmitting(true);
        try {
            await onUpdate(existingSub.id, { status: 'Cancelled', autoRenew: false });
            setShowCancelConfirm(false);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showCancelConfirm) {
        return (
            <div className="modal-overlay">
                <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
                    <div className="modal-header">
                        <h2 className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={20} /> Cancel Subscription
                        </h2>
                        <button className="close-btn" onClick={() => setShowCancelConfirm(false)}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to cancel the subscription for <strong>{existingSub?.clientName}</strong>? They will be moved to Cancelled status and auto-renew will be disabled.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setShowCancelConfirm(false)} disabled={isSubmitting}>Keep Active</button>
                        <button type="button" className="btn-danger" onClick={handleStatusCancel} disabled={isSubmitting}>
                            {isSubmitting ? 'Cancelling...' : 'Yes, Cancel It'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {existingSub ? 'Manage Subscription' : 'New Subscription'}
                    </h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Client Name *</label>
                                <input required className="form-input" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} placeholder="Linked client name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Service Package</label>
                                <select className="form-select" value={formData.packageId} onChange={e => handlePackageChange(e.target.value)}>
                                    {packages.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Billing Cycle</label>
                                <select className="form-select" value={formData.billingCycle} onChange={e => setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })}>
                                    {['Monthly', 'Quarterly', 'Yearly'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Custom Price ($)</label>
                                <input type="number" required className="form-input" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Date *</label>
                                <input type="date" required className="form-input" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Next Billing Date *</label>
                                <input type="date" required className="form-input" value={formData.nextBillingDate} onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Payment Status</label>
                                <select className="form-select" value={formData.paymentStatus} onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}>
                                    {['Paid', 'Pending', 'Overdue'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subscription Status</label>
                                <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as SubscriptionStatus })}>
                                    {['Active', 'Expired', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <input type="checkbox" id="autoRenew" checked={formData.autoRenew} onChange={e => setFormData({ ...formData, autoRenew: e.target.checked })} />
                            <label htmlFor="autoRenew" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>Enable Auto-Renewal</label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Internal Notes</label>
                            <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Billing specifics, agreed terms..." />
                        </div>

                    </div>

                    <div className="modal-footer" style={{ justifyContent: existingSub && formData.status === 'Active' ? 'space-between' : 'flex-end' }}>
                        {existingSub && formData.status === 'Active' && (
                            <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => setShowCancelConfirm(true)}>
                                Cancel Subscription
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Close</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
