import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Star, Clock, DollarSign, Filter,
  SlidersHorizontal, ChevronDown, MapPin, X
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { getAvatar } from './avatars';

const CONTENT_TYPES = ['All', 'Video / Film', 'Images', 'Motion Graphics', 'Branding', '3D', 'Audio'];
const INDUSTRIES = ['All', 'E-commerce', 'SaaS', 'Fashion', 'Food & Bev', 'Music', 'Real Estate', 'Gaming'];
const BUDGET_RANGES = ['Any Budget', 'Under $300', '$300 – $700', '$700 – $1,500', '$1,500+'];
const TURNAROUNDS = ['Any', '< 24 hours', '1-3 days', '3-7 days', '1-2 weeks'];
const RATINGS = ['Any', '4.5+', '4.0+', '3.5+'];
const WORKFLOW_TOOLS = ['Any', 'Flux Pro', 'Kling AI', 'MiniMax', 'Midjourney', 'Runway', 'ElevenLabs'];

const CREATORS = [
  { id: 1, name: 'Sarah Chen', specialty: 'AI Video Production', rating: 4.9, projects: 127, avatar: 'SC', price: '$50/hr', turnaround: '2-3 days', available: true, industry: 'E-commerce', tools: ['Kling AI', 'Flux Pro'] },
  { id: 2, name: 'Marcus Rivera', specialty: 'Image Generation', rating: 4.8, projects: 89, avatar: 'MR', price: '$65/hr', turnaround: '1-2 days', available: true, industry: 'Fashion', tools: ['Flux Pro', 'Midjourney'] },
  { id: 3, name: 'Emi Tanaka', specialty: 'Motion Graphics', rating: 5.0, projects: 203, avatar: 'ET', price: '$80/hr', turnaround: '3-5 days', available: false, industry: 'SaaS', tools: ['Runway', 'Kling AI'] },
  { id: 4, name: 'Alex Kim', specialty: 'AI Art Direction', rating: 4.7, projects: 64, avatar: 'AK', price: '$55/hr', turnaround: '1-2 days', available: true, industry: 'Gaming', tools: ['Midjourney', 'Flux Pro'] },
  { id: 5, name: 'Priya Patel', specialty: 'Brand Design', rating: 4.9, projects: 156, avatar: 'PP', price: '$70/hr', turnaround: '2-4 days', available: true, industry: 'SaaS', tools: ['Flux Pro'] },
  { id: 6, name: 'Jake Thompson', specialty: '3D Modeling & Video', rating: 4.6, projects: 42, avatar: 'JT', price: '$90/hr', turnaround: '5-7 days', available: true, industry: 'Real Estate', tools: ['Runway'] },
  { id: 7, name: 'Luna Martinez', specialty: 'Short Film Production', rating: 4.8, projects: 98, avatar: 'LM', price: '$60/hr', turnaround: '3-5 days', available: false, industry: 'Music', tools: ['Kling AI', 'MiniMax'] },
  { id: 8, name: 'Dev Okonkwo', specialty: 'Product Photography', rating: 4.7, projects: 73, avatar: 'DO', price: '$45/hr', turnaround: '1 day', available: true, industry: 'E-commerce', tools: ['Flux Pro'] },
  { id: 9, name: 'Mia Zhang', specialty: 'Social Content Creator', rating: 4.5, projects: 58, avatar: 'MZ', price: '$40/hr', turnaround: '1-2 days', available: true, industry: 'Food & Bev', tools: ['Midjourney', 'ElevenLabs'] },
];

export default function BrowseSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState('All');
  const [industry, setIndustry] = useState('All');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Browse & Search Creators</h1>
          <p className="mt-1 text-sm text-gray-400">Find the perfect creator to bring your vision to life</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, skill, content type, or tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              showFilters ? 'border-purple-500/30 bg-purple-600/10 text-purple-300' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-white/10 bg-[#0e0e11] p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none"
                >
                  {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none"
                >
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Budget Range</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none">
                  {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Minimum Rating</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none">
                  {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Turnaround</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none">
                  {TURNAROUNDS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Workflow Tools</label>
                <select className="w-full rounded-xl border border-white/10 bg-[#111114] px-3 py-2.5 text-sm text-gray-300 focus:border-purple-500 focus:outline-none">
                  {WORKFLOW_TOOLS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-purple-500">
                Apply Filters
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/10">
                Reset
              </button>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{CREATORS.length}</span> creators
        </div>

        {/* Results Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CREATORS.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/creator/${creator.id}`}
                className="group block rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-purple-500/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={getAvatar(creator.name)} alt={creator.name} className="h-11 w-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm group-hover:text-purple-300 transition-colors truncate">{creator.name}</span>
                      {creator.available && (
                        <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" title="Available" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{creator.specialty}</div>
                  </div>
                  <span className="text-sm font-bold text-purple-400">{creator.price}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {creator.tools.map((tool) => (
                    <span key={tool} className="rounded-full bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] text-gray-400">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {creator.rating}
                  </span>
                  <span>{creator.projects} projects</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {creator.turnaround}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
