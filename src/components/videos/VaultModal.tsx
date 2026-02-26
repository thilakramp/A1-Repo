import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { VideoVaultEntry, StorageProvider } from '../../types/videos';

interface VaultModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: Omit<VideoVaultEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    existingEntry?: VideoVaultEntry | null;
}

const PROVIDERS: StorageProvider[] = ['Google Drive', 'OneDrive', 'Local NAS', 'Other'];

const emptyEntry: Omit<VideoVaultEntry, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    projectId: '',
    projectName: '',
    clientId: '',
    clientName: '',
    videographerName: '',
    editorName: '',
    provider: 'Google Drive',
    link: '',
    previewUrl: '',
    folderSizeMb: 0,
    videoCount: 0,
    dateOfShoot: new Date().toISOString().slice(0, 10),
};

export function VaultModal({ isOpen, onClose, onSave, existingEntry }: VaultModalProps) {
    const [formData, setFormData] = useState(emptyEntry);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingEntry) {
            setFormData(existingEntry);
        } else {
            setFormData(emptyEntry);
        }
    }, [existingEntry, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
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
                    <h2 className="modal-title">{existingEntry ? 'Edit Vault Entry' : 'Add to Video Vault'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                        <div className="form-group">
                            <label className="form-label">Album / Shoot Title *</label>
                            <input required className="form-input" placeholder="e.g. Wedding Raw Footage" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Client Name *</label>
                                <input required className="form-input" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Project Name *</label>
                                <input required className="form-input" value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Date of Shoot *</label>
                                <input required type="date" className="form-input" value={formData.dateOfShoot} onChange={e => setFormData({ ...formData, dateOfShoot: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Storage Provider</label>
                                <select className="form-select" value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value as StorageProvider })}>
                                    {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Drive / NAS URL Link *</label>
                            <input required type="url" className="form-input" placeholder="https://drive.google.com/..." value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Add the direct link to the folder or asset collection.</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Cover Preview Image URL</label>
                            <input type="url" className="form-input" placeholder="Optional thumbnail link" value={formData.previewUrl} onChange={e => setFormData({ ...formData, previewUrl: e.target.value })} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Approx Size (MB)</label>
                                <input type="number" min="0" className="form-input" value={formData.folderSizeMb} onChange={e => setFormData({ ...formData, folderSizeMb: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estimated Video Count</label>
                                <input type="number" min="0" className="form-input" value={formData.videoCount} onChange={e => setFormData({ ...formData, videoCount: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Lead Videographer Name</label>
                                <input className="form-input" value={formData.videographerName} onChange={e => setFormData({ ...formData, videographerName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Editor Name</label>
                                <input className="form-input" value={formData.editorName} onChange={e => setFormData({ ...formData, editorName: e.target.value })} />
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Vault Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
