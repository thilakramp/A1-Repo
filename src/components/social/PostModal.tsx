import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SocialPost, PostStage, SocialPlatform } from '../../types/social';
import { SOCIAL_PLATFORMS, POST_STAGES } from '../../services/api/social';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<SocialPost>) => Promise<void>;
    existingPost?: SocialPost | null;
}

const emptyPostData = {
    clientId: '',
    clientName: '',
    title: '',
    stage: 'Idea' as PostStage,
    platforms: [] as SocialPlatform[],
    scheduledDate: new Date().toISOString().slice(0, 16),
    caption: '',
    mediaUrls: [] as string[]
};

export function PostModal({ isOpen, onClose, onSave, onUpdate, existingPost }: PostModalProps) {
    const [formData, setFormData] = useState(emptyPostData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingPost) {
            setFormData({
                ...existingPost,
                scheduledDate: new Date(existingPost.scheduledDate).toISOString().slice(0, 16)
            });
        } else {
            setFormData(emptyPostData);
        }
    }, [existingPost, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                scheduledDate: new Date(formData.scheduledDate).toISOString()
            };

            if (existingPost && onUpdate) {
                await onUpdate(existingPost.id, submissionData);
            } else {
                await onSave(submissionData);
            }
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePlatform = (platform: SocialPlatform) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform]
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{existingPost ? 'Edit Post' : 'New Social Post'}</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Client Name *</label>
                                <input required className="form-input" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Post Title *</label>
                                <input required className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Stage</label>
                                <select className="form-select" value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value as PostStage })}>
                                    {POST_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Scheduled Date & Time *</label>
                                <input type="datetime-local" required className="form-input" value={formData.scheduledDate} onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label className="form-label">Platforms</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {SOCIAL_PLATFORMS.map(platform => (
                                    <button
                                        key={platform}
                                        type="button"
                                        onClick={() => togglePlatform(platform)}
                                        className="secondary-btn"
                                        style={{
                                            borderColor: formData.platforms.includes(platform) ? 'var(--accent-primary)' : 'var(--border-color)',
                                            backgroundColor: formData.platforms.includes(platform) ? 'var(--bg-primary)' : 'transparent',
                                            color: formData.platforms.includes(platform) ? 'var(--text-primary)' : 'var(--text-secondary)'
                                        }}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                            {formData.platforms.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>Please select at least one platform.</p>}
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label className="form-label">Caption / Copy</label>
                            <textarea
                                className="form-textarea"
                                style={{ minHeight: '120px' }}
                                value={formData.caption}
                                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Write your brilliant caption here..."
                            />
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting || formData.platforms.length === 0}>
                            {isSubmitting ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
