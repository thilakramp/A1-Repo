import { useState, useEffect } from 'react';
import { Plus, FolderIcon, HardDrive, Image as ImageIcon, ExternalLink, Edit, Trash2, Calendar, UserRound, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { photoVaultApi } from '../../services/api/photos';
import type { PhotoVaultEntry, StorageProvider } from '../../types/photos';
import { VaultModal } from '../../components/photos/VaultModal';
import './PhotoVault.css';

export function PhotoVault() {
    const [entries, setEntries] = useState<PhotoVaultEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<PhotoVaultEntry | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [validatingId, setValidatingId] = useState<string | null>(null);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await photoVaultApi.getVaultEntries();
            setEntries(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleOpenNew = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: PhotoVaultEntry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Remove "${title}" from the Photo Vault?`)) {
            await photoVaultApi.deleteVaultEntry(id);
            fetchEntries();
        }
    };

    const handleValidate = async (id: string) => {
        setValidatingId(id);
        try {
            await photoVaultApi.validateVaultEntry(id);
            await fetchEntries();
        } catch (e) {
            console.error(e);
        } finally {
            setValidatingId(null);
        }
    };

    const handleSave = async (data: Omit<PhotoVaultEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingEntry) {
            await photoVaultApi.updateVaultEntry(editingEntry.id, data);
        } else {
            await photoVaultApi.createVaultEntry(data);
        }
        fetchEntries();
    };

    const getProviderIcon = (provider: StorageProvider) => {
        if (provider === 'Google Drive') return <FolderIcon size={12} />;
        if (provider === 'OneDrive') return <FolderIcon size={12} />;
        if (provider === 'Local NAS') return <HardDrive size={12} />;
        return <FolderIcon size={12} />;
    };

    const filteredEntries = entries.filter(entry => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            entry.title.toLowerCase().includes(q) ||
            entry.clientName.toLowerCase().includes(q) ||
            entry.projectName.toLowerCase().includes(q) ||
            entry.photographerName.toLowerCase().includes(q) ||
            entry.dateOfShoot.includes(q)
        );
    });

    return (
        <div className="animate-fade-in">
            <div className="vault-header">
                <h1 className="vault-title">Photo Vault</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="search-bar" style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search client, event, date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '40px', width: '300px' }}
                        />
                    </div>
                    <button className="primary-btn" onClick={handleOpenNew} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={16} /> Link Drive / Folder
                    </button>
                </div>
            </div>

            <div className="vault-grid">
                {isLoading ? (
                    <div style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading vault entries...</div>
                ) : filteredEntries.map(entry => (
                    <div className="vault-card" key={entry.id}>
                        <div className="vault-cover">
                            {entry.previewUrl ? (
                                <img src={entry.previewUrl} alt={entry.title} loading="lazy" />
                            ) : (
                                <div className="vault-cover-placeholder">
                                    <ImageIcon size={48} />
                                    <span>No Cover Image</span>
                                </div>
                            )}
                            <div className="vault-provider-badge">
                                {getProviderIcon(entry.provider)}
                                {entry.provider}
                            </div>

                            {entry.isAccessible !== undefined && (
                                <div className={`vault-status-badge ${entry.isAccessible ? 'success' : 'error'}`} title={`Last validated: ${new Date(entry.lastValidatedAt || '').toLocaleString()}`}>
                                    {entry.isAccessible ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                    {entry.isAccessible ? 'Link Active' : 'Link Broken'}
                                </div>
                            )}
                        </div>

                        <div className="vault-content">
                            <h3 className="vault-item-title">{entry.title}</h3>
                            <div className="vault-meta">
                                <Calendar size={12} /> Shoot: {entry.dateOfShoot}
                            </div>

                            <div className="vault-info-group">
                                <div className="v-info-line">
                                    <span className="v-label">Client</span>
                                    <span className="v-value" title={entry.clientName}>{entry.clientName}</span>
                                </div>
                                <div className="v-info-line">
                                    <span className="v-label">Project</span>
                                    <span className="v-value" title={entry.projectName}>{entry.projectName}</span>
                                </div>
                                <div className="v-info-line">
                                    <span className="v-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ImageIcon size={10} /> Photos</span>
                                    <span className="v-value">{entry.photoCount ? entry.photoCount.toLocaleString() : '---'} images</span>
                                </div>
                                <div className="v-info-line">
                                    <span className="v-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HardDrive size={10} /> File Size</span>
                                    <span className="v-value">{entry.folderSizeMb ? (entry.folderSizeMb > 1000 ? `${(entry.folderSizeMb / 1024).toFixed(2)} GB` : `${entry.folderSizeMb} MB`) : '---'}</span>
                                </div>
                                <div className="v-info-line" style={{ marginTop: '8px' }}>
                                    <span className="v-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UserRound size={10} /> Camera</span>
                                    <span className="v-value">{entry.photographerName || 'N/A'}</span>
                                </div>
                                <div className="v-info-line">
                                    <span className="v-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Edit size={10} /> Edit</span>
                                    <span className="v-value">{entry.editorName || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="vault-footer">
                                <a href={entry.link} target="_blank" rel="noreferrer" className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ExternalLink size={14} /> Open Drive
                                </a>

                                <div className="vault-actions">
                                    <button
                                        className="v-btn"
                                        onClick={() => handleValidate(entry.id)}
                                        title="Validate Drive Link"
                                        disabled={validatingId === entry.id}
                                    >
                                        <RefreshCw size={16} className={validatingId === entry.id ? "spin-animation" : ""} />
                                    </button>
                                    <button className="v-btn" onClick={() => handleEdit(entry)} title="Edit Details"><Edit size={16} /></button>
                                    <button className="v-btn danger" onClick={() => handleDelete(entry.id, entry.title)} title="Remove Entry"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!isLoading && filteredEntries.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                        <FolderIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                        <h3>The Photo Vault is empty</h3>
                        <p style={{ marginTop: '8px' }}>Store links to your Google Drives, NAS, or external storage for easy team access.</p>
                        <button className="primary-btn" onClick={handleOpenNew} style={{ marginTop: '16px' }}>Add First Vault Link</button>
                    </div>
                )}
            </div>

            <VaultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                existingEntry={editingEntry}
            />
        </div>
    );
}
