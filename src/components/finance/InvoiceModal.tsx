import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import type { Invoice, InvoiceItem } from '../../types/finance';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Promise<void>;
}

export function InvoiceModal({ isOpen, onClose, onSave }: InvoiceModalProps) {
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    const [taxRate, setTaxRate] = useState(0);
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([{ id: 'init-1', description: 'Photography Services', quantity: 1, rate: 0, amount: 0 }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(it => {
            if (it.id === id) {
                const updated = { ...it, [field]: value };
                updated.amount = updated.quantity * updated.rate;
                return updated;
            }
            return it;
        }));
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        return { subtotal, taxAmount, total };
    };

    const { subtotal, taxAmount, total } = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                clientId: 'custom-client', // Usually linked via CRM dropdown
                clientName,
                date: new Date(date).toISOString(),
                dueDate: new Date(dueDate).toISOString(),
                items,
                subtotal,
                taxRate,
                taxAmount,
                total,
                status: 'Draft',
                notes
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Generate Invoice</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Client Name *</label>
                                <input required className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Issue Date *</label>
                                <input type="date" required className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due Date *</label>
                                <input type="date" required className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label className="form-label">Line Items</label>
                                <button type="button" className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, rate: 0, amount: 0 }])}>
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>

                            {items.map((item, index) => (
                                <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                                    <input className="form-input" style={{ flex: 3 }} placeholder="Description" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} required />
                                    <input type="number" className="form-input" style={{ flex: 1 }} placeholder="Qty" value={item.quantity} min={1} onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} required />
                                    <input type="number" className="form-input" style={{ flex: 1 }} placeholder="Rate" value={item.rate} min={0} onChange={e => handleItemChange(item.id, 'rate', Number(e.target.value))} required />
                                    {index > 0 && (
                                        <button type="button" className="btn-icon delete" onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 size={16} /></button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="form-row" style={{ marginTop: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Tax Rate (%)</label>
                                <input type="number" min="0" max="100" className="form-input" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subtotal: ${subtotal.toFixed(2)}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tax: ${taxAmount.toFixed(2)}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>Total: ${total.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Thank you for your business!" />
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Generating...' : 'Create Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
