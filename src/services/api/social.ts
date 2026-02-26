import type { SocialPost, MonthlyPerformance, PostStage, SocialPlatform } from '../../types/social';

export const SOCIAL_PLATFORMS: SocialPlatform[] = ['Instagram', 'YouTube', 'TikTok', 'LinkedIn'];
export const POST_STAGES: PostStage[] = ['Idea', 'In Production', 'Ready for Approval', 'Approved', 'Scheduled', 'Posted'];

const MOCK_POSTS: SocialPost[] = [
    {
        id: 'post-1',
        clientId: 'client-1',
        clientName: 'TechCorp Inc',
        title: 'New Feature Announcement',
        stage: 'Scheduled',
        platforms: ['LinkedIn', 'Instagram'],
        scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString(),
        caption: 'We are thrilled to announce our latest feature that will revolutionize your workflow! 🚀 #TechNews #Innovation',
        mediaUrls: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'post-2',
        clientId: 'client-2',
        clientName: 'Sarah Jenkins',
        title: 'Behind the Scenes: Wedding Shoot',
        stage: 'In Production',
        platforms: ['Instagram', 'TikTok'],
        scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        caption: 'A sneak peek into how we capture the magic! ✨💍 #WeddingPhotography #BTS',
        mediaUrls: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'post-3',
        clientId: 'client-1',
        clientName: 'TechCorp Inc',
        title: 'Employee Spotlight: Jane Doe',
        stage: 'Idea',
        platforms: ['LinkedIn'],
        scheduledDate: new Date(Date.now() + 10 * 86400000).toISOString(),
        caption: 'Meet Jane, our lead engineer...',
        mediaUrls: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const MOCK_PERFORMANCE: MonthlyPerformance[] = [
    {
        id: 'perf-1',
        clientId: 'client-1',
        clientName: 'TechCorp Inc',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        reach: 45000,
        engagement: 4.2,
        followersGrowth: 1250,
        notes: 'Strong growth on LinkedIn due to feature announcement.'
    },
    {
        id: 'perf-2',
        clientId: 'client-2',
        clientName: 'Sarah Jenkins',
        month: new Date().toISOString().slice(0, 7),
        reach: 120000,
        engagement: 8.5,
        followersGrowth: 3400,
        notes: 'TikTok Reel went viral!'
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class SocialService {
    async getPosts(): Promise<SocialPost[]> {
        await delay(300);
        return [...MOCK_POSTS];
    }

    async getPerformanceReports(): Promise<MonthlyPerformance[]> {
        await delay(200);
        return [...MOCK_PERFORMANCE];
    }

    async createPost(data: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
        await delay(400);
        const post: SocialPost = {
            ...data,
            id: `post-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_POSTS.push(post);
        return post;
    }

    async updatePost(id: string, updates: Partial<SocialPost>): Promise<SocialPost> {
        await delay(400);
        const index = MOCK_POSTS.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Post not found');

        const updated = {
            ...MOCK_POSTS[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_POSTS[index] = updated;
        return updated;
    }

    async deletePost(id: string): Promise<void> {
        await delay(300);
        const index = MOCK_POSTS.findIndex(p => p.id === id);
        if (index > -1) MOCK_POSTS.splice(index, 1);
    }

    async createReport(data: Omit<MonthlyPerformance, 'id'>): Promise<MonthlyPerformance> {
        await delay(400);
        const report: MonthlyPerformance = { ...data, id: `perf-${Date.now()}` };
        MOCK_PERFORMANCE.push(report);
        return report;
    }
}

export const socialApi = new SocialService();
