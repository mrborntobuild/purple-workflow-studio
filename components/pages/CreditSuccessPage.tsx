import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useCredits } from '../../contexts/CreditContext';

export default function CreditSuccessPage() {
  const navigate = useNavigate();
  const { credits, refreshCredits } = useCredits();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    // Refresh credits after purchase
    const doRefresh = async () => {
      await refreshCredits();
      setRefreshed(true);
    };
    doRefresh();
  }, [refreshCredits]);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (!refreshed) return;
    const timer = setTimeout(() => navigate('/'), 5000);
    return () => clearTimeout(timer);
  }, [refreshed, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050506] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-md px-6 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20"
        >
          <CheckCircle size={40} className="text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          Credits Added!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-6"
        >
          Your purchase was successful. Credits have been added to your account.
        </motion.p>

        {refreshed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-xl bg-[#1a1b1e] px-5 py-3 text-sm"
          >
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-gray-300">Balance:</span>
            <span className="font-bold text-white text-lg">{credits.toLocaleString()} credits</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-500 transition-all"
          >
            Start Creating
            <ArrowRight size={16} />
          </button>
          <p className="text-xs text-gray-600">Redirecting in 5 seconds...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
