export type PipelineStage = 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Converted' | 'Completed' | 'Lost';
export type LeadSource = 'Instagram' | 'Website' | 'Referral' | 'Ads' | 'Direct Call';

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    source: LeadSource;
    stage: PipelineStage;
    socials: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
    };
    budget: string;
    requirements: string;
    notes: string;
    assignedTo: string; // User ID
    followUpDate: string; // ISO string format
    createdAt: string;
    updatedAt: string;
    logs?: LeadLog[];
}

export interface LeadLog {
    id: string;
    action: string;
    previousStage?: PipelineStage;
    newStage?: PipelineStage;
    userId: string;
    userName: string;
    timestamp: string;
}
