import type { Project } from '../../types/project';

const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj-1',
        title: 'Smith Summer Wedding',
        type: 'Wedding Photography & Videography',
        clientId: 'lead-3',
        clientName: 'Emma Watson',
        shootDate: new Date(Date.now() + 432000000).toISOString(), // +5 days
        location: 'Grand Plaza Hotel, NY',
        teamIds: ['1', '3'],
        equipment: [
            { id: 'eq-1', name: 'Sony A7S III', isChecked: true },
            { id: 'eq-2', name: 'DJI Mavic 3 Drone', isChecked: false },
            { id: 'eq-3', name: 'Godox Lighting Kit', isChecked: true }
        ],
        moodboardUrl: 'https://pinterest.com/pin/mock123',
        deliverables: [
            { id: 'd-1', name: '500+ Edited Photos', isCompleted: false },
            { id: 'd-2', name: '5-Minute Highlight Reel', isCompleted: false }
        ],
        deadlineDate: new Date(Date.now() + 1296000000).toISOString(), // ~15 days
        notes: 'Prioritize low-light shots during evening reception.',
        status: 'Pre-production',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'proj-2',
        title: 'TechX Annual Conference',
        type: 'Corporate Event Coverage',
        clientId: 'lead-1',
        clientName: 'Sarah Jenkins',
        shootDate: new Date(Date.now() - 86400000).toISOString(), // -1 day
        location: 'Moscone Center, SF',
        teamIds: ['2'],
        equipment: [
            { id: 'eq-4', name: 'Canon R5', isChecked: true }
        ],
        deliverables: [
            { id: 'd-3', name: 'Same Day Edit Video', isCompleted: true },
            { id: 'd-4', name: 'Headshots folder', isCompleted: false }
        ],
        deadlineDate: new Date(Date.now() + 259200000).toISOString(), // ~3 days
        notes: 'Keynote speakers require dedicated cam operator.',
        status: 'Editing',
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
    async getProjects(): Promise<Project[]> {
        await delay(400);
        return [...MOCK_PROJECTS].sort((a, b) => new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime());
    }

    async getUpcomingShoots(limit: number = 5): Promise<Project[]> {
        await delay(200);
        const now = new Date();
        return MOCK_PROJECTS
            .filter(p => new Date(p.shootDate) >= now && p.status !== 'Delivered')
            .sort((a, b) => new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime())
            .slice(0, limit);
    }

    async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        await delay(500);
        const newProject: Project = {
            ...projectData,
            id: `proj-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        MOCK_PROJECTS.push(newProject);
        return newProject;
    }

    async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
        await delay(400);
        const index = MOCK_PROJECTS.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');

        const updated = {
            ...MOCK_PROJECTS[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        MOCK_PROJECTS[index] = updated;
        return updated;
    }

    async deleteProject(id: string): Promise<void> {
        await delay(400);
        const index = MOCK_PROJECTS.findIndex(p => p.id === id);
        if (index !== -1) MOCK_PROJECTS.splice(index, 1);
    }
}

export const projectApi = new ProjectService();
