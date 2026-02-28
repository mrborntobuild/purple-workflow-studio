import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Image, Video, Music, Upload, DollarSign,
  Calendar, Sparkles, ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const CONTENT_TYPES = [
  { id: 'video', label: 'Video / Film', icon: Video, desc: 'Short films, ads, social videos, music videos' },
  { id: 'image', label: 'Images / Photos', icon: Image, desc: 'Product photos, art, portraits, graphics' },
  { id: 'motion', label: 'Motion Graphics', icon: Sparkles, desc: 'Animations, intros, explainers, transitions' },
  { id: 'audio', label: 'Audio / Music', icon: Music, desc: 'Music, voiceovers, sound design, podcasts' },
];

const BUDGET_RANGES = ['$100 – $300', '$300 – $700', '$700 – $1,500', '$1,500 – $3,000', '$3,000+'];
const DEADLINES = ['ASAP (Rush)', '1 week', '2 weeks', '1 month', 'Flexible'];
const AI_TOOLS = ['Flux Pro', 'Kling AI', 'MiniMax', 'Midjourney', 'DALL-E', 'Runway', 'ElevenLabs', 'No Preference'];

export default function PostBriefPage() {
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const totalSteps = 4;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Post a Brief</h1>
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-purple-600 rounded-full"
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step 1: Content Type */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">What type of content do you need?</h2>
              <p className="text-sm text-gray-400">Select the primary type of content you want a creator to produce for you.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                    contentType === type.id
                      ? 'border-purple-500/30 bg-purple-600/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    contentType === type.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'
                  }`}>
                    <type.icon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Brief Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Describe your project</h2>
              <p className="text-sm text-gray-400">The more detail you provide, the better creators can understand your vision.</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Product Launch Video for New Sneaker Line"
                  className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Project Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe what you need, the style you're going for, any references, target audience, and how the content will be used..."
                  className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Reference Files (optional)</label>
                <div className="rounded-xl border border-dashed border-white/10 bg-[#0e0e11] p-8 text-center cursor-pointer hover:border-purple-500/30 transition-all">
                  <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-600 mt-1">Images, videos, PDFs, mood boards — up to 50 MB</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Budget & Timeline */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Budget & Timeline</h2>
              <p className="text-sm text-gray-400">Set your budget range and deadline so creators can plan accordingly.</p>
            </div>
            <div>
              <label className="mb-3 block text-xs font-medium text-gray-400">Budget Range</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {BUDGET_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => setBudget(range)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      budget === range
                        ? 'border-purple-500/30 bg-purple-600/10 text-purple-300'
                        : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-3 block text-xs font-medium text-gray-400">Deadline</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {DEADLINES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeadline(d)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      deadline === d
                        ? 'border-purple-500/30 bg-purple-600/10 text-purple-300'
                        : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: AI Tool Preferences */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">AI Tool Preferences</h2>
              <p className="text-sm text-gray-400">Select any AI tools you'd like the creator to use. This helps us match you with the right person.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedTools.includes(tool)
                      ? 'border-purple-500/30 bg-purple-600/10 text-purple-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {selectedTools.includes(tool) && <Check size={14} className="inline mr-1.5" />}
                  {tool}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#0e0e11] p-6">
              <h3 className="font-semibold text-sm mb-4">Brief Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Content Type</span>
                  <span className="text-gray-300 capitalize">{contentType || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Title</span>
                  <span className="text-gray-300 truncate ml-4">{title || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget</span>
                  <span className="text-gray-300">{budget || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deadline</span>
                  <span className="text-gray-300">{deadline || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Tools</span>
                  <span className="text-gray-300">{selectedTools.length > 0 ? selectedTools.join(', ') : '—'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          ) : <div />}
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500">
              <Check size={16} />
              Submit Brief
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
