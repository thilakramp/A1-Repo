import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Lead, PipelineStage, LeadSource } from '../../types/crm';
import { PIPELINE_STAGES, LEAD_SOURCES } from '../../utils/crmUtils';
import './LeadModal.css';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<Lead>) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    existingLead?: Lead | null;
}

const emptyLeadData = {
    name: '',
    phone: '',
    email: '',
    company: '',
    source: 'Website' as LeadSource,
    stage: 'New' as PipelineStage,
    socials: { instagram: '', linkedin: '', twitter: '' },
    budget: '',
    requirements: '',
    notes: '',
    assignedTo: '',
    followUpDate: new Date().toISOString().split('T')[0], // local yyyy-mm-dd
};

export function LeadModal({ isOpen, onClose, onSave, onUpdate, onDelete, existingLead }: LeadModalProps) {
    const [formData, setFormData] = useState(emptyLeadData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (existingLead) {
            setFormData({
                ...existingLead,
                socials: {
                    instagram: existingLead.socials?.instagram || '',
                    linkedin: existingLead.socials?.linkedin || '',
                    twitter: existingLead.socials?.twitter || ''
                },
                followUpDate: existingLead.followUpDate.split('T')[0],
            });
        } else {
            setFormData(emptyLeadData);
        }
    }, [existingLead, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Ensure date is stored as full ISO
            const submissionData = {
                ...formData,
                followUpDate: new Date(formData.followUpDate).toISOString()
            };

            if (existingLead && onUpdate) {
                await onUpdate(existingLead.id, submissionData);
            } else {
                await onSave(submissionData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving lead:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!existingLead || !onDelete) return;
        setIsSubmitting(true);
        try {
            await onDelete(existingLead.id);
            onClose();
        } catch (error) {
            console.error('Error deleting lead:', error);
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
                        <h2 className="modal-title" style={{ color: 'var(--danger)' }}>Delete Lead</h2>
                        <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to permanently delete <strong>{existingLead?.name}</strong>? This action cannot be undone.</p>
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
                    <h2 className="modal-title">{existingLead ? 'Edit Lead' : 'New Lead'}</h2>
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Stage</label>
                                <select className="form-select" value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value as PipelineStage })}>
                                    {PIPELINE_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Source</label>
                                <select className="form-select" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value as LeadSource })}>
                                    {LEAD_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Budget</label>
                                <input placeholder="e.g. $5k - $10k" className="form-input" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Follow-up Date</label>
                                <input type="date" required className="form-input" value={formData.followUpDate} onChange={e => setFormData({ ...formData, followUpDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Socials (Instagram)</label>
                            <input placeholder="@username" className="form-input" value={formData.socials.instagram}
                                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Requirements</label>
                            <textarea placeholder="Client needs..." className="form-textarea" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Internal Notes</label>
                            <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                        </div>

                        {existingLead?.logs && existingLead.logs.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Activity Log</label>
                                <div className="activity-log-container" style={{ marginTop: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px', background: 'var(--bg-tertiary)', maxHeight: '200px', overflowY: 'auto' }}>
                                    {existingLead.logs.slice().reverse().map(log => (
                                        <div key={log.id} className="activity-log-item" style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{log.userName}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                Changed stage from <strong>{log.previousStage}</strong> to <strong>{log.newStage}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="modal-footer" style={{ justifyContent: existingLead ? 'space-between' : 'flex-end' }}>
                        {existingLead && (
                            <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 size={16} /> Delete Lead
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Lead'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
