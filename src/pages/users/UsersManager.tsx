import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Shield, Mail, Phone, ExternalLink, UserCog, ToggleRight, ToggleLeft } from 'lucide-react';
import { usersApi } from '../../services/api/users';
import type { User, Role } from '../../types';
import { UserModal } from '../../components/users/UserModal';
import './UsersManager.css';

export function UsersManager() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'team' | 'clients' | 'roles'>('team');

    // Mock role permissions state
    const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>({
        'Admin': ['leads', 'users', 'photos', 'videos', 'social', 'projects', 'finance', 'subscriptions'],
        'Manager': ['leads', 'users', 'photos', 'videos', 'social', 'projects', 'finance', 'subscriptions'],
        'Photographer': ['photos', 'projects'],
        'Videographer': ['videos', 'projects'],
        'Editor': ['photos', 'videos', 'social', 'projects'],
        'Accountant': ['finance'],
        'Client': ['photos', 'videos']
    });

    const ALL_MODULES = [
        { id: 'leads', name: 'CRM Leads' },
        { id: 'users', name: 'Users & Roles' },
        { id: 'photos', name: 'Photo Vault' },
        { id: 'videos', name: 'Video Vault' },
        { id: 'social', name: 'Social Workflow' },
        { id: 'projects', name: 'Projects & Shoots' },
        { id: 'finance', name: 'Finances' },
        { id: 'subscriptions', name: 'Subscriptions' }
    ];

    const togglePermission = (role: Role, moduleId: string) => {
        setRolePermissions(prev => {
            const current = prev[role];
            const updated = current.includes(moduleId)
                ? current.filter(id => id !== moduleId)
                : [...current, moduleId];
            return { ...prev, [role]: updated };
        });
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await usersApi.getUsers();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenNew = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            await usersApi.deleteUser(id);
            fetchUsers();
        }
    };

    const handleSave = async (user: Omit<User, 'id'>, notifyEmail: boolean, notifyWhatsapp: boolean) => {
        if (editingUser) {
            await usersApi.updateUser(editingUser.id, user);
        } else {
            await usersApi.createUser(user, notifyEmail, notifyWhatsapp);
        }
        fetchUsers();
    };

    return (
        <div className="animate-fade-in">
            <div className="users-manager-header">
                <h1 className="users-title">Team & User Accounts</h1>
                <button className="primary-btn" onClick={handleOpenNew} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={16} /> Add User
                </button>
            </div>

            <div className="users-summary-cards">
                <div className="users-card">
                    <span className="uc-title">Total Active Users</span>
                    <span className="uc-value">{users.length}</span>
                </div>
                <div className="users-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                    <span className="uc-title">Internal Team</span>
                    <span className="uc-value">{users.filter(u => u.role !== 'Client').length}</span>
                </div>
                <div className="users-card">
                    <span className="uc-title">Client Logins</span>
                    <span className="uc-value">{users.filter(u => u.role === 'Client').length}</span>
                </div>
            </div>

            <div className="vault-tabs" style={{ marginBottom: '24px', display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
                <button
                    className={`vault-tab ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => setActiveTab('team')}
                    style={{ background: 'none', border: 'none', borderBottom: activeTab === 'team' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '12px 0', fontSize: '1rem', fontWeight: 600, color: activeTab === 'team' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    Internal Team
                </button>
                <button
                    className={`vault-tab ${activeTab === 'clients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('clients')}
                    style={{ background: 'none', border: 'none', borderBottom: activeTab === 'clients' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '12px 0', fontSize: '1rem', fontWeight: 600, color: activeTab === 'clients' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    Client Accounts
                </button>
                {currentUser?.role === 'Admin' && (
                    <button
                        className={`vault-tab ${activeTab === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roles')}
                        style={{ background: 'none', border: 'none', borderBottom: activeTab === 'roles' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '12px 0', fontSize: '1rem', fontWeight: 600, color: activeTab === 'roles' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <UserCog size={16} /> Roles & Permissions
                    </button>
                )}
            </div>

            {activeTab !== 'roles' && (
                <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{activeTab === 'team' ? 'Team Registry' : 'Client Registry'}</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User Profile</th>
                                    <th>Role & Title</th>
                                    <th>Contact info</th>
                                    <th>Credentials</th>
                                    <th>Documents</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
                                ) : users.filter(u => activeTab === 'team' ? u.role !== 'Client' : u.role === 'Client').map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        </td>
                                        <td>
                                            <div className="role-badge" data-role={user.role}>
                                                <Shield size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                {user.role}
                                            </div>
                                            {user.designation && <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>{user.designation}</div>}
                                        </td>
                                        <td>
                                            <div className="contact-line">
                                                <Mail size={12} /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="contact-line" style={{ marginTop: '4px' }}>
                                                    <Phone size={12} /> {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.75rem' }}>
                                                Username: <strong style={{ color: 'var(--accent-primary)' }}>{user.email}</strong>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                Default Pwd: {user.defaultPassword || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            {user.documents && user.documents.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {user.documents.map(d => (
                                                        <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="doc-link">
                                                            <ExternalLink size={12} /> {d.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No docs</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon" onClick={() => handleEdit(user)}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(user.id, user.name)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && users.filter(u => activeTab === 'team' ? u.role !== 'Client' : u.role === 'Client').length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No {activeTab} found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'roles' && currentUser?.role === 'Admin' && (
                <div className="roles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {(Object.keys(rolePermissions) as Role[]).map(role => (
                        <div key={role} className="glass-box" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                <div className="role-badge" data-role={role} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                                    <Shield size={14} style={{ marginRight: '6px' }} />
                                    {role} Defaults
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {rolePermissions[role].length} / {ALL_MODULES.length} modules
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {ALL_MODULES.map(module => {
                                    const hasAccess = rolePermissions[role].includes(module.id);
                                    return (
                                        <div key={module.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.875rem', color: hasAccess ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                {module.name}
                                            </span>
                                            <button
                                                onClick={() => togglePermission(role, module.id)}
                                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: hasAccess ? 'var(--success)' : 'var(--text-secondary)' }}
                                            >
                                                {hasAccess ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                existingUser={editingUser}
            />
        </div>
    );
}
