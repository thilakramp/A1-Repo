import { useState, useEffect } from 'react';
import { Search, Trash2, Mail, Phone } from 'lucide-react';
import { clientApi } from '../../services/api/client';
import type { Client } from '../../types/client';
import { useAuth } from '../../context/AuthContext';
import { truncateText } from '../../utils/crmUtils';
import './ClientsManager.css';

export function ClientsManager() {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Deletion
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const data = await clientApi.getClients();
            setClients(data);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClient = async (id: string, name: string) => {
        if (user?.role !== 'Admin') {
            alert('Only an Admin can delete client records.');
            return;
        }

        if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
            setIsDeleting(true);
            try {
                await clientApi.deleteClient(id);
                setClients(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete client', error);
                alert('Failed to delete client');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in clients-manager">
            <div className="clients-header">
                <div>
                    <h1 className="clients-title">Client Details</h1>
                    <p className="clients-subtitle">Manage your CRM central client information.</p>
                </div>

                <div className="clients-controls">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="clients-table-container">
                {isLoading ? (
                    <div className="loading-state">Loading clients...</div>
                ) : (
                    <table className="clients-table">
                        <thead>
                            <tr>
                                <th>Name & Company</th>
                                <th>Contact Information</th>
                                <th>Social Handles</th>
                                <th>Added Date</th>
                                {user?.role === 'Admin' && <th className="text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td>
                                        <div className="client-name">{client.name}</div>
                                        {client.company && <div className="client-company">{client.company}</div>}
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <span><Phone size={14} /> {client.phone || '-'}</span>
                                            <span><Mail size={14} /> {client.email ? truncateText(client.email, 22) : '-'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="social-handles">
                                            {client.socials?.instagram && <div>IG: {client.socials.instagram}</div>}
                                            {client.socials?.linkedin && <div>LI: {client.socials.linkedin}</div>}
                                            {client.socials?.twitter && <div>TW: {client.socials.twitter}</div>}
                                            {(!client.socials?.instagram && !client.socials?.linkedin && !client.socials?.twitter) && '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-info">
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    {user?.role === 'Admin' && (
                                        <td className="text-right">
                                            <button
                                                className="btn-delete-icon"
                                                onClick={() => handleDeleteClient(client.id, client.name)}
                                                disabled={isDeleting}
                                                title="Only Admins can delete clients"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 5 : 4} className="empty-state">
                                        No clients found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
