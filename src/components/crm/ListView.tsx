import { Phone, Mail, Calendar } from 'lucide-react';
import type { Lead } from '../../types/crm';
import { formatDate, isOverdue, truncateText } from '../../utils/crmUtils';
import './ListView.css';

interface ListViewProps {
    leads: Lead[];
    onEditLead: (lead: Lead) => void;
}

export function ListView({ leads, onEditLead }: ListViewProps) {
    return (
        <div className="list-view-container">
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
                    {leads.map((lead) => (
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
                    {leads.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                                No leads found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
