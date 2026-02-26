import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Mail, MessageCircle } from 'lucide-react';
import type { User, Role, UserDocument } from '../../types';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'>, notifyEmail: boolean, notifyWhatsapp: boolean) => Promise<void>;
    existingUser?: User | null;
}

const ALL_ROLES: Role[] = ['Admin', 'Manager', 'Photographer', 'Videographer', 'Editor', 'Accountant', 'Client'];

const emptyUser: Omit<User, 'id'> = {
    tenantId: 'tenant-a1',
    name: '',
    email: '',
    role: 'Client',
    designation: '',
    phone: '',
    emergencyContact: '',
    defaultPassword: 'TempPassword123!',
    documents: [],
};

export function UserModal({ isOpen, onClose, onSave, existingUser }: UserModalProps) {
    const [formData, setFormData] = useState<Omit<User, 'id'>>(emptyUser);
    const [notifyEmail, setNotifyEmail] = useState(true);
    const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingUser) {
            setFormData(existingUser);
        } else {
            setFormData(emptyUser);
        }
    }, [existingUser, isOpen]);

    if (!isOpen) return null;

    const isEmployee = formData.role !== 'Client';

    const handleDocumentAdd = () => {
        const doc: UserDocument = {
            id: Math.random().toString(),
            name: `Document ${formData.documents?.length || 0 + 1}`,
            type: 'govt',
            url: 'https://example.com/dummy.pdf'
        };
        setFormData({ ...formData, documents: [...(formData.documents || []), doc] });
    };

    const removeDoc = (id: string) => {
        setFormData({ ...formData, documents: formData.documents?.filter(d => d.id !== id) });
    };

    const updateDoc = (id: string, field: keyof UserDocument, val: string) => {
        setFormData({
            ...formData,
            documents: formData.documents?.map(d => d.id === id ? { ...d, [field]: val } : d)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData, notifyEmail, notifyWhatsapp);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{ maxWidth: '650px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{existingUser ? 'Edit User' : 'Add New User'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input required className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">System Role *</label>
                                <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as Role })}>
                                    {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email Address (Username) *</label>
                                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Default Password</label>
                                <input className="form-input" value={formData.defaultPassword} onChange={e => setFormData({ ...formData, defaultPassword: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Emergency Contact Number</label>
                                <input type="tel" className="form-input" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                            </div>
                        </div>

                        {isEmployee && (
                            <>
                                <div className="form-group" style={{ marginTop: '16px' }}>
                                    <label className="form-label">Job Designation</label>
                                    <input className="form-input" placeholder="e.g. Senior Video Editor" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>

                                <div className="form-group" style={{ marginTop: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <label className="form-label" style={{ margin: 0 }}>Documents & Certificates</label>
                                        <button type="button" className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleDocumentAdd}>
                                            <Upload size={14} /> Add Document
                                        </button>
                                    </div>

                                    {formData.documents?.map((doc) => (
                                        <div key={doc.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                                            <select className="form-select" style={{ flex: 1, padding: '8px' }} value={doc.type} onChange={e => updateDoc(doc.id, 'type', e.target.value)}>
                                                <option value="govt">Govt ID / Driving License</option>
                                                <option value="academic">Academic Certificate</option>
                                                <option value="experience">Experience Letter</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <input className="form-input" style={{ flex: 2 }} placeholder="Document Label" value={doc.name} onChange={e => updateDoc(doc.id, 'name', e.target.value)} required />
                                            <button type="button" className="btn-icon delete" onClick={() => removeDoc(doc.id)}><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    {(!formData.documents || formData.documents.length === 0) && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No documents added yet.</div>
                                    )}
                                </div>
                            </>
                        )}

                        {!existingUser && (
                            <div className="form-group" style={{ marginTop: '24px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Notifications Strategy</label>
                                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} />
                                    <Mail size={16} style={{ color: 'var(--accent-primary)' }} /> Send Email Integration Invitation
                                </label>
                                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={notifyWhatsapp} onChange={e => setNotifyWhatsapp(e.target.checked)} />
                                    <MessageCircle size={16} style={{ color: '#25D366' }} /> Send WhatsApp Welcome Message
                                </label>
                            </div>
                        )}

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (existingUser ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
