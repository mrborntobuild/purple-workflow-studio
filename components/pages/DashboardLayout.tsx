import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Search, FolderOpen,
  CreditCard, Star, User, LogOut, Bell, ChevronDown, Sparkles
} from 'lucide-react';
import { useCredits } from '../../contexts/CreditContext';

const sidebarLinks = [
  { label: 'Dashboard', href: '/client-dashboard', icon: LayoutDashboard },
  { label: 'Post a Brief', href: '/post-brief', icon: FileText },
  { label: 'Browse & Search', href: '/browse', icon: Search },
  { label: 'Projects', href: '/project/1', icon: FolderOpen },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Reviews', href: '/reviews', icon: Star },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { credits } = useCredits();

  return (
    <div className="flex min-h-screen bg-[#050506] text-white font-sans" style={{ overflow: 'auto', height: '100vh', touchAction: 'auto' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col border-r border-white/5 bg-[#0a0a0c]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/5">
          <div className="h-9 w-9 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)]" />
          <span className="text-lg font-bold tracking-tight">Purple Studios</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/5 px-3 py-4 space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <User size={18} />
            Profile
          </Link>
          <Link
            to="/landing"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl px-8 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              {sidebarLinks.find((l) => location.pathname.startsWith(l.href))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/buy-credits" className="flex items-center gap-2 rounded-xl bg-[#1a1b1e] hover:bg-[#222326] border border-white/5 px-3.5 py-2 text-xs font-medium text-gray-400 transition-colors">
              <Sparkles size={14} className="text-yellow-500" />
              <span>{credits.toLocaleString()} credits</span>
            </Link>
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-purple-600 text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 cursor-pointer hover:bg-white/10 transition-all">
              <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                JD
              </div>
              <span className="text-sm font-medium">John Doe</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
