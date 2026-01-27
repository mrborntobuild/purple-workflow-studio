import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Clock, FileText, LogOut, Grid, List, Folder, Share2, BookOpen, MoreHorizontal, Layout, X } from 'lucide-react';
import { Workflow, WorkflowFilters } from '../services/apiService';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SortDropdown, { SortOption, SortOrder } from './dashboard/SortDropdown';
import FilterPanel, { FilterState } from './dashboard/FilterPanel';

interface WorkflowDashboardProps {
  workflows: Workflow[];
  onOpenWorkflow: (id: string, title?: string) => void;
  onNewWorkflow: () => void;
  onDeleteWorkflow: (id: string) => void;
  onFiltersChange?: (filters: WorkflowFilters) => void;
  isLoading?: boolean;
}

// Mock Templates Data
const TEMPLATES = [
  { id: 't1', title: 'Image Generator', color: 'from-purple-500 to-indigo-600', icon: '🎨' },
  { id: 't2', title: 'Text to Video', color: 'from-pink-500 to-rose-600', icon: '🎥' },
  { id: 't3', title: 'Upscaling Workflow', color: 'from-blue-500 to-cyan-600', icon: '⚡️' },
  { id: 't4', title: 'Social Media Post', color: 'from-orange-500 to-amber-600', icon: '📱' },
];

const SidebarItem = ({ icon, label, active = false, count, onClick }: { icon: React.ReactNode, label: string, active?: boolean, count?: number, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
    )}
  </div>
);

const WorkflowCard = ({ workflow, onOpen, onDelete, confirmDeleteId }: { workflow: Workflow, onOpen: () => void, onDelete: (id: string) => void, confirmDeleteId: string | null }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4 }}
    className="group relative flex flex-col bg-[#1a1b1e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all cursor-pointer"
    onClick={onOpen}
  >
    {/* Thumbnail Area */}
    <div className="aspect-[16/10] w-full bg-[#111214] relative overflow-hidden">
      {(workflow as any).thumbnail_url ? (
        <img src={(workflow as any).thumbnail_url} alt={workflow.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Abstract placeholder pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Layout size={24} className="text-gray-500 group-hover:text-purple-400" />
          </div>
        </div>
      )}
      
      {/* Overlay Actions */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(workflow.id!);
          }}
          className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
            confirmDeleteId === workflow.id 
              ? 'bg-red-500/80 text-white hover:bg-red-600' 
              : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    {/* Content Area */}
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-1 truncate">{workflow.title || 'Untitled Workflow'}</h3>
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-[10px] text-gray-500">Edited {new Date(workflow.updatedAt || Date.now()).toLocaleDateString()}</span>
        <span className="text-[10px] text-gray-500">•</span>
        <span className="text-[10px] text-gray-500">{workflow.nodes?.length || 0} nodes</span>
      </div>
    </div>
  </motion.div>
);

const TemplateCard = ({ template, onClick, showComingSoon = false }: { template: typeof TEMPLATES[0], onClick?: () => void, showComingSoon?: boolean }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="group flex-shrink-0 w-64 h-32 rounded-2xl relative overflow-hidden cursor-pointer bg-[#1a1b1e] border border-white/5 hover:border-white/10 transition-all"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
    
    {showComingSoon && (
      <div className="absolute top-3 right-3 z-20">
        <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full border border-purple-400/20 uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
    )}

    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
        {template.icon}
      </div>
      <span className="font-semibold text-white">{template.title}</span>
    </div>
  </motion.div>
);

type ActiveSection = 'my-workflows' | 'shared-with-me' | 'projects' | 'templates' | 'tutorials';

// LocalStorage keys for persisting preferences
const STORAGE_KEYS = {
  sortBy: 'dashboard_sortBy',
  sortOrder: 'dashboard_sortOrder',
  filters: 'dashboard_filters',
};

const getStoredPreferences = () => {
  try {
    return {
      sortBy: (localStorage.getItem(STORAGE_KEYS.sortBy) as SortOption) || 'updated_at',
      sortOrder: (localStorage.getItem(STORAGE_KEYS.sortOrder) as SortOrder) || 'desc',
      filters: JSON.parse(localStorage.getItem(STORAGE_KEYS.filters) || '{}'),
    };
  } catch {
    return { sortBy: 'updated_at' as SortOption, sortOrder: 'desc' as SortOrder, filters: {} };
  }
};

const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  workflows,
  onOpenWorkflow,
  onNewWorkflow,
  onDeleteWorkflow,
  onFiltersChange,
  isLoading = false
}) => {
  const stored = getStoredPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('my-workflows');
  const [sortBy, setSortBy] = useState<SortOption>(stored.sortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(stored.sortOrder);
  const [filterState, setFilterState] = useState<FilterState>({
    dateFrom: stored.filters.dateFrom ? new Date(stored.filters.dateFrom) : null,
    dateTo: stored.filters.dateTo ? new Date(stored.filters.dateTo) : null,
    status: stored.filters.status || 'all',
  });
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Build filters object and notify parent
  const buildFilters = useCallback((): WorkflowFilters => {
    return {
      search: searchQuery || undefined,
      dateFrom: filterState.dateFrom || undefined,
      dateTo: filterState.dateTo || undefined,
      status: filterState.status !== 'all' ? filterState.status : undefined,
      sortBy,
      sortOrder,
    };
  }, [searchQuery, filterState, sortBy, sortOrder]);

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      const filters = buildFilters();
      onFiltersChange(filters);
    }
  }, [buildFilters, onFiltersChange]);

  // Persist preferences to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sortBy, sortBy);
    localStorage.setItem(STORAGE_KEYS.sortOrder, sortOrder);
    localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify({
      dateFrom: filterState.dateFrom?.toISOString(),
      dateTo: filterState.dateTo?.toISOString(),
      status: filterState.status,
    }));
  }, [sortBy, sortOrder, filterState]);

  // Handle sort change
  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle filter change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilterState(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterState({
      dateFrom: null,
      dateTo: null,
      status: 'all',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || filterState.dateFrom || filterState.dateTo || filterState.status !== 'all';

  // Client-side filtering as fallback (server-side is preferred via onFiltersChange)
  const filteredWorkflows = workflows.filter(workflow =>
    (workflow.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDeleteWorkflow(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      // Auto-clear confirm after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#050506] text-gray-300 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#0e0e11]">
        {/* User Profile Dropdown */}
        <div className="p-4 border-b border-white/5">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 transition-colors text-left group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.user_metadata?.full_name || 'My Workspace'}</div>
              <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
            </div>
            <MoreHorizontal size={16} className="text-gray-600 group-hover:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button 
            onClick={onNewWorkflow}
            className="w-full mb-6 bg-[#E0E7FF] hover:bg-white text-[#4338CA] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="text-sm">New Workflow</span>
          </button>

          <div className="mb-6">
            <div className="px-3 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Library</div>
            <SidebarItem 
              icon={<Grid size={18} />} 
              label="My Workflows" 
              active={activeSection === 'my-workflows'} 
              count={workflows.length}
              onClick={() => setActiveSection('my-workflows')}
            />
            <SidebarItem 
              icon={<Share2 size={18} />} 
              label="Shared with me" 
              active={activeSection === 'shared-with-me'}
              onClick={() => setActiveSection('shared-with-me')}
            />
            <SidebarItem 
              icon={<Folder size={18} />} 
              label="Projects" 
              active={activeSection === 'projects'}
              onClick={() => setActiveSection('projects')}
            />
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Resources</div>
            <SidebarItem 
              icon={<BookOpen size={18} />} 
              label="Templates" 
              active={activeSection === 'templates'}
              onClick={() => setActiveSection('templates')}
            />
            <SidebarItem 
              icon={<Layout size={18} />} 
              label="Tutorials" 
              active={activeSection === 'tutorials'}
              onClick={() => setActiveSection('tutorials')}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050506]/80 backdrop-blur-xl z-[60]">
          <h1 className="text-xl font-bold text-white">
            {activeSection === 'my-workflows' && 'My Workflows'}
            {activeSection === 'shared-with-me' && 'Shared with me'}
            {activeSection === 'projects' && 'Projects'}
            {activeSection === 'templates' && 'Templates'}
            {activeSection === 'tutorials' && 'Tutorials'}
          </h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#1a1b1e] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter and Sort controls - only show for my-workflows */}
            {activeSection === 'my-workflows' && (
              <>
                <FilterPanel
                  filters={filterState}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
                <SortDropdown
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </>
            )}

            {/* View toggle */}
            {(activeSection === 'my-workflows' || activeSection === 'shared-with-me') && (
              <div className="flex gap-1 bg-[#1a1b1e] p-1 rounded-lg border border-white/5">
                <button className="p-1.5 bg-white/10 rounded text-white"><Grid size={16} /></button>
                <button className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white"><List size={16} /></button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
          {/* My Workflows Section */}
          {activeSection === 'my-workflows' && (
            <>
              {/* Templates Section */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Start from a template</h2>
                  <button 
                    onClick={() => setActiveSection('templates')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {TEMPLATES.slice(0, 4).map(t => (
                    <TemplateCard 
                      key={t.id} 
                      template={t} 
                      showComingSoon={true}
                      onClick={() => {
                        // Template clicked - could create a new workflow from template
                        onNewWorkflow();
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Workflows Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Workflows</h2>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                  </div>
                ) : filteredWorkflows.length === 0 && hasActiveFilters ? (
                  // Empty state when filters return no results
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-[#1a1b1e]/30">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Search className="text-gray-600" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No matching workflows</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-xs text-center">
                      No workflows match your current filters. Try adjusting your search or filter criteria.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1b1e] border border-white/10 hover:bg-white/5 text-white rounded-xl font-medium transition-colors"
                    >
                      <X size={18} />
                      Clear Filters
                    </button>
                  </div>
                ) : filteredWorkflows.length === 0 ? (
                  // Empty state when there are no workflows at all
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-[#1a1b1e]/30">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <FileText className="text-gray-600" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No workflows yet</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-xs text-center">
                      Create a new workflow or start from a template to begin building your AI pipeline.
                    </p>
                    <button
                      onClick={onNewWorkflow}
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <Plus size={18} />
                      Create New Workflow
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredWorkflows.map((workflow) => (
                      <WorkflowCard 
                        key={workflow.id} 
                        workflow={workflow} 
                        onOpen={() => workflow.id && onOpenWorkflow(workflow.id, workflow.title)}
                        onDelete={handleDelete}
                        confirmDeleteId={deleteConfirmId}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Shared with me Section */}
          {activeSection === 'shared-with-me' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Share2 className="text-gray-600" size={24} />
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-full border border-purple-400/20 uppercase tracking-wide mb-3 inline-block">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No shared workflows</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-xs text-center">
                Workflows shared with you will appear here.
              </p>
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Folder className="text-gray-600" size={24} />
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-full border border-purple-400/20 uppercase tracking-wide mb-3 inline-block">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No projects yet</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-xs text-center">
                Organize your workflows into projects to keep things organized.
              </p>
              <button
                onClick={() => {
                  // Create new project functionality can be added later
                  alert('Project creation coming soon!');
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                <Plus size={18} />
                Create New Project
              </button>
            </div>
          )}

          {/* Templates Section */}
          {activeSection === 'templates' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Workflow Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {TEMPLATES.map(t => (
                  <TemplateCard 
                    key={t.id} 
                    template={t} 
                    showComingSoon={true}
                    onClick={() => {
                      // Template clicked - create a new workflow from template
                      onNewWorkflow();
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tutorials Section */}
          {activeSection === 'tutorials' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tutorials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'tut1', title: 'Getting Started', description: 'Learn the basics of creating your first workflow', icon: '🚀' },
                  { id: 'tut2', title: 'Image Generation', description: 'Master image generation with AI models', icon: '🎨' },
                  { id: 'tut3', title: 'Video Creation', description: 'Create stunning videos from text prompts', icon: '🎥' },
                  { id: 'tut4', title: 'Advanced Workflows', description: 'Build complex multi-step workflows', icon: '⚡️' },
                  { id: 'tut5', title: 'Sharing & Collaboration', description: 'Share workflows with your team', icon: '👥' },
                  { id: 'tut6', title: 'Tips & Tricks', description: 'Pro tips to optimize your workflows', icon: '💡' },
                ].map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    whileHover={{ y: -4 }}
                    className="group relative bg-[#1a1b1e] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all cursor-pointer"
                    onClick={() => {
                      // Tutorial clicked - could open tutorial content
                      alert(`Opening tutorial: ${tutorial.title}`);
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full border border-purple-400/20 uppercase tracking-wide">
                        Coming Soon
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                      {tutorial.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{tutorial.title}</h3>
                    <p className="text-xs text-gray-500">{tutorial.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkflowDashboard;
