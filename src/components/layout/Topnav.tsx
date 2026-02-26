import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Topnav.css';

interface TopnavProps {
    onMenuClick: () => void;
}

export function Topnav({ onMenuClick }: TopnavProps) {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

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
                    <div className="user-profile">
                        <div className="avatar">
                            {getInitials(user.name)}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
