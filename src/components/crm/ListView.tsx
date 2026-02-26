import { useState } from 'react';
import { Phone, Mail, Calendar, Search, Filter } from 'lucide-react';
import type { Lead } from '../../types/crm';
import { formatDate, isOverdue, truncateText, PIPELINE_STAGES, LEAD_SOURCES } from '../../utils/crmUtils';
import './ListView.css';

interface ListViewProps {
    leads: Lead[];
    onEditLead: (lead: Lead) => void;
}

export function ListView({ leads, onEditLead }: ListViewProps) {
    const [sourceFilter, setSourceFilter] = useState<string>('');
    const [stageFilter, setStageFilter] = useState<string>('');
    const [budgetFilter, setBudgetFilter] = useState<string>('');
    const [followUpFilter, setFollowUpFilter] = useState<string>('all');

    const filteredLeads = leads.filter(lead => {
        // Source
        if (sourceFilter && lead.source !== sourceFilter) return false;
        // Stage
        if (stageFilter && lead.stage !== stageFilter) return false;
        // Budget
        if (budgetFilter && !lead.budget.toLowerCase().includes(budgetFilter.toLowerCase())) return false;
        // Follow Up
        if (followUpFilter !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const leadDate = new Date(lead.followUpDate);
            leadDate.setHours(0, 0, 0, 0);

            if (followUpFilter === 'overdue') {
                if (!isOverdue(lead.followUpDate)) return false;
            } else if (followUpFilter === 'today') {
                if (leadDate.getTime() !== today.getTime()) return false;
            } else if (followUpFilter === 'upcoming') {
                if (leadDate.getTime() <= today.getTime()) return false;
            }
        }
        return true;
    });

    return (
        <div className="list-view-container">
            <div className="list-filters-bar">
                <div className="filter-group">
                    <Filter size={16} className="filter-icon" />
                    <span>Filters:</span>
                </div>
                <div className="filter-controls">
                    <select
                        className="list-filter-select"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                    >
                        <option value="">All Stages</option>
                        {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        className="list-filter-select"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                    >
                        <option value="">All Sources</option>
                        {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        className="list-filter-select"
                        value={followUpFilter}
                        onChange={(e) => setFollowUpFilter(e.target.value)}
                    >
                        <option value="all">All Follow-ups</option>
                        <option value="overdue">Overdue</option>
                        <option value="today">Today</option>
                        <option value="upcoming">Upcoming</option>
                    </select>

                    <div className="budget-search-container">
                        <Search size={14} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search budget..."
                            className="list-budget-input"
                            value={budgetFilter}
                            onChange={(e) => setBudgetFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="crm-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Stage</th>
                            <th>Source</th>
                            <th>Budget</th>
                            <th>Follow Up</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} onClick={() => onEditLead(lead)}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{lead.name}</div>
                                    {lead.company && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lead.company}</div>}
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <span className="contact-item">
                                            <Phone size={12} /> {lead.phone}
                                        </span>
                                        <span className="contact-item">
                                            <Mail size={12} /> {truncateText(lead.email, 20)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className="stage-badge">{lead.stage}</span>
                                </td>
                                <td>
                                    <span className="source-cell">{lead.source}</span>
                                </td>
                                <td style={{ fontWeight: 500 }}>
                                    {lead.budget || '-'}
                                </td>
                                <td>
                                    <div
                                        className="contact-item"
                                        style={{ color: isOverdue(lead.followUpDate) ? 'var(--danger)' : 'inherit' }}
                                    >
                                        <Calendar size={12} />
                                        {formatDate(lead.followUpDate)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
