export type ProjectType =
    | 'Wedding Photography & Videography'
    | 'Corporate Event Coverage'
    | 'Product Photography'
    | 'Commercial Production'
    | 'Personal Branding'
    | 'Social Media Monthly Plan';

export type ProjectStatus =
    | 'Pre-production'
    | 'Shoot Completed'
    | 'Editing'
    | 'Client Review'
    | 'Delivered';

export interface EquipmentItem {
    id: string;
    name: string;
    isChecked: boolean;
}

export interface DeliverableItem {
    id: string;
    name: string;
    isCompleted: boolean;
}

export interface Project {
    id: string;
    title: string;
    type: ProjectType;
    clientId: string; // Ref to a lead or client
    clientName: string; // Denormalized for display
    shootDate: string; // ISO DateTime
    location: string;
    teamIds: string[]; // User IDs
    equipment: EquipmentItem[];
    moodboardUrl?: string; // S3 or Drive link
    deliverables: DeliverableItem[];
    deadlineDate: string; // ISO Date
    notes: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}
