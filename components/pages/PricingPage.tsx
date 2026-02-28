import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, Shield, ArrowRight, HelpCircle,
  Users, CreditCard, Lock, Zap, Star, Crown, Sparkles,
  Image, Video, Music, Box
} from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const STEPS = [
  {
    step: '01',
    title: 'Post Your Brief',
    description: 'Describe what you need — content type, style references, timeline, and budget. Our system matches you with creators who specialize in your area.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Fund with Escrow',
    description: 'Your payment is securely held in escrow. Creators only get paid when you approve milestones. Full protection for both sides.',
    icon: Lock,
  },
  {
    step: '03',
    title: 'Collaborate & Review',
    description: 'Track progress via the project workspace. See the AI workflow running in real-time, exchange files, and request revisions on each milestone.',
    icon: Zap,
  },
  {
    step: '04',
    title: 'Approve & Release',
    description: 'Once you\'re happy with the deliverables, approve the milestone to release payment. Leave a review to help other clients.',
    icon: CheckCircle,
  },
];

const FAQS = [
  {
    q: 'How does escrow work?',
    a: 'When you hire a creator, your payment is held securely in escrow. Funds are released to the creator only after you approve the delivered work for each milestone.',
  },
  {
    q: 'What is the platform fee?',
    a: 'Purple Studios charges a 10% service fee on top of the project cost for clients, and a 15% commission on creator earnings. No hidden fees.',
  },
  {
    q: 'Can I get a refund?',
    a: 'If a creator fails to deliver or the work doesn\'t match the brief, you can open a dispute. Our team reviews within 48 hours and can issue full or partial refunds.',
  },
  {
    q: 'How are creators vetted?',
    a: 'All creators go through a portfolio review, skill verification, and test project before being listed on the marketplace. We maintain high quality standards.',
  },
  {
    q: 'Can I buy workflows without hiring a creator?',
    a: 'Yes! The Workflow Template Store lets you purchase pre-built AI workflows as digital products that you can run yourself. No hiring required.',
  },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold sm:text-5xl">Pricing & How It Works</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Transparent pricing with secure escrow payments. Only pay for results you love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold mb-4">Credit Packs</h2>
          <p className="text-center text-gray-400 mb-12">Buy credits to power AI model runs. 1 credit = $0.01</p>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-16">
            {[
              { name: 'Starter Pack', price: 10, credits: 1000, icon: Zap, color: 'blue' },
              { name: 'Pro Pack', price: 50, credits: 5500, icon: Star, color: 'purple', popular: true, bonus: '10% bonus' },
              { name: 'Studio Pack', price: 100, credits: 12000, icon: Crown, color: 'amber', bonus: '20% bonus' },
            ].map((pack, i) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
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
                <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
                <div className="text-4xl font-bold text-purple-400 mb-1">${pack.price}</div>
                <p className="text-sm text-gray-400 mb-6">{pack.credits.toLocaleString()} credits</p>
                <Link
                  to="/buy-credits"
                  className={`block text-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    pack.popular
                      ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-500'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Buy Credits
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Model Cost Reference */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-center text-xl font-bold mb-6">Model Credit Costs</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
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
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <m.icon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-300">{m.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${m.credits === 0 ? 'text-green-400' : 'text-gray-200'}`}>
                    {m.credits === 0 ? 'FREE' : `${m.credits} cr`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-center text-gray-400 mb-16">From brief to delivery, here's the full process</p>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent hidden md:block" />

            <div className="space-y-12">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="relative z-10 hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/20 shrink-0">
                    <step.icon size={24} className="text-purple-400" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Step {step.step}</span>
                    <h3 className="text-lg font-semibold mt-1 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Escrow */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 mx-auto">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Trust & Escrow Protection</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Every transaction on Purple Studios is protected by our escrow system. Your money is held
              securely until you approve the work. If something goes wrong, our dispute resolution team
              steps in within 48 hours.
            </p>
            <div className="grid gap-6 sm:grid-cols-3 text-left">
              {[
                { title: 'Secure Payments', desc: 'Funds held in escrow until you approve milestones' },
                { title: 'Dispute Resolution', desc: 'Dedicated team reviews disputes within 48 hours' },
                { title: 'Money-Back Guarantee', desc: 'Full refund if work doesn\'t match the agreed brief' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="border-t border-white/5 bg-[#0a0a0c]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <HelpCircle size={16} className="text-purple-400" />
                  {faq.q}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">Join Purple Studios today and start creating.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all hover:bg-purple-500"
            >
              Create Account
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium text-white hover:bg-white/10 transition-all"
            >
              Browse Creators
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
