import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Filter, ChevronDown, Clock, DollarSign, SlidersHorizontal } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import { getAvatar } from './avatars';

const CATEGORIES = ['All', 'Image Generation', 'Video Production', 'Motion Graphics', 'AI Art', 'Branding', '3D Modeling', 'Audio'];
const SORT_OPTIONS = ['Recommended', 'Top Rated', 'Most Projects', 'Lowest Price', 'Fastest Turnaround'];

const CREATORS = [
  { id: 1, name: 'Sarah Chen', specialty: 'AI Video Production', rating: 4.9, projects: 127, price: '$50/hr', turnaround: '2-3 days', available: true },
  { id: 2, name: 'Marcus Rivera', specialty: 'Image Generation', rating: 4.8, projects: 89, price: '$65/hr', turnaround: '1-2 days', available: true },
  { id: 3, name: 'Emi Tanaka', specialty: 'Motion Graphics', rating: 5.0, projects: 203, price: '$80/hr', turnaround: '3-5 days', available: false },
  { id: 4, name: 'Alex Kim', specialty: 'AI Art Direction', rating: 4.7, projects: 64, price: '$55/hr', turnaround: '1-2 days', available: true },
  { id: 5, name: 'Priya Patel', specialty: 'Brand Design', rating: 4.9, projects: 156, price: '$70/hr', turnaround: '2-4 days', available: true },
  { id: 6, name: 'Jake Thompson', specialty: '3D Modeling', rating: 4.6, projects: 42, price: '$90/hr', turnaround: '5-7 days', available: true },
  { id: 7, name: 'Luna Martinez', specialty: 'Video Production', rating: 4.8, projects: 98, price: '$60/hr', turnaround: '3-5 days', available: false },
  { id: 8, name: 'Dev Okonkwo', specialty: 'Image Generation', rating: 4.7, projects: 73, price: '$45/hr', turnaround: '1 day', available: true },
];

const WORKFLOW_TEMPLATES = [
  { title: 'Product Photo Suite', category: 'Image', nodes: 6, price: '$19', rating: 4.8, purchases: 340 },
  { title: 'Social Reel Generator', category: 'Video', nodes: 10, price: '$39', rating: 4.9, purchases: 210 },
  { title: 'Logo Variations Pack', category: 'Branding', nodes: 5, price: '$15', rating: 4.6, purchases: 520 },
  { title: 'AI Portrait Studio', category: 'Image', nodes: 8, price: '$29', rating: 4.7, purchases: 180 },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'creators' | 'workflows'>('creators');

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Explore Marketplace</h1>
          <p className="mt-3 text-gray-400">Discover talented AI creators and ready-to-use workflow templates</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search creators, workflows, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode('creators')}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${viewMode === 'creators' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                Creators
              </button>
              <button
                onClick={() => setViewMode('workflows')}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${viewMode === 'workflows' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                Workflows
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                  : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        {viewMode === 'creators' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CREATORS.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/creator/${creator.id}`}
                  className="group block rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all hover:border-purple-500/20 hover:bg-white/[0.04]"
                >
                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-br from-purple-900/30 to-purple-600/10 relative">
                    {creator.available && (
                      <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-[10px] font-medium text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        Available
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 -mt-8">
                    <img src={getAvatar(creator.name)} alt={creator.name} className="h-14 w-14 rounded-full object-cover border-2 border-[#050506] mb-3" />
                    <h3 className="font-semibold text-sm group-hover:text-purple-300 transition-colors">{creator.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{creator.specialty}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        {creator.rating}
                      </span>
                      <span>{creator.projects} projects</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {creator.turnaround}
                      </span>
                      <span className="text-sm font-bold text-purple-400">{creator.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Workflows Grid */}
        {viewMode === 'workflows' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_TEMPLATES.map((wf, i) => (
              <motion.div
                key={wf.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-purple-500/20 transition-all"
              >
                <div className="mb-4 h-28 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-white/5 flex items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(wf.nodes, 4) }).map((_, j) => (
                      <React.Fragment key={j}>
                        <div className="h-6 w-6 rounded bg-white/10 border border-white/10" />
                        {j < Math.min(wf.nodes, 4) - 1 && <div className="h-px w-3 bg-purple-500/40" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300 font-medium">{wf.category}</span>
                <h3 className="font-semibold text-sm mt-2 mb-1">{wf.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <Star size={11} className="text-yellow-500 fill-yellow-500" />
                  {wf.rating} &middot; {wf.purchases} purchases
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{wf.nodes} nodes</span>
                  <span className="font-bold text-sm text-white">{wf.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
