import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Model mapping (same as fal/generate.ts)
const MODEL_MAP: Record<string, string> = {
  'nano_banana_pro': 'fal-ai/nano-banana-pro',
  'nano_banana_pro_edit': 'fal-ai/nano-banana-pro/edit',
  'flux_pro_1_1_ultra': 'fal-ai/flux-pro/v1.1-ultra',
  'flux_pro_1_1': 'fal-ai/flux-pro/v1.1',
  'flux_dev': 'fal-ai/flux/dev',
  'flux_lora': 'fal-ai/flux-lora',
  'ideogram_v3': 'fal-ai/ideogram/v3',
  'ideogram_v3_edit': 'fal-ai/ideogram/v3/edit',
  'imagen_3': 'fal-ai/imagen3',
  'imagen_3_fast': 'fal-ai/imagen3/fast',
  'minimax_image': 'fal-ai/minimax/image-01',
  'veo_2': 'fal-ai/veo2',
  'veo_2_i2v': 'fal-ai/veo2/image-to-video',
  'veo_3_1': 'fal-ai/veo3.1',
  'kling_2_6_pro': 'fal-ai/kling-video/v2.6/pro/text-to-video',
  'kling_2_1_pro': 'fal-ai/kling-video/v2.1/pro/image-to-video',
  'kling_2_0_master': 'fal-ai/kling-video/v2/master/text-to-video',
  'kling_1_6_pro': 'fal-ai/kling-video/v1.6/pro/image-to-video',
  'kling_1_6_standard': 'fal-ai/kling-video/v1.6/standard/text-to-video',
  'hunyuan_video_v1_5_i2v': 'fal-ai/hunyuan-video-v1.5/image-to-video',
  'hunyuan_video_v1_5_t2v': 'fal-ai/hunyuan-video',
  'hunyuan_video_i2v': 'fal-ai/hunyuan-video/image-to-video',
  'luma_ray_2': 'fal-ai/luma-dream-machine/ray-2',
  'luma_ray_2_flash': 'fal-ai/luma-dream-machine/ray-2-flash',
  'minimax_hailuo': 'fal-ai/minimax/video-01-live',
  'minimax_director': 'fal-ai/minimax/video-01-director',
  'any_llm': 'fal-ai/any-llm',
  'basic_call': 'fal-ai/any-llm',
};

// Node categories for execution handling
type NodeCategory = 'input' | 'generation' | 'utility' | 'workflow' | 'annotation';

function getNodeCategory(nodeType: string): NodeCategory {
  const categories: Record<string, NodeCategory> = {
    'text': 'input',
    'image': 'input',
    'file': 'input',
    'number': 'input',
    'toggle': 'input',
    'seed': 'input',
    'start_workflow': 'workflow',
    'output': 'workflow',
    'sticky_note': 'annotation',
    'group': 'annotation',
  };

  if (categories[nodeType]) return categories[nodeType];
  if (MODEL_MAP[nodeType]) return 'generation';
  return 'utility';
}

// Build dependency graph and get execution order
function getExecutionOrder(nodes: any[], edges: any[]): string[] {
  const graph = new Map<string, { deps: Set<string>; dependents: Set<string> }>();

  for (const node of nodes) {
    graph.set(node.id, { deps: new Set(), dependents: new Set() });
  }

  for (const edge of edges) {
    const sourceId = edge.source || edge.source_node_id;
    const targetId = edge.target || edge.target_node_id;

    const source = graph.get(sourceId);
    const target = graph.get(targetId);

    if (source && target) {
      target.deps.add(sourceId);
      source.dependents.add(targetId);
    }
  }

  const order: string[] = [];
  const inDegree = new Map<string, number>();
  const remaining = new Set<string>();

  for (const [nodeId, data] of graph) {
    inDegree.set(nodeId, data.deps.size);
    remaining.add(nodeId);
  }

  while (remaining.size > 0) {
    const ready: string[] = [];
    for (const nodeId of remaining) {
      if ((inDegree.get(nodeId) || 0) === 0) {
        ready.push(nodeId);
      }
    }

    if (ready.length === 0 && remaining.size > 0) {
      throw new Error('Workflow contains a cycle');
    }

    for (const nodeId of ready) {
      order.push(nodeId);
      remaining.delete(nodeId);

      const nodeData = graph.get(nodeId);
      if (nodeData) {
        for (const depId of nodeData.dependents) {
          const current = inDegree.get(depId) || 0;
          inDegree.set(depId, current - 1);
        }
      }
    }
  }

  return order;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowId, inputData, userId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`[Workflow Run] Starting execution for workflow: ${workflowId}`);

    // Fetch workflow data
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      console.error('[Workflow Run] Workflow not found:', workflowError);
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Verify ownership
    if (workflow.created_by && workflow.created_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];

    if (nodes.length === 0) {
      return res.status(400).json({ error: 'Workflow has no nodes' });
    }

    // Get execution order
    let executionOrder: string[];
    try {
      executionOrder = getExecutionOrder(nodes, edges);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid workflow: contains cycle' });
    }

    // Filter out annotation nodes
    const executableNodes = nodes.filter((n: any) => {
      const category = getNodeCategory(n.type);
      return category !== 'annotation';
    });

    // Create workflow run record
    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .insert({
        workflow_id: workflowId,
        user_id: userId,
        status: 'running',
        input_data: inputData || {},
        started_at: new Date().toISOString(),
        total_nodes: executableNodes.length,
        completed_nodes: 0
      })
      .select()
      .single();

    if (runError || !run) {
      console.error('[Workflow Run] Failed to create run:', runError);
      return res.status(500).json({ error: 'Failed to create workflow run' });
    }

    console.log(`[Workflow Run] Created run: ${run.id}`);

    // Create execution logs for each node
    const executionLogs = [];
    let orderIndex = 0;

    for (const nodeId of executionOrder) {
      const node = nodes.find((n: any) => n.id === nodeId);
      if (!node) continue;

      const category = getNodeCategory(node.type);
      if (category === 'annotation') continue;

      executionLogs.push({
        run_id: run.id,
        workflow_node_id: nodeId,
        node_type: node.type,
        status: 'pending',
        execution_order: orderIndex++,
        input_data: null,
        output_data: null
      });
    }

    if (executionLogs.length > 0) {
      const { error: logsError } = await supabase
        .from('execution_logs')
        .insert(executionLogs);

      if (logsError) {
        console.error('[Workflow Run] Failed to create logs:', logsError);
        // Continue anyway - logs are for tracking, not blocking
      }
    }

    // Start executing first-level nodes (those with no dependencies)
    const FAL_API_KEY = process.env.FAL_API_KEY;
    const firstLevelNodes = executionOrder.filter(nodeId => {
      const node = nodes.find((n: any) => n.id === nodeId);
      if (!node) return false;

      // Check if this node has any incoming edges
      const hasIncoming = edges.some((e: any) =>
        (e.target === nodeId || e.target_node_id === nodeId)
      );
      return !hasIncoming;
    });

    console.log(`[Workflow Run] First level nodes: ${firstLevelNodes.join(', ')}`);

    // Process first-level nodes
    for (const nodeId of firstLevelNodes) {
      const node = nodes.find((n: any) => n.id === nodeId);
      if (!node) continue;

      const category = getNodeCategory(node.type);

      if (category === 'input' || category === 'workflow') {
        // Input nodes complete immediately with their data
        const outputData: Record<string, any> = {};

        if (node.data?.content) {
          outputData.output_0 = node.data.content;
          outputData.result = node.data.content;
        }
        if (node.data?.imageUrl) {
          outputData.output_0 = node.data.imageUrl;
          outputData.result = node.data.imageUrl;
        }
        // Check input_data for trigger inputs
        if (inputData && inputData[nodeId]) {
          outputData.output_0 = inputData[nodeId];
          outputData.result = inputData[nodeId];
        }

        await supabase
          .from('execution_logs')
          .update({
            status: 'completed',
            output_data: outputData,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('run_id', run.id)
          .eq('workflow_node_id', nodeId);

      } else if (category === 'generation' && FAL_API_KEY) {
        // Submit to FAL.ai
        const model = MODEL_MAP[node.type];
        if (model) {
          try {
            const prompt = node.data?.content || node.data?.panelSettings?.prompt || '';
            const apiInput: Record<string, any> = {
              prompt,
              num_images: 1,
              ...node.data?.panelSettings
            };

            // Submit to FAL queue
            const response = await fetch(`https://queue.fal.run/${model}`, {
              method: 'POST',
              headers: {
                'Authorization': `Key ${FAL_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(apiInput),
            });

            if (response.ok) {
              const result = await response.json();

              await supabase
                .from('execution_logs')
                .update({
                  status: 'running',
                  job_id: result.request_id,
                  job_model: model,
                  started_at: new Date().toISOString()
                })
                .eq('run_id', run.id)
                .eq('workflow_node_id', nodeId);

              console.log(`[Workflow Run] Submitted job for node ${nodeId}: ${result.request_id}`);
            } else {
              const errorText = await response.text();
              await supabase
                .from('execution_logs')
                .update({
                  status: 'failed',
                  error_message: `FAL API error: ${response.status} ${errorText}`,
                  completed_at: new Date().toISOString()
                })
                .eq('run_id', run.id)
                .eq('workflow_node_id', nodeId);
            }
          } catch (err) {
            console.error(`[Workflow Run] Error submitting node ${nodeId}:`, err);
            await supabase
              .from('execution_logs')
              .update({
                status: 'failed',
                error_message: err instanceof Error ? err.message : 'Unknown error',
                completed_at: new Date().toISOString()
              })
              .eq('run_id', run.id)
              .eq('workflow_node_id', nodeId);
          }
        }
      }
    }

    // Update run with initial completed count
    const { data: completedLogs } = await supabase
      .from('execution_logs')
      .select('id')
      .eq('run_id', run.id)
      .eq('status', 'completed');

    await supabase
      .from('workflow_runs')
      .update({ completed_nodes: completedLogs?.length || 0 })
      .eq('id', run.id);

    return res.status(200).json({
      runId: run.id,
      status: 'running',
      totalNodes: executableNodes.length,
      message: 'Workflow execution started'
    });

  } catch (error) {
    console.error('[Workflow Run] Error:', error);
    return res.status(500).json({
      error: 'Failed to start workflow execution',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
