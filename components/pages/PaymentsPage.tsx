import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft,
  Clock, CheckCircle, FileText, Download, Shield
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const STATS = [
  { label: 'Total Spent', value: '$2,450', icon: DollarSign, color: 'purple' },
  { label: 'In Escrow', value: '$700', icon: Shield, color: 'yellow' },
  { label: 'Released', value: '$1,750', icon: CheckCircle, color: 'green' },
];

const TRANSACTIONS = [
  { id: 1, type: 'escrow_fund', description: 'Funded project: Brand Video Series', amount: '$900', date: 'Feb 5, 2026', status: 'completed', project: 'Brand Video Series', creator: 'Sarah Chen' },
  { id: 2, type: 'milestone_release', description: 'Milestone release: Concept & Storyboard', amount: '$200', date: 'Feb 8, 2026', status: 'completed', project: 'Brand Video Series', creator: 'Sarah Chen' },
  { id: 3, type: 'escrow_fund', description: 'Funded project: Social Media Content Package', amount: '$400', date: 'Feb 3, 2026', status: 'completed', project: 'Social Content Package', creator: 'Marcus Rivera' },
  { id: 4, type: 'milestone_release', description: 'Milestone release: Content Batch 1', amount: '$150', date: 'Feb 10, 2026', status: 'completed', project: 'Social Content Package', creator: 'Marcus Rivera' },
  { id: 5, type: 'milestone_release', description: 'Milestone release: Content Batch 2', amount: '$150', date: 'Feb 14, 2026', status: 'completed', project: 'Social Content Package', creator: 'Marcus Rivera' },
  { id: 6, type: 'escrow_fund', description: 'Funded project: AI Product Photography', amount: '$600', date: 'Feb 12, 2026', status: 'completed', project: 'AI Product Photography', creator: 'Emi Tanaka' },
  { id: 7, type: 'workflow_purchase', description: 'Purchased: Cinematic Portrait Pipeline', amount: '$29', date: 'Jan 28, 2026', status: 'completed', project: 'Workflow Store', creator: 'Sarah Chen' },
];

const INVOICES = [
  { id: 'INV-001', project: 'Brand Video Series', creator: 'Sarah Chen', amount: '$900', date: 'Feb 5, 2026', status: 'partial' },
  { id: 'INV-002', project: 'Social Content Package', creator: 'Marcus Rivera', amount: '$400', date: 'Feb 3, 2026', status: 'paid' },
  { id: 'INV-003', project: 'AI Product Photography', creator: 'Emi Tanaka', amount: '$600', date: 'Feb 12, 2026', status: 'escrow' },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Payments & Escrow</h1>
          <p className="mt-1 text-sm text-gray-400">Manage project funding, track milestone releases, and view invoices</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${
                stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-green-500/10 text-green-400'
              }`}>
                <stat.icon size={20} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-white/[0.02] border border-white/5 p-1">
          {(['transactions', 'invoices'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-purple-600/10 text-purple-300 border border-purple-500/20'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === 'escrow_fund' ? 'bg-yellow-500/10 text-yellow-400' :
                  tx.type === 'milestone_release' ? 'bg-green-500/10 text-green-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {tx.type === 'escrow_fund' && <Shield size={18} />}
                  {tx.type === 'milestone_release' && <ArrowUpRight size={18} />}
                  {tx.type === 'workflow_purchase' && <Download size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{tx.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{tx.creator} &middot; {tx.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-white">{tx.amount}</div>
                  <div className="text-[10px] text-gray-500 capitalize">{tx.status}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Invoices */}
        {activeTab === 'invoices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-purple-400">{inv.id}</td>
                      <td className="px-5 py-4 text-sm text-gray-300">{inv.project}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{inv.creator}</td>
                      <td className="px-5 py-4 text-sm font-bold text-white">{inv.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          inv.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          inv.status === 'escrow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {inv.status === 'paid' ? 'Paid' : inv.status === 'escrow' ? 'In Escrow' : 'Partial'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
