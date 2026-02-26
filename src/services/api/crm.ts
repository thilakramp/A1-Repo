import type { Lead } from '../../types/crm';
import { MOCK_CLIENTS } from './client';

// --- MOCK DATA ---
let MOCK_LEADS: Lead[] = [
    {
        id: 'lead-1',
        clientId: 'client-1',
        source: 'Website',
        stage: 'New',
        budget: '$5,000 - $10,000',
        requirements: 'Needs a corporate promo video for their upcoming product launch.',
        notes: 'Very interested in drone footage.',
        assignedTo: '2', // Manager User ID
        followUpDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'lead-2',
        clientId: 'client-2',
        source: 'Instagram',
        stage: 'Contacted',
        budget: '$2,000',
        requirements: 'Photography session for team headshots.',
        notes: 'Wants outdoor lighting setup.',
        assignedTo: '3', // Photographer User ID
        followUpDate: new Date().toISOString(), // Today
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 'lead-3',
        clientId: 'client-3',
        source: 'Referral',
        stage: 'Meeting Scheduled',
        budget: '$15,000',
        requirements: 'Full branding content package (Photo + Video array)',
        notes: 'Referred by John Doe. High priority.',
        assignedTo: '1', // Admin
        followUpDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function hydrateLead(lead: Lead): Lead {
    return {
        ...lead,
        client: MOCK_CLIENTS.find(c => c.id === lead.clientId)
    };
}

class CrmService {
    /**
     * Fetch all leads.
     */
    async capturePublicLead(data: Omit<Lead, 'id' | 'stage' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
        await delay(300);
        // In reality, this validates the _apiKey to a known TenantId, inserts the record, possibly triggers a webhook.
        const lead: Lead = {
            ...data,
            id: `lead-${Date.now()}`,
            stage: 'New',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_LEADS.unshift(lead); // Put at top
        return lead;
    }

    async getLeads(): Promise<Lead[]> {
        await delay(500); // Simulate network latency
        return MOCK_LEADS.map(hydrateLead);
    }

    /**
     * Create a new lead (e.g., from Website Enquiry or Manual Entry)
     */
    async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
        await delay(600);
        const { client, ...restData } = leadData;
        const newLead: Lead = {
            ...restData,
            id: `lead-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        MOCK_LEADS.push(newLead);
        return hydrateLead(newLead);
    }

    /**
     * Update an existing lead.
     */
    async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
        await delay(500);
        const index = MOCK_LEADS.findIndex(l => l.id === id);
        if (index === -1) throw new Error('Lead not found');

        const { client, ...restUpdates } = updates;
        const updatedLead = {
            ...MOCK_LEADS[index],
            ...restUpdates,
            updatedAt: new Date().toISOString()
        };
        MOCK_LEADS[index] = updatedLead;
        return hydrateLead(updatedLead);
    }

    /**
     * Delete a lead.
     */
    async deleteLead(id: string): Promise<void> {
        await delay(400);
        MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== id);
    }

    /**
     * Fetch leads needing follow-up today or earlier.
     */
    async getPendingFollowUps(): Promise<Lead[]> {
        await delay(300);
        const now = new Date();
        return MOCK_LEADS.filter(l => new Date(l.followUpDate) <= now && l.stage !== 'Completed' && l.stage !== 'Lost');
    }

    /**
     * Get summarized stats for Dashboard integration.
     */
    async getStats() {
        await delay(300);
        const totalLeads = MOCK_LEADS.length;
        const convertedLeads = MOCK_LEADS.filter(l => l.stage === 'Converted' || l.stage === 'Completed').length;
        const pendingFollowUps = (await this.getPendingFollowUps()).length;
        return {
            totalLeads,
            convertedLeads,
            pendingFollowUps
        };
    }
}

export const crmApi = new CrmService();
