import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Sparkles, Zap, Shield, Star,
  CheckCircle, Users, TrendingUp, Clock
} from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import { getAvatar } from './avatars';

const FEATURED_CREATORS = [
  { name: 'Sarah Chen', specialty: 'AI Video Production', rating: 4.9, projects: 127, price: '$50/hr' },
  { name: 'Marcus Rivera', specialty: 'Image Generation', rating: 4.8, projects: 89, price: '$65/hr' },
  { name: 'Emi Tanaka', specialty: 'Motion Graphics', rating: 5.0, projects: 203, price: '$80/hr' },
  { name: 'Alex Kim', specialty: 'AI Art Direction', rating: 4.7, projects: 64, price: '$55/hr' },
];

const SAMPLE_WORKFLOWS = [
  { title: 'Product Photo Enhancement', nodes: 8, runs: '2.4k', category: 'Image', price: '$29' },
  { title: 'Social Media Video Pipeline', nodes: 12, runs: '1.8k', category: 'Video', price: '$49' },
  { title: 'Brand Asset Generator', nodes: 6, runs: '3.1k', category: 'Branding', price: '$19' },
];

const STEPS = [
  { icon: Users, title: 'Post Your Brief', description: 'Describe your project, set your budget, and share examples of what you want.' },
  { icon: Sparkles, title: 'Get Matched', description: 'Browse top AI creators or let our system match you with the perfect fit.' },
  { icon: Zap, title: 'Launch & Deliver', description: 'Track progress in real-time as creators build your content using AI workflows.' },
];

export default function LandingPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              <Sparkles size={14} />
              The AI Creative Marketplace
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
              Hire Top AI Creators.{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Ship Faster.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
              Connect with expert creators who build stunning content using AI workflows.
              From concept to delivery, all powered by node-based visual pipelines.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20"
              >
                <Play size={16} />
                Explore Creators
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 mx-auto max-w-3xl grid grid-cols-3 gap-8 rounded-2xl border border-white/5 bg-white/[0.02] p-8"
          >
            {[
              { label: 'Active Creators', value: '2,400+' },
              { label: 'Projects Delivered', value: '18,000+' },
              { label: 'Avg. Turnaround', value: '48 hrs' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-gray-400">Three simple steps to bring your vision to life</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-8"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400">
                  <step.icon size={24} />
                </div>
                <div className="absolute top-8 right-8 text-5xl font-bold text-white/[0.03]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Creators</h2>
              <p className="mt-2 text-gray-400">Top-rated AI content professionals</p>
            </div>
            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_CREATORS.map((creator, i) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/creator/${i + 1}`}
                  className="group block rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-purple-500/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={getAvatar(creator.name)} alt={creator.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-sm group-hover:text-purple-300 transition-colors">{creator.name}</div>
                      <div className="text-xs text-gray-500">{creator.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      {creator.rating}
                    </span>
                    <span>{creator.projects} projects</span>
                    <span className="ml-auto font-medium text-purple-400">{creator.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Workflows */}
      <section className="border-t border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Popular Workflows</h2>
              <p className="mt-2 text-gray-400">Pre-built AI pipelines ready to use</p>
            </div>
            <Link
              to="/workflows"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
            >
              Browse All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SAMPLE_WORKFLOWS.map((wf, i) => (
              <motion.div
                key={wf.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-purple-500/20 transition-all"
              >
                <div className="mb-4 h-32 rounded-xl bg-gradient-to-br from-purple-900/20 to-purple-600/5 border border-white/5 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(wf.nodes, 4) }).map((_, j) => (
                      <React.Fragment key={j}>
                        <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/10" />
                        {j < Math.min(wf.nodes, 4) - 1 && <div className="h-px w-4 bg-purple-500/40" />}
                      </React.Fragment>
                    ))}
                    {wf.nodes > 4 && <span className="text-xs text-gray-500 ml-1">+{wf.nodes - 4}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300">{wf.category}</span>
                </div>
                <h3 className="font-semibold text-sm mb-2">{wf.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{wf.nodes} nodes &middot; {wf.runs} runs</span>
                  <span className="font-bold text-white">{wf.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-[#0e0e11] to-[#0e0e11] p-12 text-center md:p-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to Create?</h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">
                Join thousands of clients and creators already building amazing AI content on Purple Studios.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)]"
                >
                  Sign Up Free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white hover:bg-white/10 transition-all"
                >
                  Browse Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
