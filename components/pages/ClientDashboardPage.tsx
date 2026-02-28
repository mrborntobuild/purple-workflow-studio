import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen, MessageSquare, Heart, DollarSign,
  ArrowRight, Clock, Star, ChevronRight, Plus
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { getAvatar } from './avatars';

const STATS = [
  { label: 'Active Projects', value: '3', icon: FolderOpen, color: 'purple' },
  { label: 'Unread Messages', value: '7', icon: MessageSquare, color: 'blue' },
  { label: 'Saved Creators', value: '12', icon: Heart, color: 'pink' },
  { label: 'Total Spent', value: '$2,450', icon: DollarSign, color: 'green' },
];

const ACTIVE_PROJECTS = [
  {
    id: 1,
    title: 'Brand Video Series for Product Launch',
    creator: 'Sarah Chen',
    creatorAvatar: 'SC',
    status: 'In Progress',
    milestone: '2 of 4',
    dueDate: 'Feb 22, 2026',
    budget: '$900',
  },
  {
    id: 2,
    title: 'Social Media Content Package',
    creator: 'Marcus Rivera',
    creatorAvatar: 'MR',
    status: 'Review Needed',
    milestone: '3 of 3',
    dueDate: 'Feb 18, 2026',
    budget: '$400',
  },
  {
    id: 3,
    title: 'AI-Generated Product Photography',
    creator: 'Emi Tanaka',
    creatorAvatar: 'ET',
    status: 'In Progress',
    milestone: '1 of 2',
    dueDate: 'Mar 1, 2026',
    budget: '$600',
  },
];

const RECENT_MESSAGES = [
  { creator: 'Sarah Chen', avatar: 'SC', message: 'I\'ve uploaded the first draft of the hero video. Let me know what you think!', time: '2h ago', unread: true },
  { creator: 'Marcus Rivera', avatar: 'MR', message: 'All 15 social posts are ready for your review. Check the project workspace.', time: '5h ago', unread: true },
  { creator: 'Emi Tanaka', avatar: 'ET', message: 'Thanks for the brief update! I\'ll have the first batch by Friday.', time: '1d ago', unread: false },
];

const SAVED_CREATORS = [
  { name: 'Luna Martinez', specialty: 'Video Production', rating: 4.8, avatar: 'LM', price: '$60/hr' },
  { name: 'Jake Thompson', specialty: '3D Modeling', rating: 4.6, avatar: 'JT', price: '$90/hr' },
  { name: 'Dev Okonkwo', specialty: 'Image Generation', rating: 4.7, avatar: 'DO', price: '$45/hr' },
];

export default function ClientDashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John</h1>
            <p className="mt-1 text-sm text-gray-400">Here's what's happening with your projects</p>
          </div>
          <Link
            to="/post-brief"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
          >
            <Plus size={16} />
            Post a Brief
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                  stat.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Projects</h2>
            <Link to="/project/1" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {ACTIVE_PROJECTS.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all"
              >
                <img src={getAvatar(project.creator)} alt={project.creator} className="h-10 w-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{project.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">with {project.creator} &middot; Milestone {project.milestone}</div>
                </div>
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === 'Review Needed'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {project.dueDate}
                  </span>
                  <span className="text-sm font-bold text-white">{project.budget}</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Messages + Saved Creators */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Messages */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-2">
              {RECENT_MESSAGES.map((msg) => (
                <div
                  key={msg.creator}
                  className={`flex items-start gap-3 rounded-xl border p-4 transition-all cursor-pointer hover:bg-white/[0.04] ${
                    msg.unread ? 'border-purple-500/20 bg-purple-600/5' : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  <img src={getAvatar(msg.creator)} alt={msg.creator} className="h-9 w-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{msg.creator}</span>
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{msg.message}</p>
                  </div>
                  {msg.unread && <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Saved Creators */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Saved Creators</h2>
              <Link to="/browse" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Browse More <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {SAVED_CREATORS.map((creator) => (
                <Link
                  key={creator.name}
                  to={`/creator/1`}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all"
                >
                  <img src={getAvatar(creator.name)} alt={creator.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{creator.name}</div>
                    <div className="text-xs text-gray-500">{creator.specialty}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {creator.rating}
                  </div>
                  <span className="text-sm font-bold text-purple-400">{creator.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
