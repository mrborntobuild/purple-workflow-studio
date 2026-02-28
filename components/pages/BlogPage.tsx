import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, User } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const FEATURED_POST = {
  title: 'How AI Creators Are Revolutionizing Video Production for Brands',
  excerpt: 'Learn how top creators on Purple Studios use AI-powered workflows to deliver cinematic-quality videos in a fraction of the time and cost of traditional production.',
  author: 'Purple Studios Team',
  date: 'Feb 12, 2026',
  readTime: '8 min read',
  category: 'Industry Insights',
};

const POSTS = [
  { title: '5 Things to Include in Your Creative Brief', excerpt: 'Writing a clear brief is the key to getting great results when hiring a creator. Here\'s what top clients always include.', author: 'Jessica Moore', date: 'Feb 10, 2026', readTime: '5 min', category: 'Client Tips' },
  { title: 'Creator Spotlight: Emi Tanaka on Motion Graphics', excerpt: 'We sat down with Emi Tanaka, one of our top-rated motion graphics creators, to learn how she builds her AI workflows.', author: 'Purple Studios Team', date: 'Feb 7, 2026', readTime: '6 min', category: 'Creator Spotlights' },
  { title: 'Understanding AI Workflows: A Client\'s Guide', excerpt: 'New to AI content creation? Here\'s everything you need to know about how creators use node-based workflows to produce your content.', author: 'Alex Kim', date: 'Feb 4, 2026', readTime: '7 min', category: 'Tutorials' },
  { title: 'How to Choose the Right Creator for Your Project', excerpt: 'With hundreds of talented creators on the platform, here\'s how to find the perfect match for your specific needs and budget.', author: 'Purple Studios Team', date: 'Jan 30, 2026', readTime: '4 min', category: 'Client Tips' },
  { title: 'The Future of Creative Hiring: AI + Human Talent', excerpt: 'AI isn\'t replacing creators — it\'s empowering them. Discover how the best results come from human creativity amplified by AI tools.', author: 'Marcus Rivera', date: 'Jan 25, 2026', readTime: '9 min', category: 'Industry Insights' },
  { title: 'Setting Your Rates: A Guide for New Creators', excerpt: 'Just joined Purple Studios as a creator? Here\'s how to price your services competitively while reflecting your true value.', author: 'Priya Patel', date: 'Jan 20, 2026', readTime: '5 min', category: 'Creator Tips' },
];

const CATEGORIES = ['All', 'Client Tips', 'Creator Tips', 'Creator Spotlights', 'Tutorials', 'Industry Insights'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filtered = POSTS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Blog & Resources</h1>
          <p className="mt-3 text-gray-400">Tips, tutorials, creator spotlights, and insights on AI-powered creative hiring</p>
        </div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/10 to-[#0e0e11] overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-purple-900/30 to-purple-600/10 flex items-center justify-center">
              <div className="text-gray-600 text-sm">Featured Image</div>
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">{FEATURED_POST.category}</span>
              <h2 className="mt-3 text-2xl font-bold leading-tight">{FEATURED_POST.title}</h2>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{FEATURED_POST.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><User size={12} />{FEATURED_POST.author}</span>
                <span>{FEATURED_POST.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{FEATURED_POST.readTime}</span>
              </div>
              <div className="mt-6">
                <button className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
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

        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-purple-500/20 transition-all cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-purple-900/15 to-purple-600/5 flex items-center justify-center">
                <div className="text-gray-600 text-xs">Article Image</div>
              </div>
              <div className="p-5">
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-300">
                  {post.category}
                </span>
                <h3 className="mt-2 font-semibold text-sm leading-snug group-hover:text-purple-300 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-500">
                  <span>{post.author}</span>
                  <span>&middot;</span>
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
