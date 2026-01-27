import React, { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { supabase } from '../../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Password strength checks
  const passwordChecks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Calculate strength percentage
  const strengthPercentage = Object.values(passwordChecks).filter(Boolean).length * 25;

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return 'bg-red-500';
    if (strengthPercentage <= 50) return 'bg-orange-500';
    if (strengthPercentage <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password reset!"
        subtitle="Your password has been successfully changed"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>

          <p className="mb-6 text-sm text-gray-400">
            You can now sign in with your new password.
          </p>

          <p className="mb-8 text-xs text-gray-500">
            Redirecting to sign in...
          </p>

          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in now
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Your new password must be different from previous passwords"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">New password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0e0e11] pl-11 pr-12 py-3.5 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Bar */}
          {password.length > 0 && (
            <div className="mt-3">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strengthPercentage}%` }}
                  className={`h-full ${getStrengthColor()} transition-all duration-300`}
                />
              </div>

              {/* Password Requirements */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <RequirementCheck met={passwordChecks.minLength} text="8+ characters" />
                <RequirementCheck met={passwordChecks.hasUppercase} text="Uppercase" />
                <RequirementCheck met={passwordChecks.hasLowercase} text="Lowercase" />
                <RequirementCheck met={passwordChecks.hasNumber} text="Number" />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-xl border bg-[#0e0e11] pl-11 pr-12 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/50'
                    : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/50'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-xs text-red-400">Passwords do not match</p>
          )}
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
          disabled={loading || !isPasswordValid || !passwordsMatch}
          className="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Updating...' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  );
}

// Helper component for password requirements
function RequirementCheck({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-400' : 'text-gray-500'}`}>
      {met ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {text}
    </div>
  );
}
