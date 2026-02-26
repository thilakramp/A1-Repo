import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import type { Project, ProjectType, ProjectStatus, EquipmentItem, DeliverableItem } from '../../types/project';
import { PROJECT_TYPES, PROJECT_STATUSES } from '../../utils/projectUtils';

// Inline CSS for speed and modal reuse (similar to LeadModal)
interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<Project>) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    existingProject?: Project | null;
}

const emptyProjectData = {
    title: '',
    type: 'Wedding Photography & Videography' as ProjectType,
    clientId: '',
    clientName: '',
    shootDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
    location: '',
    teamIds: [] as string[],
    equipment: [] as EquipmentItem[],
    moodboardUrl: '',
    deliverables: [] as DeliverableItem[],
    deadlineDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // +7 days
    notes: '',
    status: 'Pre-production' as ProjectStatus,
};

export function ProjectModal({ isOpen, onClose, onSave, onUpdate, onDelete, existingProject }: ProjectModalProps) {
    const [formData, setFormData] = useState(emptyProjectData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newEqName, setNewEqName] = useState('');
    const [newDelName, setNewDelName] = useState('');

    useEffect(() => {
        if (existingProject) {
            setFormData({
                ...existingProject,
                shootDate: new Date(existingProject.shootDate).toISOString().slice(0, 16), // datetime-local format
                deadlineDate: existingProject.deadlineDate.split('T')[0],
                moodboardUrl: existingProject.moodboardUrl || ''
            });
        } else {
            setFormData(emptyProjectData);
        }
    }, [existingProject, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                shootDate: new Date(formData.shootDate).toISOString(),
                deadlineDate: new Date(formData.deadlineDate).toISOString()
            };

            if (existingProject && onUpdate) {
                await onUpdate(existingProject.id, submissionData);
            } else {
                await onSave(submissionData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addEq = () => {
        if (!newEqName.trim()) return;
        setFormData(prev => ({
            ...prev,
            equipment: [...prev.equipment, { id: Date.now().toString(), name: newEqName, isChecked: false }]
        }));
        setNewEqName('');
    };

    const removeEq = (id: string) => {
        setFormData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== id) }));
    };

    const toggleEq = (id: string) => {
        setFormData(prev => ({
            ...prev,
            equipment: prev.equipment.map(e => e.id === id ? { ...e, isChecked: !e.isChecked } : e)
        }));
    };

    const addDel = () => {
        if (!newDelName.trim()) return;
        setFormData(prev => ({
            ...prev,
            deliverables: [...prev.deliverables, { id: Date.now().toString(), name: newDelName, isCompleted: false }]
        }));
        setNewDelName('');
    };

    const removeDel = (id: string) => {
        setFormData(prev => ({ ...prev, deliverables: prev.deliverables.filter(d => d.id !== id) }));
    };

    const toggleDel = (id: string) => {
        setFormData(prev => ({
            ...prev,
            deliverables: prev.deliverables.map(d => d.id === id ? { ...d, isCompleted: !d.isCompleted } : d)
        }));
    };

    if (showDeleteConfirm) {
        return (
            <div className="modal-overlay">
                <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
                    <div className="modal-header">
                        <h2 className="modal-title" style={{ color: 'var(--danger)' }}>Delete Project</h2>
                        <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}><X size={20} /></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete <strong>{existingProject?.title}</strong>? This cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isSubmitting}>Cancel</button>
                        <button type="button" className="btn-danger" onClick={async () => {
                            if (existingProject && onDelete) {
                                setIsSubmitting(true);
                                await onDelete(existingProject.id);
                                setIsSubmitting(false);
                                setShowDeleteConfirm(false);
                                onClose();
                            }
                        }} disabled={isSubmitting}>
                            {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{existingProject ? 'Edit Project' : 'New Project'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Project Title *</label>
                                <input required className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Smith Wedding" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Client Name *</label>
                                <input required className="form-input" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} placeholder="Linked client name" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Type</label>
                                <select className="form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })}>
                                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}>
                                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Shoot Date & Time *</label>
                                    <input type="datetime-local" required className="form-input" value={formData.shootDate} onChange={e => setFormData({ ...formData, shootDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline Date *</label>
                                    <input type="date" required className="form-input" value={formData.deadlineDate} onChange={e => setFormData({ ...formData, deadlineDate: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Shoot location" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Moodboard URL</label>
                                <input type="url" className="form-input" value={formData.moodboardUrl} onChange={e => setFormData({ ...formData, moodboardUrl: e.target.value })} placeholder="https://..." />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Internal Notes</label>
                                <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Equipment Checklist */}
                            <div className="form-group">
                                <label className="form-label">Equipment Checklist</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input className="form-input" value={newEqName} onChange={e => setNewEqName(e.target.value)} placeholder="Add equipment..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEq(); } }} />
                                    <button type="button" className="btn-secondary" onClick={addEq}><Plus size={16} /></button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '4px' }}>
                                    {formData.equipment.map(eq => (
                                        <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" checked={eq.isChecked} onChange={() => toggleEq(eq.id)} />
                                            <span style={{ flex: 1, fontSize: '0.875rem', textDecoration: eq.isChecked ? 'line-through' : 'none', color: eq.isChecked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{eq.name}</span>
                                            <button type="button" onClick={() => removeEq(eq.id)} style={{ color: 'var(--danger)', padding: '2px' }}><Minus size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Deliverables List */}
                            <div className="form-group" style={{ marginTop: 'auto' }}>
                                <label className="form-label">Deliverables</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input className="form-input" value={newDelName} onChange={e => setNewDelName(e.target.value)} placeholder="Add deliverable..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDel(); } }} />
                                    <button type="button" className="btn-secondary" onClick={addDel}><Plus size={16} /></button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '4px' }}>
                                    {formData.deliverables.map(del => (
                                        <div key={del.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" checked={del.isCompleted} onChange={() => toggleDel(del.id)} />
                                            <span style={{ flex: 1, fontSize: '0.875rem', textDecoration: del.isCompleted ? 'line-through' : 'none', color: del.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{del.name}</span>
                                            <button type="button" onClick={() => removeDel(del.id)} style={{ color: 'var(--danger)', padding: '2px' }}><Minus size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="modal-footer" style={{ justifyContent: existingProject ? 'space-between' : 'flex-end', marginTop: 'auto' }}>
                        {existingProject && (
                            <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => setShowDeleteConfirm(true)}>
                                <Trash2 size={16} /> Delete Project
                            </button>
                        )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Project'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
