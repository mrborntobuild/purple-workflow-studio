import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2, Zap, Star, Crown, Clock, Image, Video, Music, Box } from 'lucide-react';
import { useCredits } from '../../contexts/CreditContext';
import { useAuth } from '../AuthProvider';
import { supabase } from '../../services/supabaseClient';

const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 1000,
    price: 10,
    icon: Zap,
    color: 'blue',
    envKey: 'VITE_STRIPE_PRICE_STARTER',
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 5500,
    price: 50,
    bonus: '10% bonus',
    icon: Star,
    color: 'purple',
    popular: true,
    envKey: 'VITE_STRIPE_PRICE_PRO',
  },
  {
    id: 'studio',
    name: 'Studio Pack',
    credits: 12000,
    price: 100,
    bonus: '20% bonus',
    icon: Crown,
    color: 'amber',
    envKey: 'VITE_STRIPE_PRICE_STUDIO',
  },
];

const MODEL_EXAMPLES = [
  { name: 'Flux Dev (image)', credits: 4, icon: Image },
  { name: 'Flux Pro Ultra (image)', credits: 9, icon: Image },
  { name: 'Imagen 3 (image)', credits: 8, icon: Image },
  { name: 'LTX Video', credits: 3, icon: Video },
  { name: 'Kling v2.6 Pro (5s)', credits: 53, icon: Video },
  { name: 'Luma Ray 2 (5s)', credits: 75, icon: Video },
  { name: 'Veo 2 (5s)', credits: 375, icon: Video },
  { name: 'Kokoro TTS', credits: 3, icon: Music },
  { name: 'Trellis 3D', credits: 3, icon: Box },
  { name: 'Background Remove', credits: 0, icon: Image },
];

export default function BuyCreditsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { credits, loading: creditsLoading, recentTransactions } = useCredits();
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  const handlePurchase = async (pack: typeof CREDIT_PACKS[0]) => {
    if (!session?.access_token) {
      navigate('/login');
      return;
    }

    setPurchaseLoading(pack.id);
    try {
      const priceId = import.meta.env[pack.envKey];
      if (!priceId) {
        alert('Stripe price not configured. Please set up environment variables.');
        setPurchaseLoading(null);
        return;
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 border border-purple-500/20 px-4 py-2 text-sm text-purple-400 mb-4">
              <Sparkles size={14} />
              Credits
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Buy Credits</h1>
            <p className="mt-3 text-gray-400">Power your AI workflows with credits. Each model run costs a set number of credits.</p>
            {!creditsLoading && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1a1b1e] px-5 py-2.5 text-sm">
                <Sparkles size={14} className="text-yellow-500" />
                <span className="text-gray-300">Current balance:</span>
                <span className="font-bold text-white">{credits.toLocaleString()} credits</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Credit Packs */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {CREDIT_PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${
                pack.popular
                  ? 'border-purple-500/30 bg-purple-600/5 shadow-[0_0_30px_rgba(147,51,234,0.15)]'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold">
                  Most Popular
                </div>
              )}
              {pack.bonus && (
                <div className="absolute top-4 right-4 rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                  {pack.bonus}
                </div>
              )}

              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                pack.popular ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-gray-400'
              }`}>
                <pack.icon size={24} />
              </div>

              <h3 className="text-lg font-bold mb-1">{pack.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold">${pack.price}</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{pack.credits.toLocaleString()} credits</p>

              <button
                onClick={() => handlePurchase(pack)}
                disabled={purchaseLoading === pack.id}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  pack.popular
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {purchaseLoading === pack.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Buy Now'
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* What Credits Buy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-xl font-bold mb-6 text-center">What Can You Do With Credits?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {MODEL_EXAMPLES.map((model) => (
              <div
                key={model.name}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <model.icon size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-300">{model.name}</span>
                </div>
                <span className={`text-sm font-bold ${model.credits === 0 ? 'text-green-400' : 'text-gray-200'}`}>
                  {model.credits === 0 ? 'FREE' : `${model.credits} credits`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
            <div className="rounded-2xl border border-white/5 bg-[#111214] overflow-hidden">
              {recentTransactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm text-gray-200">{tx.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-gray-500">{tx.balance_after} remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
