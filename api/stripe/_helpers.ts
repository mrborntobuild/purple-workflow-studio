import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Admin client with service role key — bypasses RLS
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vxsjiwlvradiyluppage.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Credit pack definitions
export const CREDIT_PACKS: Record<string, { name: string; credits: number; price: number }> = {
  [process.env.STRIPE_PRICE_STARTER!]: { name: 'Starter Pack', credits: 1000, price: 10 },
  [process.env.STRIPE_PRICE_PRO!]:     { name: 'Pro Pack',     credits: 5500, price: 50 },
  [process.env.STRIPE_PRICE_STUDIO!]:  { name: 'Studio Pack',  credits: 12000, price: 100 },
};

// Verify JWT and return user ID
export async function getUserIdFromRequest(authHeader: string | undefined): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);

  const { createClient: createAuthClient } = await import('@supabase/supabase-js');
  const supabase = createAuthClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://vxsjiwlvradiyluppage.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}
