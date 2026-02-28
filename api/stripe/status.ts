import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin, getUserIdFromRequest } from './_helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const userId = await getUserIdFromRequest(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get credit balance
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('credits, total_credits')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent transactions
    const { data: transactions, error: txError } = await supabaseAdmin
      .from('credit_transactions')
      .select('id, amount, balance_after, type, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return res.status(200).json({
      credits: user.credits || 0,
      totalCredits: user.total_credits || 0,
      recentTransactions: transactions || [],
    });
  } catch (error) {
    console.error('[Stripe Status] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch credit status' });
  }
}
