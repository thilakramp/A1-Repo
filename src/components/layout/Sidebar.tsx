import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Target,
    Image as ImageIcon,
    Video,
    Scissors,
    WalletCards,
    LogOut,
    Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    id: string;
    path: string;
    label: string;
    icon: React.ReactNode;
    allowedRoles?: Role[];
}

const navItems: NavItem[] = [
    { id: 'dashboard', path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', path: '/leads', label: 'CRM Leads', icon: <Target size={20} />, allowedRoles: ['Admin', 'Manager'] },
    { id: 'users', path: '/users', label: 'Users & Roles', icon: <Users size={20} />, allowedRoles: ['Admin', 'Manager'] },
    { id: 'photos', path: '/photos', label: 'Photo Vault', icon: <ImageIcon size={20} />, allowedRoles: ['Admin', 'Manager', 'Photographer', 'Editor', 'Client'] },
    { id: 'videos', path: '/videos', label: 'Video Vault', icon: <Video size={20} />, allowedRoles: ['Admin', 'Manager', 'Videographer', 'Editor', 'Client'] },
    { id: 'social', path: '/social', label: 'Social Workflow', icon: <Share2 size={20} />, allowedRoles: ['Admin', 'Manager', 'Editor'] },
    { id: 'projects', path: '/projects', label: 'Projects & Shoots', icon: <Scissors size={20} />, allowedRoles: ['Admin', 'Manager', 'Editor', 'Photographer', 'Videographer'] },
    { id: 'finance', path: '/finance', label: 'Finances', icon: <WalletCards size={20} />, allowedRoles: ['Admin', 'Manager', 'Accountant'] },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();

    const filteredNavItems = navItems.filter(item => {
        if (!item.allowedRoles) return true;
        return user && item.allowedRoles.includes(user.role);
    });

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 30 }}
                    onClick={onClose}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    A1 Media
                </div>

                <nav className="sidebar-nav">
                    {filteredNavItems.map(item => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth <= 768) onClose();
                            }}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
