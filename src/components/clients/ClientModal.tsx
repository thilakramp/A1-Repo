import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Client } from '../../types/client';
import './ClientModal.css';

export interface ClientFormData {
    name: string;
    phone: string;
    email: string;
    company: string;
    socials: { instagram?: string; linkedin?: string; twitter?: string; };
}

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClientFormData) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<ClientFormData>) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    existingClient?: Client | null;
}

const emptyClientData: ClientFormData = {
    name: '',
    phone: '',
    email: '',
    company: '',
    socials: { instagram: '', linkedin: '', twitter: '' },
};

export function ClientModal({ isOpen, onClose, onSave, onUpdate, onDelete, existingClient }: ClientModalProps) {
    const [formData, setFormData] = useState<ClientFormData>(emptyClientData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (existingClient) {
            setFormData({
                name: existingClient.name || '',
                phone: existingClient.phone || '',
                email: existingClient.email || '',
                company: existingClient.company || '',
                socials: {
                    instagram: existingClient.socials?.instagram || '',
                    linkedin: existingClient.socials?.linkedin || '',
                    twitter: existingClient.socials?.twitter || ''
                }
            });
        } else {
            setFormData(emptyClientData);
        }
    }, [existingClient, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (existingClient && onUpdate) {
                await onUpdate(existingClient.id, formData);
            } else {
                await onSave(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingClient || !onDelete) return;
        setIsSubmitting(true);
        try {
            await onDelete(existingClient.id);
            onClose();
        } catch (error) {
            console.error('Error deleting client:', error);
        } finally {
            setIsSubmitting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (showDeleteConfirm) {
        return (
            <div className="modal-overlay">
                <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
                    <div className="modal-header">
                        <h2 className="modal-title" style={{ color: 'var(--danger)' }}>Delete Client</h2>
                        <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to permanently delete <strong>{existingClient?.name}</strong>? This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isSubmitting}>Cancel</button>
                        <button type="button" className="btn-danger" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h2 className="modal-title">{existingClient ? 'Edit Client' : 'New Client'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="modal-body">

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input required className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company</label>
                                <input className="form-input" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <h3 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1rem' }}>Social Handles</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Instagram</label>
                                <input placeholder="@username" className="form-input" value={formData.socials.instagram}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">LinkedIn</label>
                                <input placeholder="linkedin.com/in/..." className="form-input" value={formData.socials.linkedin}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })} />
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer" style={{ justifyContent: existingClient ? 'space-between' : 'flex-end' }}>
                        {existingClient && onDelete && (
                            <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 size={16} /> Delete Client
                            </button>
                        )}
                        {!onDelete && existingClient ? <div></div> : null}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Client'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
