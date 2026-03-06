import { useState } from 'react';
import { Target, BookOpen, Users, Image as ImageIcon, Video, Share2, Scissors, WalletCards } from 'lucide-react';
import './SettingsManager.css';

type SettingsTab = 'leads' | 'clients' | 'users' | 'photos' | 'videos' | 'social' | 'projects' | 'finance';

export function SettingsManager() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('leads');

    const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { id: 'leads', label: 'CRM Leads', icon: <Target size={18} /> },
        { id: 'clients', label: 'Client Details', icon: <BookOpen size={18} /> },
        { id: 'users', label: 'Users & Roles', icon: <Users size={18} /> },
        { id: 'photos', label: 'Photo Vault', icon: <ImageIcon size={18} /> },
        { id: 'videos', label: 'Video Vault', icon: <Video size={18} /> },
        { id: 'social', label: 'Social Workflow', icon: <Share2 size={18} /> },
        { id: 'projects', label: 'Projects & Shoots', icon: <Scissors size={18} /> },
        { id: 'finance', label: 'Finances', icon: <WalletCards size={18} /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'leads':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>CRM Leads Settings</h2>
                        <p>Configure pipeline stages, lead sources, and auto-assignment rules.</p>
                        {/* Placeholder for future specific settings */}
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'clients':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Client Details Settings</h2>
                        <p>Manage client custom fields, default tags, and communication preferences.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'users':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Users & Roles Settings</h2>
                        <p>Define role permissions, access control lists, and security policies.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'photos':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Photo Vault Settings</h2>
                        <p>Configure storage quotas, accepted file types, and watermark defaults.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'videos':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Video Vault Settings</h2>
                        <p>Manage cloud storage integrations, max resolutions, and encoding options.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'social':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Social Workflow Settings</h2>
                        <p>Connect social platforms, default posting times, and content guidelines.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'projects':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Projects & Shoots Settings</h2>
                        <p>Set up project templates, equipment inventories, and default checklists.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            case 'finance':
                return (
                    <div className="settings-panel animate-fade-in">
                        <h2>Finances Settings</h2>
                        <p>Configure currency, tax rates, payment gateways, and invoice templates.</p>
                        <div className="placeholder-content">Settings coming soon...</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in settings-container">
            <div className="settings-header">
                <h1 className="settings-title">Module Settings</h1>
                <p className="settings-subtitle">Customize workflows and preferences for each module.</p>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar-menu">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`settings-menu-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-content-area">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
