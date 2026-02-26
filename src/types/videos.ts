export type StorageProvider = 'Google Drive' | 'OneDrive' | 'Local NAS' | 'Other';

export interface VideoVaultEntry {
    id: string;
    title: string; // e.g. "Wedding Reception Highlights"
    projectId: string; // Optional reference
    projectName: string;
    clientId: string;
    clientName: string;
    videographerName: string; // who shot / uploaded it (changed from photographer)
    editorName: string; // who edited it
    provider: StorageProvider;
    link: string; // URL to the drive or local nas path
    previewUrl?: string; // e.g., an embedded thumbnail link
    folderSizeMb?: number; // Approximate size of the vault
    videoCount?: number; // Estimated number of videos (changed from photoCount)
    isAccessible?: boolean; // null/undefined simply means unchecked
    lastValidatedAt?: string; // ISO string of last access check
    dateOfShoot: string;
    createdAt: string;
    updatedAt: string;
}
