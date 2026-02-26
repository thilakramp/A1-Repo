import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { socialApi } from '../../services/api/social';
import type { SocialPost, MonthlyPerformance, PostStage } from '../../types/social';
import { PostKanban } from '../../components/social/PostKanban';
import { PostModal } from '../../components/social/PostModal';
import './SocialManager.css';

export function SocialManager() {
    const [activeTab, setActiveTab] = useState<'content' | 'performance'>('content');
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [reports, setReports] = useState<MonthlyPerformance[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

    const fetchData = useCallback(async () => {
        try {
            if (activeTab === 'content') {
                const data = await socialApi.getPosts();
                setPosts(data);
            } else {
                const data = await socialApi.getPerformanceReports();
                setReports(data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [activeTab]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleCreatePost = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleEditPost = (post: SocialPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleSavePost = async (postData: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => {
        await socialApi.createPost(postData);
        fetchData();
    };

    const handleUpdatePost = async (id: string, updates: Partial<SocialPost>) => {
        await socialApi.updatePost(id, updates);
        fetchData();
    };

    const handleStageChange = async (id: string, stage: PostStage) => {
        // Optimistic UI
        const target = posts.find(p => p.id === id);
        if (target) {
            const oldStage = target.stage;
            setPosts(posts.map(p => p.id === id ? { ...p, stage } : p));
            try {
                await socialApi.updatePost(id, { stage });
            } catch {
                setPosts(posts.map(p => p.id === id ? { ...p, stage: oldStage } : p));
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="social-manager-header">
                <h1 className="social-title">Social Media Workflow</h1>
                {activeTab === 'content' && (
                    <button className="primary-btn" onClick={handleCreatePost} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={16} /> New Post
                    </button>
                )}
            </div>

            <div className="social-tabs">
                <button className={`social-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content Calendar & Board</button>
                <button className={`social-tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>Performance Reports</button>
            </div>

            {activeTab === 'content' && (
                <>
                    <div className="social-summary-cards">
                        <div className="social-card">
                            <span className="sc-title">Posts in Idea Stage</span>
                            <span className="sc-value">{posts.filter(p => p.stage === 'Idea').length}</span>
                        </div>
                        <div className="social-card">
                            <span className="sc-title">In Production</span>
                            <span className="sc-value" style={{ color: 'var(--accent-primary)' }}>{posts.filter(p => p.stage === 'In Production').length}</span>
                        </div>
                        <div className="social-card">
                            <span className="sc-title">Ready for Approval</span>
                            <span className="sc-value" style={{ color: 'var(--warning)' }}>{posts.filter(p => p.stage === 'Ready for Approval').length}</span>
                        </div>
                        <div className="social-card">
                            <span className="sc-title">Scheduled</span>
                            <span className="sc-value" style={{ color: 'var(--primary)' }}>{posts.filter(p => p.stage === 'Scheduled').length}</span>
                        </div>
                    </div>

                    <PostKanban
                        posts={posts}
                        onEdit={handleEditPost}
                        onStageChange={handleStageChange}
                    />
                </>
            )}

            {activeTab === 'performance' && (
                <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Monthly Performance by Client</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Branding Client</th>
                                    <th>Total Reach</th>
                                    <th>Engagement (%)</th>
                                    <th>Follower Growth</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(report => (
                                    <tr key={report.id}>
                                        <td style={{ fontWeight: 600 }}>{report.month}</td>
                                        <td>{report.clientName}</td>
                                        <td>{report.reach.toLocaleString()}</td>
                                        <td>
                                            <span style={{
                                                color: report.engagement >= 5 ? 'var(--success)' : (report.engagement >= 2 ? 'var(--warning)' : 'var(--danger)')
                                            }}>
                                                {report.engagement.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: report.followersGrowth > 0 ? 'var(--success)' : 'inherit' }}>
                                                {report.followersGrowth > 0 ? '+' : ''}{report.followersGrowth.toLocaleString()}
                                            </span>
                                        </td>
                                        <td><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{report.notes}</span></td>
                                    </tr>
                                ))}
                                {reports.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No reports available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePost}
                onUpdate={handleUpdatePost}
                existingPost={editingPost}
            />
        </div>
    );
}
