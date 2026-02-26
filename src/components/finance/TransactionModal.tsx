import { useState } from 'react';
import { X } from 'lucide-react';
import type { Transaction, TransactionType, ExpenseCategory } from '../../types/finance';
import { EXPENSE_CATEGORIES } from '../../utils/financeUtils';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (txn: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
    defaultType?: TransactionType;
}

export function TransactionModal({ isOpen, onClose, onSave, defaultType = 'Expense' }: TransactionModalProps) {
    const [type, setType] = useState<TransactionType>(defaultType);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<ExpenseCategory>('Miscellaneous');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                type,
                amount,
                date: new Date(date).toISOString(),
                description,
                ...(type === 'Expense' ? { categoryId } : {})
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
            <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">New Transaction</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <div className="finance-tabs" style={{ display: 'flex', width: '100%' }}>
                                <button type="button" className={`finance-tab ${type === 'Income' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setType('Income')}>Income</button>
                                <button type="button" className={`finance-tab ${type === 'Expense' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setType('Expense')}>Expense</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="date" required className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <input type="number" step="0.01" required className="form-input" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input type="text" required className="form-input" value={description} placeholder="e.g. Server Hosting" onChange={e => setDescription(e.target.value)} />
                        </div>

                        {type === 'Expense' && (
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value as ExpenseCategory)}>
                                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : `Save ${type}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
