import type { ProjectType, ProjectStatus } from '../types/project';

export const PROJECT_TYPES: ProjectType[] = [
    'Wedding Photography & Videography',
    'Corporate Event Coverage',
    'Product Photography',
    'Commercial Production',
    'Personal Branding',
    'Social Media Monthly Plan'
];

export const PROJECT_STATUSES: ProjectStatus[] = [
    'Pre-production',
    'Shoot Completed',
    'Editing',
    'Client Review',
    'Delivered'
];

export function getStatusColor(status: ProjectStatus): string {
    switch (status) {
        case 'Pre-production': return 'var(--warning)';
        case 'Shoot Completed': return 'var(--accent-primary)';
        case 'Editing': return 'var(--text-secondary)';
        case 'Client Review': return 'var(--accent-hover)';
        case 'Delivered': return 'var(--success)';
        default: return 'var(--text-secondary)';
    }
}

export function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    }).format(date);
}
