import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { runId } = req.query;

  if (!runId || typeof runId !== 'string') {
    return res.status(400).json({ error: 'runId is required' });
  }

  try {
    console.log(`[Execution Logs] Fetching logs for run: ${runId}`);

    // Fetch workflow run to verify it exists
    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .select('id, workflow_id, status, total_nodes, completed_nodes')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      return res.status(404).json({ error: 'Workflow run not found' });
    }

    // Fetch execution logs
    const { data: logs, error: logsError } = await supabase
      .from('execution_logs')
      .select('*')
      .eq('run_id', runId)
      .order('execution_order', { ascending: true });

    if (logsError) {
      console.error('[Execution Logs] Error fetching logs:', logsError);
      return res.status(500).json({ error: 'Failed to fetch execution logs' });
    }

    // Fetch workflow to get node labels
    const { data: workflow } = await supabase
      .from('workflows')
      .select('nodes')
      .eq('id', run.workflow_id)
      .single();

    const nodes = workflow?.nodes || [];
    const nodeLabels: Record<string, string> = {};
    for (const node of nodes) {
      nodeLabels[node.id] = node.data?.label || node.type;
    }

    // Format logs with node labels
    const formattedLogs = (logs || []).map(log => ({
      id: log.id,
      nodeId: log.workflow_node_id,
      nodeType: log.node_type,
      nodeLabel: nodeLabels[log.workflow_node_id] || log.node_type,
      status: log.status,
      input: log.input_data,
      output: log.output_data,
      jobId: log.job_id,
      error: log.error_message,
      executionOrder: log.execution_order,
      startedAt: log.started_at,
      completedAt: log.completed_at,
      duration: log.started_at && log.completed_at
        ? new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()
        : null
    }));

    return res.status(200).json({
      runId: run.id,
      workflowId: run.workflow_id,
      runStatus: run.status,
      totalNodes: run.total_nodes,
      completedNodes: run.completed_nodes,
      logs: formattedLogs
    });

  } catch (error) {
    console.error('[Execution Logs] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch execution logs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
