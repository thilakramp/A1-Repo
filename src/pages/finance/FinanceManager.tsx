import { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import { financeApi } from '../../services/api/finance';
import type { Invoice, InvoiceStatus, Transaction } from '../../types/finance';
import { formatCurrencyString } from '../../utils/financeUtils';
import { TransactionList } from '../../components/finance/TransactionList';
import { TransactionModal } from '../../components/finance/TransactionModal';
import { InvoiceList } from '../../components/finance/InvoiceList';
import { InvoiceModal } from '../../components/finance/InvoiceModal';
import './FinanceManager.css';

type Tab = 'overview' | 'invoices' | 'transactions';

export function FinanceManager() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState({ monthlyIncome: 0, monthlyExpenses: 0, monthlyProfit: 0, outstandingPayments: 0 });

    const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
    const [isInvModalOpen, setIsInvModalOpen] = useState(false);
    const [defaultTxnType, setDefaultTxnType] = useState<'Income' | 'Expense'>('Expense');

    const fetchData = useCallback(async () => {
        try {
            if (activeTab === 'overview') {
                const [st, invs, txns] = await Promise.all([
                    financeApi.getDashboardStats(),
                    financeApi.getInvoices(),
                    financeApi.getTransactions(),
                ]);
                setStats(st);
                setInvoices(invs.slice(0, 5)); // recent 5
                setTransactions(txns.slice(0, 5)); // recent 5
            } else if (activeTab === 'invoices') {
                const invs = await financeApi.getInvoices();
                setInvoices(invs);
            } else if (activeTab === 'transactions') {
                const txns = await financeApi.getTransactions();
                setTransactions(txns);
            }
        } catch (err) {
            console.error(err);
        }
    }, [activeTab]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]); // Fetch data fresh when tabs change

    const openTxnModal = (type: 'Income' | 'Expense') => {
        setDefaultTxnType(type);
        setIsTxnModalOpen(true);
    };

    const handleSaveTxn = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
        await financeApi.createTransaction(data);
        fetchData();
    };

    const handleDeleteTxn = async (id: string) => {
        await financeApi.deleteTransaction(id);
        fetchData();
    };

    const handleSaveInvoice = async (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
        await financeApi.createInvoice(data);
        fetchData();
    };

    const handleStatusChange = async (id: string, status: InvoiceStatus) => {
        await financeApi.updateInvoiceStatus(id, status);
        fetchData(); // refresh UI to maybe move it to income if paid
    };

    const handleExportPDF = () => {
        alert("This would trigger a PDF download of your Monthly Financial Report using a library like jsPDF.");
    };

    return (
        <div className="animate-fade-in">
            <div className="finance-manager-header">
                <h1 className="finance-title">Accounting & Finances</h1>
                <div className="finance-controls" style={{ display: 'flex', gap: '12px' }}>
                    <button className="secondary-btn" onClick={handleExportPDF}>
                        <Download size={16} /> Export Report
                    </button>
                    <button className="primary-btn" onClick={() => setIsInvModalOpen(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={16} /> New Invoice
                    </button>
                    <button className="primary-btn" onClick={() => openTxnModal('Expense')} style={{ backgroundColor: 'var(--danger)', color: 'white', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Plus size={16} /> Log Expense
                    </button>
                </div>
            </div>

            <div className="finance-tabs" style={{ marginBottom: '24px', display: 'inline-flex' }}>
                <button className={`finance-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`finance-tab ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>Invoices</button>
                <button className={`finance-tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="finance-summary-cards">
                        <div className="finance-card income">
                            <span className="fc-title">Monthly Income</span>
                            <span className="fc-value" style={{ color: 'var(--success)' }}>{formatCurrencyString(stats.monthlyIncome)}</span>
                        </div>
                        <div className="finance-card expense">
                            <span className="fc-title">Monthly Expenses</span>
                            <span className="fc-value" style={{ color: 'var(--danger)' }}>{formatCurrencyString(stats.monthlyExpenses)}</span>
                        </div>
                        <div className="finance-card profit">
                            <span className="fc-title">Net Profit</span>
                            <span className="fc-value" style={{ color: stats.monthlyProfit >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                                {formatCurrencyString(stats.monthlyProfit)}
                            </span>
                        </div>
                        <div className="finance-card outstanding">
                            <span className="fc-title">Outstanding Payments</span>
                            <span className="fc-value">{formatCurrencyString(stats.outstandingPayments)}</span>
                        </div>
                    </div>

                    <div className="finance-content-grid">
                        <div className="glass-box">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cashflow Analysis</h2>
                            <div className="chart-bars">
                                <div className="bar-col">
                                    <div className="bar danger" style={{ height: `${Math.min(100, (stats.monthlyExpenses / Math.max(stats.monthlyIncome, 1)) * 100)}%` }}></div>
                                    <span className="bar-label">Expenses</span>
                                </div>
                                <div className="bar-col">
                                    <div className="bar success" style={{ height: `100%` }}></div>
                                    <span className="bar-label">Income</span>
                                </div>
                                <div className="bar-col">
                                    <div className="bar" style={{ backgroundColor: 'var(--accent-primary)', height: `${Math.min(100, (Math.max(stats.monthlyProfit, 0) / Math.max(stats.monthlyIncome, 1)) * 100)}%` }}></div>
                                    <span className="bar-label">Profit</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Quick Log</h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="secondary-btn" style={{ flex: 1, borderColor: 'var(--success)', color: 'var(--success)' }} onClick={() => openTxnModal('Income')}>Add Income</button>
                                    <button className="secondary-btn" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => openTxnModal('Expense')}>Add Expense</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <InvoiceList invoices={invoices} onEdit={() => { }} onGenerateDoc={(id) => alert(`Downloading Invoice Document: ${id}.pdf ...`)} onStatusChange={handleStatusChange} />
                        <TransactionList transactions={transactions} onDelete={handleDeleteTxn} />
                    </div>
                </>
            )}

            {activeTab === 'invoices' && (
                <InvoiceList
                    invoices={invoices}
                    onEdit={() => { }}
                    onGenerateDoc={(id) => alert(`Downloading Invoice Document: ${id}.pdf ...`)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {activeTab === 'transactions' && (
                <TransactionList
                    transactions={transactions}
                    onDelete={handleDeleteTxn}
                />
            )}

            <TransactionModal
                isOpen={isTxnModalOpen}
                onClose={() => setIsTxnModalOpen(false)}
                onSave={handleSaveTxn}
                defaultType={defaultTxnType}
            />

            <InvoiceModal
                isOpen={isInvModalOpen}
                onClose={() => setIsInvModalOpen(false)}
                onSave={handleSaveInvoice}
            />
        </div>
    );
}
