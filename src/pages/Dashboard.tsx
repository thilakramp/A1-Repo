import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { crmApi } from '../services/api/crm';
import { projectApi } from '../services/api/project';
import { subscriptionApi } from '../services/api/subscription';
import type { Project } from '../types/project';
import { Calendar, MapPin } from 'lucide-react';
import { formatDateTime } from '../utils/projectUtils';
import { formatCurrency } from '../utils/subUtils';
import './Dashboard.css';

export function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalLeads: 0, convertedLeads: 0, pendingFollowUps: 0 });
    const [subStats, setSubStats] = useState({ activeSubs: 0, overduePayments: 0, monthlyRecurringRevenue: 0 });
    const [upcomingShoots, setUpcomingShoots] = useState<Project[]>([]);

    useEffect(() => {
        async function fetchData() {
            const [data, shoots, subData] = await Promise.all([
                crmApi.getStats(),
                projectApi.getUpcomingShoots(3),
                subscriptionApi.getDashboardSummary()
            ]);
            setStats(data);
            setUpcomingShoots(shoots);
            setSubStats(subData);
        }
        fetchData();
    }, []);

    return (
        <div>
            <div className="welcome-banner">
                <h1 className="welcome-title">Welcome back, {user?.name}</h1>
                <p className="welcome-subtitle">Here's what's happening with A1 Media Service today.</p>
            </div>

            <div className="stats-grid">
                <div className="glass-panel stat-card">
                    <span className="stat-title">Total Leads</span>
                    <span className="stat-value">{stats.totalLeads}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Pending Follow-ups</span>
                    <span className="stat-value" style={{ color: stats.pendingFollowUps > 0 ? 'var(--warning)' : 'inherit' }}>
                        {stats.pendingFollowUps}
                    </span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Converted Leads</span>
                    <span className="stat-value text-success" style={{ color: 'var(--success)' }}>
                        {stats.convertedLeads}
                    </span>
                </div>
                <div className="glass-panel stat-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                    <span className="stat-title">Active Subscriptions</span>
                    <span className="stat-value">{subStats.activeSubs}</span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Monthly Revenue (MRR)</span>
                    <span className="stat-value text-success" style={{ color: 'var(--success)' }}>
                        {formatCurrency(subStats.monthlyRecurringRevenue)}
                    </span>
                </div>
                <div className="glass-panel stat-card">
                    <span className="stat-title">Overdue Payments</span>
                    <span className="stat-value" style={{ color: subStats.overduePayments > 0 ? 'var(--danger)' : 'inherit' }}>
                        {subStats.overduePayments}
                    </span>
                </div>
            </div>

            <div className="dashboard-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Quick Actions</h2>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><button className="primary-btn" style={{ width: '100%', padding: '12px' }}>Create New Lead</button></li>
                        <li><button className="secondary-btn" style={{ width: '100%', padding: '12px' }}>Upload Content</button></li>
                        <li><button className="secondary-btn" style={{ width: '100%', padding: '12px' }}>Generate Invoice</button></li>
                    </ul>
                </div>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Upcoming Shoots</h2>
                    {upcomingShoots.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {upcomingShoots.map(shoot => (
                                <li key={shoot.id} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{shoot.title}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={12} /> {formatDateTime(shoot.shootDate)}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={12} /> {shoot.location || 'TBA'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No upcoming shoots.</p>
                    )}
                </div>
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">Recent Activity</h2>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}

// Placeholder component for other routes
export function PlaceholderPage({ title }: { title: string }) {
    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>{title}</h1>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>This is a placeholder for the {title} module.</p>
            </div>
        </div>
    );
}
