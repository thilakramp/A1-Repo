import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SubscriptionListView } from '../../components/subscriptions/SubscriptionListView';
import { SubscriptionModal } from '../../components/subscriptions/SubscriptionModal';
import { subscriptionApi } from '../../services/api/subscription';
import type { Subscription, ServicePackage } from '../../types/subscription';
import { formatCurrency } from '../../utils/subUtils';
import './SubscriptionManager.css';

export function SubscriptionManager() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [summary, setSummary] = useState({ activeSubs: 0, overduePayments: 0, monthlyRecurringRevenue: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [subsData, pkgsData, summaryData] = await Promise.all([
                subscriptionApi.getSubscriptions(),
                subscriptionApi.getPackages(),
                subscriptionApi.getDashboardSummary()
            ]);
            setSubscriptions(subsData);
            setPackages(pkgsData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenNewModal = () => {
        setEditingSub(null);
        setIsModalOpen(true);
    };

    const handleEditSub = (sub: Subscription) => {
        setEditingSub(sub);
        setIsModalOpen(true);
    };

    const handleSaveSub = async (subData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            await subscriptionApi.createSubscription(subData);
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create subscription', error);
        }
    };

    const handleUpdateSub = async (id: string, updates: Partial<Subscription>) => {
        try {
            await subscriptionApi.updateSubscription(id, updates);
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to update subscription', error);
        }
    };

    const handleGenerateInvoice = async (e: React.MouseEvent, sub: Subscription) => {
        e.stopPropagation(); // Prevent opening the edit modal
        setIsGenerating(sub.id);
        try {
            const url = await subscriptionApi.generateInvoice(sub.id);
            console.log("Mock Download Invoice URL:", url);
            // Normally window.open(url)
            alert(`Invoice generated for ${sub.clientName}!\n${url}`);
        } catch (error) {
            console.error("Failed generating invoice:", error);
        } finally {
            setIsGenerating(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="subs-manager-header">
                <h1 className="subs-title">Subscriptions & Retainers</h1>
                <button className="add-lead-btn" onClick={handleOpenNewModal}>
                    <Plus size={18} /> New Subscription
                </button>
            </div>

            <div className="subs-summary-cards">
                <div className="sub-summary-card">
                    <span className="sub-summary-label">Active Subscriptions</span>
                    <span className="sub-summary-value">{summary.activeSubs}</span>
                </div>
                <div className="sub-summary-card">
                    <span className="sub-summary-label">Monthly Recurring Rev (MRR)</span>
                    <span className="sub-summary-value" style={{ color: 'var(--success)' }}>
                        {formatCurrency(summary.monthlyRecurringRevenue)}
                    </span>
                </div>
                <div className="sub-summary-card">
                    <span className="sub-summary-label">Overdue Payments</span>
                    <span className="sub-summary-value" style={{ color: summary.overduePayments > 0 ? 'var(--danger)' : 'inherit' }}>
                        {summary.overduePayments}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading subscriptions...
                </div>
            ) : (
                <SubscriptionListView
                    subscriptions={subscriptions}
                    onSubClick={handleEditSub}
                    onGenerateInvoice={handleGenerateInvoice}
                    isGenerating={isGenerating}
                />
            )}

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSub}
                onUpdate={handleUpdateSub}
                existingSub={editingSub}
                packages={packages}
            />
        </div>
    );
}
