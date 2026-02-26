import { useState, useEffect } from 'react';
import { LayoutList, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarView } from '../../components/projects/CalendarView';
import { ProjectListView } from '../../components/projects/ProjectListView';
import { ProjectModal } from '../../components/projects/ProjectModal';
import { projectApi } from '../../services/api/project';
import type { Project } from '../../types/project';
import './ProjectManager.css';

type ViewMode = 'list' | 'calendar';

export function ProjectManager() {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await projectApi.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenNewModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            await projectApi.createProject(projectData);
            fetchProjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
        try {
            await projectApi.updateProject(id, updates);
            fetchProjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await projectApi.deleteProject(id);
            fetchProjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="projects-manager-header">
                <h1 className="projects-title">Projects & Shoots</h1>

                <div className="projects-controls">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <LayoutList size={16} /> List
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            <CalendarIcon size={16} /> Calendar
                        </button>
                    </div>

                    <button className="add-lead-btn" onClick={handleOpenNewModal}>
                        <Plus size={18} /> New Project
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading projects...
                </div>
            ) : (
                <>
                    {viewMode === 'calendar' ? (
                        <CalendarView
                            projects={projects}
                            onEventClick={handleEditProject}
                        />
                    ) : (
                        <ProjectListView
                            projects={projects}
                            onProjectClick={handleEditProject}
                        />
                    )}
                </>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProject}
                onUpdate={handleUpdateProject}
                onDelete={handleDeleteProject}
                existingProject={editingProject}
            />
        </div>
    );
}
