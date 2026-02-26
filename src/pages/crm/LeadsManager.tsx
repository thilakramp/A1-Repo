import { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { KanbanView } from '../../components/crm/KanbanView';
import { ListView } from '../../components/crm/ListView';
import { LeadModal } from '../../components/crm/LeadModal';
import type { LeadFormData } from '../../components/crm/LeadModal';
import { useAuth } from '../../context/AuthContext';
import { crmApi } from '../../services/api/crm';
import { clientApi } from '../../services/api/client';
import type { Lead, PipelineStage, LeadLog } from '../../types/crm';
import './LeadsManager.css';

type ViewMode = 'kanban' | 'list';

export function LeadsManager() {
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const data = await crmApi.getLeads();
            setLeads(data);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStageChange = async (leadId: string, newStage: PipelineStage) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead || lead.stage === newStage) return;

        const logEntry: LeadLog = {
            id: `log-${Date.now()}`,
            action: 'Stage Changed',
            previousStage: lead.stage,
            newStage,
            userId: user?.id || 'sys',
            userName: user?.name || 'System',
            timestamp: new Date().toISOString()
        };
        const newLogs = [...(lead.logs || []), logEntry];

        // Optimistic UI update
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, logs: newLogs } : l));
        try {
            await crmApi.updateLead(leadId, { stage: newStage, logs: newLogs });
        } catch (error) {
            console.error('Failed to update stage:', error);
            // Revert on failure
            fetchLeads();
        }
    };

    const handleOpenNewModal = () => {
        setEditingLead(null);
        setIsModalOpen(true);
    };

    const handleSaveLead = async (formData: LeadFormData) => {
        try {
            // Create client first
            const newClient = await clientApi.createClient({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                company: formData.company,
                socials: formData.socials,
            });

            await crmApi.createLead({
                clientId: newClient.id,
                source: formData.source,
                stage: formData.stage,
                budget: formData.budget,
                requirements: formData.requirements,
                notes: formData.notes,
                assignedTo: formData.assignedTo,
                followUpDate: formData.followUpDate,
            });
            fetchLeads();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create lead', error);
        }
    };

    const handleUpdateLead = async (id: string, updates: Partial<LeadFormData>) => {
        try {
            const lead = leads.find(l => l.id === id);
            if (!lead) return;

            // 1. Update client info
            if (updates.name !== undefined || updates.phone !== undefined || updates.email !== undefined || updates.company !== undefined || updates.socials !== undefined) {
                await clientApi.updateClient(lead.clientId, {
                    name: updates.name,
                    phone: updates.phone,
                    email: updates.email,
                    company: updates.company,
                    socials: updates.socials
                });
            }

            // 2. Update lead properties
            const leadUpdates: Partial<Lead> = {
                source: updates.source,
                stage: updates.stage,
                budget: updates.budget,
                requirements: updates.requirements,
                notes: updates.notes,
                assignedTo: updates.assignedTo,
                followUpDate: updates.followUpDate
            };

            const finalUpdates = { ...leadUpdates };
            if (updates.stage && updates.stage !== lead.stage) {
                const logEntry: LeadLog = {
                    id: `log-${Date.now()}`,
                    action: 'Stage Changed',
                    previousStage: lead.stage,
                    newStage: updates.stage,
                    userId: user?.id || 'sys',
                    userName: user?.name || 'System',
                    timestamp: new Date().toISOString()
                };
                finalUpdates.logs = [...(lead.logs || []), logEntry];
            }
            await crmApi.updateLead(id, finalUpdates);
            fetchLeads();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update lead', error);
        }
    };

    const handleDeleteLead = async (id: string) => {
        try {
            await crmApi.deleteLead(id);
            fetchLeads();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to delete lead', error);
        }
    };

    const handleEditLead = (lead: Lead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <div className="leads-manager-header">
                <h1 className="leads-title">CRM Pipeline</h1>

                <div className="leads-controls">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                            onClick={() => setViewMode('kanban')}
                        >
                            <LayoutGrid size={16} /> Kanban
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} /> List
                        </button>
                    </div>

                    <button className="add-lead-btn" onClick={handleOpenNewModal}>
                        <Plus size={18} /> New Lead
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading leads...
                </div>
            ) : (
                <>
                    {viewMode === 'kanban' ? (
                        <KanbanView
                            leads={leads}
                            onStageChange={handleStageChange}
                            onEditLead={handleEditLead}
                        />
                    ) : (
                        <ListView
                            leads={leads}
                            onEditLead={handleEditLead}
                        />
                    )}
                </>
            )}

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLead}
                onUpdate={handleUpdateLead}
                onDelete={handleDeleteLead}
                existingLead={editingLead}
            />
        </div>
    );
}
