import { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { KanbanView } from '../../components/crm/KanbanView';
import { ListView } from '../../components/crm/ListView';
import { LeadModal } from '../../components/crm/LeadModal';
import { crmApi } from '../../services/api/crm';
import type { Lead, PipelineStage } from '../../types/crm';
import './LeadsManager.css';

type ViewMode = 'kanban' | 'list';

export function LeadsManager() {
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        // Optimistic UI update
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
        try {
            await crmApi.updateLead(leadId, { stage: newStage });
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

    const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            await crmApi.createLead(leadData);
            fetchLeads();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create lead', error);
        }
    };

    const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
        try {
            await crmApi.updateLead(id, updates);
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
