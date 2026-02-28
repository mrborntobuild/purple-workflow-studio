import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, MessageSquare, Paperclip, Send, Check,
  X, Clock, Download, Eye, ChevronRight, Play,
  CheckCircle, Circle, Upload
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { getAvatar } from './avatars';

const PROJECT = {
  title: 'Brand Video Series for Product Launch',
  creator: 'Sarah Chen',
  creatorAvatar: 'SC',
  status: 'In Progress',
  budget: '$900',
  startDate: 'Feb 5, 2026',
  dueDate: 'Feb 22, 2026',
  description: 'Create a series of 3 short-form videos (30-60 seconds each) for our new sneaker line launch. Videos should be cinematic with urban aesthetics, targeting 18-35 year olds on Instagram and TikTok.',
};

const MILESTONES = [
  { id: 1, title: 'Concept & Storyboard', status: 'approved', amount: '$200', date: 'Feb 8' },
  { id: 2, title: 'First Draft - Video 1', status: 'review', amount: '$250', date: 'Feb 14' },
  { id: 3, title: 'Videos 2 & 3 Draft', status: 'in_progress', amount: '$250', date: 'Feb 18' },
  { id: 4, title: 'Final Delivery & Revisions', status: 'pending', amount: '$200', date: 'Feb 22' },
];

const FILES = [
  { name: 'brand_guidelines.pdf', size: '2.4 MB', date: 'Feb 5', from: 'You' },
  { name: 'storyboard_v1.pdf', size: '1.8 MB', date: 'Feb 8', from: 'Sarah Chen' },
  { name: 'video_1_draft.mp4', size: '48 MB', date: 'Feb 14', from: 'Sarah Chen' },
  { name: 'mood_board.png', size: '5.2 MB', date: 'Feb 6', from: 'You' },
];

const MESSAGES = [
  { sender: 'Sarah Chen', avatar: 'SC', text: "Hi John! I've uploaded the first draft of Video 1. I used the Kling AI workflow with the cinematic preset we discussed. Let me know what you think!", time: '2:30 PM', isCreator: true },
  { sender: 'You', avatar: 'JD', text: "This looks amazing! Love the lighting and transitions. A few minor notes: can we make the logo reveal at the end a bit slower? And maybe add a beat drop sync at 0:22?", time: '3:15 PM', isCreator: false },
  { sender: 'Sarah Chen', avatar: 'SC', text: "Great feedback! I'll adjust the logo reveal timing and sync the beat. Should have the revision ready by tomorrow.", time: '3:45 PM', isCreator: true },
  { sender: 'You', avatar: 'JD', text: "Perfect, thanks Sarah! Also started thinking about the next two videos — I'll upload some additional reference clips.", time: '4:00 PM', isCreator: false },
];

export default function ProjectWorkspacePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'brief' | 'milestones' | 'files' | 'messages'>('milestones');
  const [newMessage, setNewMessage] = useState('');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{PROJECT.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <img src={getAvatar(PROJECT.creator)} alt={PROJECT.creator} className="h-6 w-6 rounded-full object-cover" />
                {PROJECT.creator}
              </span>
              <span className="flex items-center gap-1"><Clock size={14} />Due {PROJECT.dueDate}</span>
              <span className="font-bold text-white">{PROJECT.budget}</span>
            </div>
          </div>
          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 text-sm font-medium text-purple-400 self-start">
            {PROJECT.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-white/[0.02] border border-white/5 p-1">
          {(['brief', 'milestones', 'files', 'messages'] as const).map((tab) => (
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

        {/* Brief Tab */}
        {activeTab === 'brief' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-sm font-semibold mb-3">Project Brief</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{PROJECT.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-xs text-gray-500 mb-1">Budget</div>
                <div className="text-lg font-bold">{PROJECT.budget}</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="text-xs text-gray-500 mb-1">Timeline</div>
                <div className="text-lg font-bold">{PROJECT.startDate} → {PROJECT.dueDate}</div>
              </div>
            </div>

            {/* Workflow Viewer placeholder */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-sm font-semibold mb-4">Workflow Viewer</h3>
              <div className="h-48 rounded-xl bg-gradient-to-br from-purple-900/10 to-transparent border border-white/5 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  {['Prompt', 'Kling AI', 'Color Grade', 'Export'].map((node, j) => (
                    <React.Fragment key={node}>
                      <div className="rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-xs text-gray-300">
                        {node}
                      </div>
                      {j < 3 && <div className="h-px w-6 bg-purple-500/40" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Live workflow progress — nodes light up as the creator runs them</p>
            </div>
          </motion.div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {MILESTONES.map((ms) => (
              <div
                key={ms.id}
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${
                  ms.status === 'review'
                    ? 'border-yellow-500/20 bg-yellow-500/5'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="shrink-0">
                  {ms.status === 'approved' && <CheckCircle size={20} className="text-green-400" />}
                  {ms.status === 'review' && <Eye size={20} className="text-yellow-400" />}
                  {ms.status === 'in_progress' && <Play size={20} className="text-purple-400" />}
                  {ms.status === 'pending' && <Circle size={20} className="text-gray-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{ms.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {ms.status === 'approved' && 'Approved'}
                    {ms.status === 'review' && 'Awaiting your review'}
                    {ms.status === 'in_progress' && 'Creator is working on this'}
                    {ms.status === 'pending' && `Expected by ${ms.date}`}
                  </div>
                </div>
                <div className="text-sm font-bold text-white">{ms.amount}</div>
                {ms.status === 'review' && (
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2 text-xs font-bold text-green-400 hover:bg-green-500/20 transition-all">
                      <Check size={14} />
                      Approve
                    </button>
                    <button className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-gray-400 hover:bg-white/10 transition-all">
                      Request Revision
                    </button>
                  </div>
                )}
                {ms.status === 'approved' && (
                  <span className="rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                    Released
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-xl border border-dashed border-white/10 bg-[#0e0e11] p-6 text-center cursor-pointer hover:border-purple-500/30 transition-all">
              <Upload size={20} className="mx-auto text-gray-500 mb-2" />
              <p className="text-sm text-gray-400">Drop files here or click to upload</p>
            </div>
            <div className="space-y-2">
              {FILES.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{file.size} &middot; {file.date} &middot; {file.from}</div>
                  </div>
                  <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4 max-h-[500px] overflow-y-auto">
              {MESSAGES.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.isCreator ? '' : 'flex-row-reverse'}`}>
                  <img src={getAvatar(msg.sender)} alt={msg.sender} className="h-8 w-8 rounded-full object-cover shrink-0" />
                  <div className={`max-w-[70%] ${msg.isCreator ? '' : 'text-right'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.isCreator
                        ? 'bg-white/5 border border-white/5 text-gray-300'
                        : 'bg-purple-600/10 border border-purple-500/20 text-gray-200'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="mt-1 text-[10px] text-gray-600">{msg.sender} &middot; {msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 hover:bg-white/10 transition-all">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              <button className="rounded-xl bg-purple-600 p-3 text-white transition-all hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
