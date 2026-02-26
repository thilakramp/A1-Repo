import { useState } from 'react';
import type { SocialPost, PostStage } from '../../types/social';
import { POST_STAGES } from '../../services/api/social';
import { getPlatformColor } from '../../utils/socialUtils';
import { Calendar } from 'lucide-react';

interface PostKanbanProps {
    posts: SocialPost[];
    onEdit: (post: SocialPost) => void;
    onStageChange: (id: string, stage: PostStage) => void;
}

export function PostKanban({ posts, onEdit, onStageChange }: PostKanbanProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e: React.DragEvent, stage: PostStage) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (draggedId) {
            onStageChange(draggedId, stage);
            setDraggedId(null);
        }
    };

    return (
        <div className="social-kanban-board animate-fade-in">
            {POST_STAGES.map(stage => (
                <div
                    key={stage}
                    className="social-kanban-column"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage)}
                >
                    <div className="social-kanban-header">
                        <h3 className="social-kanban-title">{stage}</h3>
                        <span className="social-kanban-count">
                            {posts.filter(p => p.stage === stage).length}
                        </span>
                    </div>
                    <div className="social-kanban-cards">
                        {posts.filter(p => p.stage === stage).map(post => (
                            <div
                                key={post.id}
                                className="social-card-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, post.id)}
                                onClick={() => onEdit(post)}
                            >
                                <div className="social-card-title">{post.title}</div>
                                <div className="social-card-client">{post.clientName}</div>

                                <div className="social-platforms">
                                    {post.platforms.map(plat => (
                                        <span
                                            key={plat}
                                            className="platform-badge"
                                            style={{ backgroundColor: getPlatformColor(plat) }}
                                        >
                                            {plat}
                                        </span>
                                    ))}
                                </div>

                                <div className="social-card-footer">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} />
                                        {new Date(post.scheduledDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
