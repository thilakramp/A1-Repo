import type { Lead } from '../../types/crm';

// --- MOCK DATA ---
let MOCK_LEADS: Lead[] = [
    {
        id: 'lead-1',
        name: 'Sarah Jenkins',
        phone: '+1 555-0198',
        email: 'sarah.j@techstart.io',
        company: 'TechStart',
        source: 'Website',
        stage: 'New',
        socials: { linkedin: 'linkedin.com/in/sjenkins' },
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
        name: 'Michael Chang',
        phone: '+1 555-0234',
        email: 'm.chang@designco.com',
        company: 'Design Co',
        source: 'Instagram',
        stage: 'Contacted',
        socials: { instagram: '@mikechang_design' },
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
        name: 'Emma Watson',
        phone: '+1 555-0912',
        email: 'emma@bloomfloral.com',
        company: 'Bloom Floral',
        source: 'Referral',
        stage: 'Meeting Scheduled',
        socials: {},
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
        return [...MOCK_LEADS];
    }

    /**
     * Create a new lead (e.g., from Website Enquiry or Manual Entry)
     */
    async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
        await delay(600);
        const newLead: Lead = {
            ...leadData,
            id: `lead-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        MOCK_LEADS.push(newLead);
        return newLead;
    }

    /**
     * Update an existing lead.
     */
    async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
        await delay(500);
        const index = MOCK_LEADS.findIndex(l => l.id === id);
        if (index === -1) throw new Error('Lead not found');

        const updatedLead = {
            ...MOCK_LEADS[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_LEADS[index] = updatedLead;
        return updatedLead;
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
