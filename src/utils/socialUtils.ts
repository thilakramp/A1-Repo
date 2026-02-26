import type { PostStage, SocialPlatform } from '../types/social';

export function getStageColor(stage: PostStage): string {
    switch (stage) {
        case 'Idea': return 'var(--text-secondary)';
        case 'In Production': return 'var(--accent-primary)';
        case 'Ready for Approval': return 'var(--warning)';
        case 'Approved': return 'var(--success)';
        case 'Scheduled': return 'var(--primary-color)';
        case 'Posted': return '#10b981'; // distinct green
        default: return 'var(--text-secondary)';
    }
}

export function getPlatformColor(platform: SocialPlatform): string {
    switch (platform) {
        case 'Instagram': return '#e1306c';
        case 'YouTube': return '#ff0000';
        case 'TikTok': return '#25f4ee';
        case 'LinkedIn': return '#0077b5';
        default: return 'var(--text-secondary)';
    }
}
