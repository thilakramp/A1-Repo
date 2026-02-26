export const PIPELINE_STAGES = [
    'New',
    'Contacted',
    'Meeting Scheduled',
    'Proposal Sent',
    'Converted',
    'Completed',
    'Lost'
] as const;

export const LEAD_SOURCES = [
    'Instagram',
    'Website',
    'Referral',
    'Ads',
    'Direct Call'
] as const;

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

export function isOverdue(isoString: string): boolean {
    const date = new Date(isoString);
    const now = new Date();

    // Set times to midnight to compare just dates
    date.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    return date < now;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
