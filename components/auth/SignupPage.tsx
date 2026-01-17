import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { supabase } from '../../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // You might want to show a success message telling them to check email
        // For now, we'll just redirect or login if auto-confirm is on
        navigate('/'); 
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Start building your AI workflows today"
    >
      <form onSubmit={handleSignup} className="space-y-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
          Continue with Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-white/10"></div>
          <span className="mx-4 shrink-0 text-xs text-gray-500 uppercase tracking-wider">or</span>
          <div className="grow border-t border-white/10"></div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
