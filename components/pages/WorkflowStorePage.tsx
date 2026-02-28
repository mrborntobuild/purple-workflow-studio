import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Filter, ShoppingCart, Eye, Download, SlidersHorizontal } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const CATEGORIES = ['All', 'Image', 'Video', 'Branding', 'Audio', '3D', 'Social Media', 'E-commerce'];

const WORKFLOWS = [
  { id: 1, title: 'Product Photo Enhancement Suite', description: 'Enhance product photos with AI-powered color correction, background removal, and style transfer.', category: 'Image', nodes: 8, price: '$29', rating: 4.8, purchases: 340, creator: 'Sarah Chen' },
  { id: 2, title: 'Social Media Reel Generator', description: 'Auto-generate short-form video content from text prompts with transitions and effects.', category: 'Video', nodes: 12, price: '$49', rating: 4.9, purchases: 210, creator: 'Marcus Rivera' },
  { id: 3, title: 'Logo Variations Pack', description: 'Generate multiple logo variations from a single design concept using style transfer.', category: 'Branding', nodes: 5, price: '$15', rating: 4.6, purchases: 520, creator: 'Priya Patel' },
  { id: 4, title: 'AI Portrait Studio', description: 'Professional headshot enhancement and style transformation pipeline.', category: 'Image', nodes: 8, price: '$29', rating: 4.7, purchases: 180, creator: 'Emi Tanaka' },
  { id: 5, title: 'E-commerce Banner Builder', description: 'Create dynamic e-commerce banners with product placement and text overlay.', category: 'E-commerce', nodes: 10, price: '$35', rating: 4.8, purchases: 290, creator: 'Alex Kim' },
  { id: 6, title: 'Cinematic Color Grading', description: 'Apply Hollywood-grade color grading to any video using AI-powered LUTs.', category: 'Video', nodes: 6, price: '$19', rating: 4.5, purchases: 430, creator: 'Luna Martinez' },
  { id: 7, title: '3D Product Visualizer', description: 'Convert 2D product images into 3D renders with customizable lighting.', category: '3D', nodes: 14, price: '$59', rating: 4.9, purchases: 95, creator: 'Jake Thompson' },
  { id: 8, title: 'Podcast Thumbnail Maker', description: 'Generate eye-catching podcast thumbnails with AI-generated backgrounds and text.', category: 'Social Media', nodes: 4, price: '$9', rating: 4.4, purchases: 670, creator: 'Dev Okonkwo' },
  { id: 9, title: 'Brand Color Palette Generator', description: 'Automatically generate harmonious color palettes from brand assets or mood boards.', category: 'Branding', nodes: 3, price: '$12', rating: 4.6, purchases: 810, creator: 'Priya Patel' },
];

export default function WorkflowStorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filtered = WORKFLOWS.filter(
    (wf) =>
      (activeCategory === 'All' || wf.category === activeCategory) &&
      (searchQuery === '' || wf.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Workflow Template Store</h1>
          <p className="mt-3 text-gray-400">
            Browse and purchase pre-built AI workflows as digital products. Plug & play.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] pl-12 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-gray-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((wf, i) => (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-purple-500/20 transition-all"
            >
              {/* Workflow Preview */}
              <div className="h-40 bg-gradient-to-br from-purple-900/20 to-purple-600/5 border-b border-white/5 flex items-center justify-center p-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(wf.nodes, 5) }).map((_, j) => (
                    <React.Fragment key={j}>
                      <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/10 group-hover:border-purple-500/20 transition-all" />
                      {j < Math.min(wf.nodes, 5) - 1 && <div className="h-px w-4 bg-purple-500/30" />}
                    </React.Fragment>
                  ))}
                  {wf.nodes > 5 && <span className="text-xs text-gray-500">+{wf.nodes - 5}</span>}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] text-purple-300 font-medium">
                    {wf.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{wf.nodes} nodes</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-purple-300 transition-colors">{wf.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{wf.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {wf.rating}
                  </span>
                  <span>{wf.purchases} purchases</span>
                  <span>by {wf.creator}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{wf.price}</span>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                      <ShoppingCart size={14} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-lg">No workflows found matching your criteria.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-4 text-purple-400 hover:text-purple-300 text-sm">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
