import { Calendar, MapPin, Users as UsersIcon } from 'lucide-react';
import type { Project } from '../../types/project';
import { formatDateTime, getStatusColor } from '../../utils/projectUtils';
import './ProjectListView.css';

interface ProjectListViewProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export function ProjectListView({ projects, onProjectClick }: ProjectListViewProps) {
    return (
        <div className="projects-table-container animate-fade-in">
            <table className="projects-table">
                <thead>
                    <tr>
                        <th>Project Details</th>
                        <th>Client</th>
                        <th>Shoot Info</th>
                        <th>Status</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id} onClick={() => onProjectClick(project)}>
                            <td>
                                <div className="project-title">{project.title}</div>
                                <div className="project-type">{project.type}</div>
                            </td>
                            <td>
                                <div style={{ fontWeight: 500 }}>{project.clientName}</div>
                            </td>
                            <td>
                                <div className="project-date-cell">
                                    <span className="project-date-item">
                                        <Calendar size={12} />
                                        {formatDateTime(project.shootDate)}
                                    </span>
                                    <span className="project-date-item">
                                        <MapPin size={12} />
                                        {project.location || 'TBA'}
                                    </span>
                                    <span className="project-date-item">
                                        <UsersIcon size={12} />
                                        {project.teamIds.length > 0 ? `${project.teamIds.length} members` : 'Unassigned'}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <div
                                    className="project-status-badge"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${getStatusColor(project.status)} 15%, transparent)`,
                                        color: getStatusColor(project.status)
                                    }}
                                >
                                    <span className="status-dot" style={{ backgroundColor: getStatusColor(project.status) }} />
                                    {project.status}
                                </div>
                            </td>
                            <td>
                                <div className="project-date-item" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                    <Calendar size={12} />
                                    {new Date(project.deadlineDate).toLocaleDateString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {projects.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                No projects found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
