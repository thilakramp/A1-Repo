import { useState } from 'react';
import { X, User, Shield, Bell, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './ProfileSettingsModal.css';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'profile' | 'security' | 'preferences';

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    // MOCK FORM STATE
    const [formData, setFormData] = useState({
        firstName: user?.name.split(' ')[0] || '',
        lastName: user?.name.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        mobile: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        whatsapp2FA: false,
        emailNotifications: true,
        whatsappNotifications: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API Saving
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 800);
    };

    return (
        <div className="modal-overlay">
            <div className="profile-settings-modal animate-fade-in">
                <div className="modal-header">
                    <h2 className="modal-title">Settings</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="settings-container">
                    <div className="settings-sidebar">
                        <button
                            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} /> Profile
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={18} /> Security
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
                            onClick={() => setActiveTab('preferences')}
                        >
                            <Bell size={18} /> Preferences
                        </button>
                    </div>

                    <div className="settings-content">
                        <form onSubmit={handleSubmit} className="settings-form">

                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="tab-pane animate-fade-in">
                                    <h3 className="tab-title">Profile Information</h3>

                                    <div className="profile-picture-section">
                                        <div className="current-avatar">
                                            {formData.firstName[0]}{formData.lastName[0] || ''}
                                        </div>
                                        <div className="avatar-actions">
                                            <button type="button" className="btn-secondary btn-sm">
                                                <ImageIcon size={16} /> Change Picture
                                            </button>
                                            <p className="helper-text">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            <input required name="firstName" className="form-input" value={formData.firstName} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input required name="lastName" className="form-input" value={formData.lastName} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" required name="email" className="form-input" value={formData.email} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Mobile Number</label>
                                        <input type="tel" name="mobile" className="form-input" placeholder="+1 (555) 000-0000" value={formData.mobile} onChange={handleChange} />
                                    </div>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="tab-pane animate-fade-in">
                                    <h3 className="tab-title">Security & Password</h3>

                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input type="password" name="currentPassword" className="form-input" value={formData.currentPassword} onChange={handleChange} />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <input type="password" name="newPassword" className="form-input" value={formData.newPassword} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Confirm Password</label>
                                            <input type="password" name="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="settings-divider"></div>

                                    <h4 className="sub-title">Two-Factor Authentication (2FA)</h4>
                                    <div className="toggle-group">
                                        <div>
                                            <div className="toggle-label">WhatsApp Messenger 2FA</div>
                                            <div className="helper-text">Receive authentication codes via WhatsApp when logging in.</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" name="whatsapp2FA" checked={formData.whatsapp2FA} onChange={handleChange} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* PREFERENCES TAB */}
                            {activeTab === 'preferences' && (
                                <div className="tab-pane animate-fade-in">
                                    <h3 className="tab-title">App Preferences</h3>

                                    <div className="setting-item">
                                        <div>
                                            <div className="toggle-label">Color Theme</div>
                                            <div className="helper-text">Currently using {theme} mode.</div>
                                        </div>
                                        <button type="button" className="btn-secondary btn-sm" onClick={toggleTheme}>
                                            Toggle Theme
                                        </button>
                                    </div>

                                    <div className="settings-divider"></div>

                                    <h4 className="sub-title">Notifications</h4>

                                    <div className="toggle-group">
                                        <div>
                                            <div className="toggle-label">Email Notifications</div>
                                            <div className="helper-text">Receive daily digests and important alerts via email.</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-group" style={{ marginTop: '16px' }}>
                                        <div>
                                            <div className="toggle-label">WhatsApp Notifications</div>
                                            <div className="helper-text">Get instant messages for CRM updates to your mobile.</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" name="whatsappNotifications" checked={formData.whatsappNotifications} onChange={handleChange} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="settings-footer">
                                <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
