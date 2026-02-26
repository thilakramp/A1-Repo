import { useState } from 'react';
import { Phone, FileText, Calendar } from 'lucide-react';
import type { Lead, PipelineStage } from '../../types/crm';
import { PIPELINE_STAGES, formatDate, isOverdue, truncateText } from '../../utils/crmUtils';
import './KanbanView.css';

interface KanbanViewProps {
    leads: Lead[];
    onStageChange: (leadId: string, newStage: PipelineStage) => void;
    onEditLead: (lead: Lead) => void;
}

export function KanbanView({ leads, onStageChange, onEditLead }: KanbanViewProps) {
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', leadId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('text/plain');
        if (leadId && leadId === draggedLeadId) {
            onStageChange(leadId, targetStage);
        }
        setDraggedLeadId(null);
    };

    return (
        <div className="kanban-board">
            {PIPELINE_STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.stage === stage);

                return (
                    <div
                        key={stage}
                        className="kanban-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage)}
                    >
                        <div className="kanban-column-header">
                            <span className="column-title">{stage}</span>
                            <span className="column-count">{stageLeads.length}</span>
                        </div>

                        <div className="kanban-column-body">
                            {stageLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    className="lead-card"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    onClick={() => onEditLead(lead)}
                                >
                                    <div className="lead-header">
                                        <div>
                                            <div className="lead-name">{lead.client?.name || 'Unknown Client'}</div>
                                            {lead.client?.company && <div className="lead-company">{lead.client.company}</div>}
                                        </div>
                                        <span className="lead-source-badge">{lead.source}</span>
                                    </div>

                                    <div className="lead-details">
                                        <div className="lead-detail-item">
                                            <Phone size={12} />
                                            {lead.client?.phone || '-'}
                                        </div>
                                        {lead.requirements && (
                                            <div className="lead-detail-item">
                                                <FileText size={12} />
                                                <span title={lead.requirements}>{truncateText(lead.requirements, 30)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="lead-footer">
                                        <span className="lead-value">{lead.budget || '-'}</span>

                                        <div className={`follow-up-badge ${isOverdue(lead.followUpDate) ? 'overdue' : ''}`}>
                                            <Calendar size={12} />
                                            {formatDate(lead.followUpDate)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
