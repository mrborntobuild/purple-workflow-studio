import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe, supabaseAdmin, CREDIT_PACKS } from './_helpers';

// Disable body parsing — Stripe needs raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[Stripe Webhook] Missing signature or webhook secret');
    return res.status(400).json({ error: 'Missing signature' });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.supabase_user_id;

    if (!userId) {
      console.error('[Stripe Webhook] No user ID in session metadata');
      return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
      // Get line items to determine which pack was purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;

      if (!priceId || !CREDIT_PACKS[priceId]) {
        console.error('[Stripe Webhook] Unknown price ID:', priceId);
        return res.status(400).json({ error: 'Unknown price' });
      }

      const pack = CREDIT_PACKS[priceId];
      console.log(`[Stripe Webhook] Adding ${pack.credits} credits for user ${userId} (${pack.name})`);

      // Get current balance
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('credits, total_credits')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        console.error('[Stripe Webhook] User not found:', fetchError);
        return res.status(404).json({ error: 'User not found' });
      }

      const newBalance = (user.credits || 0) + pack.credits;
      const newTotal = (user.total_credits || 0) + pack.credits;

      // Update user credits
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ credits: newBalance, total_credits: newTotal })
        .eq('id', userId);

      if (updateError) {
        console.error('[Stripe Webhook] Failed to update credits:', updateError);
        return res.status(500).json({ error: 'Failed to update credits' });
      }

      // Insert transaction record
      const { error: txError } = await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: pack.credits,
          balance_after: newBalance,
          type: 'purchase',
          description: `Purchased ${pack.name} ($${pack.price})`,
          stripe_session_id: session.id,
        });

      if (txError) {
        console.error('[Stripe Webhook] Failed to insert transaction:', txError);
      }

      console.log(`[Stripe Webhook] Successfully added ${pack.credits} credits. New balance: ${newBalance}`);
    } catch (err) {
      console.error('[Stripe Webhook] Processing error:', err);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  return res.status(200).json({ received: true });
}
