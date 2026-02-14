
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '../services/supabaseClient';
import { motion } from 'framer-motion';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  created_at: string;
  credits: number;
  total_credits: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, email, company, created_at, credits, total_credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setCompany(data.company || '');
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        company: company.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050506]">
        <Loader2 size={24} className="text-purple-500 animate-spin" />
      </div>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-5 mb-10">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
              {(firstName || profile?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="rounded-2xl border border-white/5 bg-[#111214] p-6 space-y-6">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Personal Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-gray-600">Email cannot be changed</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder="Company name"
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-2xl border border-white/5 bg-[#111214] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Account</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Member since</span>
              <span className="text-gray-200">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Credits remaining</span>
              <span className="text-gray-200">{profile?.credits ?? 0} / {profile?.total_credits ?? 0}</span>
            </div>
          </div>

          {/* Actions */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-lg bg-green-500/10 p-3 text-xs text-green-400 border border-green-500/20"
            >
              Profile updated successfully
            </motion.div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
