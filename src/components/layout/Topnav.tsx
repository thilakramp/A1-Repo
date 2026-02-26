import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Moon, Sun, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import './Topnav.css';

interface TopnavProps {
    onMenuClick: () => void;
}

export function Topnav({ onMenuClick }: TopnavProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="topnav">
            <div className="topnav-left">
                <button className="menu-toggle" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
            </div>

            <div className="topnav-right">
                <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={20} />
                </button>

                {user && (
                    <div className="user-profile-container" ref={dropdownRef}>
                        <div
                            className="user-profile"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="avatar">
                                {getInitials(user.name)}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <ChevronDown size={16} className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                        </div>

                        {isDropdownOpen && (
                            <div className="profile-dropdown animate-fade-in">
                                <button className="dropdown-item" onClick={() => {
                                    setIsDropdownOpen(false);
                                    setIsSettingsModalOpen(true);
                                }}>
                                    <Settings size={16} /> Profile Settings
                                </button>
                                <button className="dropdown-item text-danger" onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout();
                                }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ProfileSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </header>
    );
}
