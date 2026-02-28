import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Clock, CheckCircle, MessageSquare,
  ExternalLink, Play, ArrowRight, ChevronRight
} from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import { getAvatar } from './avatars';

const CREATOR = {
  name: 'Sarah Chen',
  tagline: 'AI Video & Image Production Specialist',
  bio: 'I help brands create stunning visual content using cutting-edge AI workflows. With 5+ years in creative production and 2 years specializing in AI-powered tools, I deliver high-quality results faster than traditional methods.',
  location: 'San Francisco, CA',
  memberSince: 'Jan 2024',
  rating: 4.9,
  reviewCount: 87,
  projects: 127,
  responseTime: '< 1 hour',
  available: true,
  skills: ['Flux Pro', 'Kling AI', 'MiniMax', 'ComfyUI', 'After Effects', 'Midjourney'],
};

const PACKAGES = [
  {
    tier: 'Basic',
    price: '$150',
    description: 'Perfect for simple single-asset projects',
    deliverables: ['1 AI-generated image or video', 'Up to 2 revisions', '3-day delivery', 'Source workflow included'],
  },
  {
    tier: 'Standard',
    price: '$400',
    description: 'Ideal for multi-asset campaigns',
    deliverables: ['5 AI-generated assets', 'Up to 4 revisions', '5-day delivery', 'Source workflows included', 'Style guide document'],
    popular: true,
  },
  {
    tier: 'Premium',
    price: '$900',
    description: 'Full creative production package',
    deliverables: ['Unlimited assets (up to 20)', 'Unlimited revisions', '7-day delivery', 'Custom workflow builds', 'Style guide + brand kit', 'Priority support'],
  },
];

const PORTFOLIO = [
  { title: 'Neon Cityscapes Series', category: 'Image', type: 'image' },
  { title: 'Product Launch Video', category: 'Video', type: 'video' },
  { title: 'Abstract Brand Patterns', category: 'Branding', type: 'image' },
  { title: 'Fashion Lookbook AI', category: 'Image', type: 'image' },
  { title: 'Tech Startup Promo', category: 'Video', type: 'video' },
  { title: 'Food Photography Set', category: 'Image', type: 'image' },
];

const WORKFLOWS = [
  { title: 'Cinematic Portrait Pipeline', nodes: 8, price: '$29', runs: '1.2k' },
  { title: 'Product Photo Enhancer', nodes: 6, price: '$19', runs: '2.4k' },
  { title: 'Social Video Generator', nodes: 12, price: '$49', runs: '890' },
];

const REVIEWS = [
  { author: 'Mike Johnson', rating: 5, date: 'Feb 2026', text: 'Sarah delivered incredible results. The AI workflow she built was exactly what we needed for our product launch. Highly recommend!' },
  { author: 'Lisa Park', rating: 5, date: 'Jan 2026', text: 'Fast turnaround and amazing quality. Sarah really understands how to leverage AI tools effectively.' },
  { author: 'Tom Richards', rating: 4, date: 'Dec 2025', text: 'Great work overall. The video production quality was top-notch. Would hire again for future projects.' },
];

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'workflows' | 'reviews'>('portfolio');

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex-1">
            <div className="flex items-center gap-5">
              <img src={getAvatar(CREATOR.name)} alt={CREATOR.name} className="h-20 w-20 rounded-full object-cover border-2 border-purple-500/30" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{CREATOR.name}</h1>
                  {CREATOR.available && (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      Available Now
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-400">{CREATOR.tagline}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} />{CREATOR.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />Responds {CREATOR.responseTime}</span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-400 leading-relaxed max-w-2xl">{CREATOR.bio}</p>

            {/* Stats */}
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{CREATOR.rating}</span>
                <span className="text-gray-500 text-sm">({CREATOR.reviewCount} reviews)</span>
              </div>
              <div className="text-sm text-gray-400">{CREATOR.projects} projects completed</div>
              <div className="text-sm text-gray-400">Member since {CREATOR.memberSince}</div>
            </div>

            {/* Skills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CREATOR.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="w-full md:w-80 rounded-2xl border border-white/10 bg-[#0e0e11] p-6 space-y-4">
            <Link
              to="/signup"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
            >
              Hire Me
              <ArrowRight size={16} />
            </Link>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10">
              <Play size={16} />
              Try Workflow
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10">
              <MessageSquare size={16} />
              Request Quote
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Packages & Pricing</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.tier}
                className={`relative rounded-2xl border p-6 ${
                  pkg.popular
                    ? 'border-purple-500/30 bg-purple-600/5'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{pkg.tier}</h3>
                <div className="mt-2 text-3xl font-bold text-purple-400">{pkg.price}</div>
                <p className="mt-2 text-sm text-gray-400">{pkg.description}</p>
                <ul className="mt-6 space-y-3">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={16} className="mt-0.5 text-purple-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition-all ${
                  pkg.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                    : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                }`}>
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 border-b border-white/5 mb-8">
            {(['portfolio', 'workflows', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-all border-b-2 capitalize ${
                  activeTab === tab
                    ? 'text-white border-purple-500'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PORTFOLIO.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-purple-500/20 transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-purple-600/5 flex items-center justify-center relative">
                    {item.type === 'video' && (
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-600 transition-all">
                        <Play size={20} className="text-white ml-0.5" />
                      </div>
                    )}
                    {item.type === 'image' && (
                      <div className="text-gray-600 text-sm">Preview</div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-purple-300 font-medium">{item.category}</span>
                    <h4 className="text-sm font-medium mt-1">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Workflows */}
          {activeTab === 'workflows' && (
            <div className="grid gap-4 md:grid-cols-3">
              {WORKFLOWS.map((wf) => (
                <div key={wf.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-purple-500/20 transition-all">
                  <div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-white/5 flex items-center justify-center">
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: Math.min(wf.nodes, 4) }).map((_, j) => (
                        <React.Fragment key={j}>
                          <div className="h-6 w-6 rounded bg-white/10 border border-white/10" />
                          {j < Math.min(wf.nodes, 4) - 1 && <div className="h-px w-3 bg-purple-500/40" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm">{wf.title}</h4>
                  <div className="mt-1 text-xs text-gray-400">{wf.nodes} nodes &middot; {wf.runs} runs</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-purple-400">{wf.price}</span>
                    <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      Try it <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {REVIEWS.map((review) => (
                <div key={review.author} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={getAvatar(review.author)} alt={review.author} className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-medium">{review.author}</div>
                        <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
