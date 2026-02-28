import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Explore', href: '/explore' },
  { label: 'Workflows', href: '/workflows' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans" style={{ overflow: 'auto', height: '100vh', touchAction: 'auto' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]" />
            <span className="text-lg font-bold tracking-tight">Purple Studios</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-[#050506]/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col gap-2 px-6 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-4">
                  <Link to="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white">
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-xl bg-purple-600 px-5 py-2.5 text-center text-sm font-bold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <main className="pt-[73px]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050506]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-purple-600" />
                <span className="font-bold">Purple Studios</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The AI-powered creative marketplace connecting clients with top creators.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Platform</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/explore" className="text-sm text-gray-500 hover:text-white transition-colors">Explore</Link>
                <Link to="/workflows" className="text-sm text-gray-500 hover:text-white transition-colors">Workflows</Link>
                <Link to="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Resources</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
                <Link to="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors">How It Works</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Account</h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors">Log in</Link>
                <Link to="/signup" className="text-sm text-gray-500 hover:text-white transition-colors">Sign up</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Purple Studios. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
