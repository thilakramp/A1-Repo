export type PostStage = 'Idea' | 'In Production' | 'Ready for Approval' | 'Approved' | 'Scheduled' | 'Posted';
export type SocialPlatform = 'Instagram' | 'YouTube' | 'TikTok' | 'LinkedIn';

export interface SocialPost {
    id: string;
    clientId: string;
    clientName: string; // Denotes branding client
    title: string;
    stage: PostStage;
    platforms: SocialPlatform[];
    scheduledDate: string; // ISO date
    caption: string;
    mediaUrls: string[];
    createdAt: string;
    updatedAt: string;
}

export interface MonthlyPerformance {
    id: string;
    clientId: string;
    clientName: string;
    month: string; // YYYY-MM
    reach: number;
    engagement: number; // percentage or raw number
    followersGrowth: number;
    notes: string;
}
