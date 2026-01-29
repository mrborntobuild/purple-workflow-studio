import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// Model Mapping
// ============================================================================

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
  'minimax_image': 'fal-ai/minimax/image',
  'veo_2': 'fal-ai/veo2',
  'veo_2_i2v': 'fal-ai/veo2/image-to-video',
  'veo_3_1': 'fal-ai/veo3.1',
  'kling_2_6_pro': 'fal-ai/kling-video/v2.6/pro/text-to-video',
  'kling_2_1_pro': 'fal-ai/kling-video/v2.1/pro/text-to-video',
  'kling_2_0_master': 'fal-ai/kling-video/v2/master/text-to-video',
  'kling_1_6_pro': 'fal-ai/kling-video/v1.6/pro/text-to-video',
  'kling_1_6_standard': 'fal-ai/kling-video/v1.6/standard/text-to-video',
  'hunyuan_video_v1_5_i2v': 'fal-ai/hunyuan-video/image-to-video',
  'hunyuan_video_v1_5_t2v': 'fal-ai/hunyuan-video',
  'hunyuan_video_i2v': 'fal-ai/hunyuan-video/image-to-video',
  'luma_ray_2': 'fal-ai/luma-dream-machine/ray-2',
  'luma_ray_2_flash': 'fal-ai/luma-dream-machine/ray-2-flash',
  'minimax_hailuo': 'fal-ai/minimax-video/hailuo',
  'minimax_director': 'fal-ai/minimax-video/director',
  'pika_2_2': 'fal-ai/pika/v2.2',
  'ltx_video': 'fal-ai/ltx-video',
  'wan_i2v': 'fal-ai/wan/image-to-video',
  'sad_talker': 'fal-ai/sadtalker',
  'kling_lipsync_a2v': 'fal-ai/kling-video/lipsync/audio-to-video',
  'kling_lipsync_t2v': 'fal-ai/kling-video/lipsync/text-to-video',
  'sync_lipsync_v1': 'fal-ai/sync-lipsync',
  'sync_lipsync_v2': 'fal-ai/sync-lipsync/v2',
  'tavus_hummingbird': 'fal-ai/tavus/hummingbird',
  'latent_sync': 'fal-ai/latent-sync',
  'topaz_video': 'fal-ai/topaz/video',
  'creative_upscaler': 'fal-ai/creative-upscaler',
  'esrgan': 'fal-ai/esrgan',
  'thera': 'fal-ai/thera',
  'drct': 'fal-ai/drct',
  'trellis': 'fal-ai/trellis',
  'hunyuan_3d_v2': 'fal-ai/hunyuan3d/v2',
  'hunyuan_3d_mini': 'fal-ai/hunyuan3d/mini',
  'hunyuan_3d_turbo': 'fal-ai/hunyuan3d/turbo',
  'minimax_speech_hd': 'fal-ai/minimax-tts/hd',
  'minimax_speech_turbo': 'fal-ai/minimax-tts/turbo',
  'kokoro_tts': 'fal-ai/kokoro',
  'dia_tts': 'fal-ai/dia-tts',
  'elevenlabs_tts': 'fal-ai/elevenlabs/tts',
  'elevenlabs_turbo': 'fal-ai/elevenlabs/tts/turbo',
  'mmaudio_v2': 'fal-ai/mmaudio/v2',
  'background_remove': 'fal-ai/birefnet',
  'image_to_svg': 'fal-ai/image-to-svg',
  'speech_to_text': 'fal-ai/whisper',
  'whisper': 'fal-ai/whisper',
  'any_llm': 'fal-ai/any-llm',
  'basic_call': 'fal-ai/any-llm',
  'image_describer': 'fal-ai/any-llm',
  'video_describer': 'fal-ai/any-llm',
  'prompt_enhancer': 'fal-ai/any-llm',
};

// Node categories for execution handling
const INPUT_NODE_TYPES = new Set(['text', 'image', 'file', 'number', 'toggle', 'seed']);
const WORKFLOW_NODE_TYPES = new Set(['start_workflow', 'output']);
const ANNOTATION_NODE_TYPES = new Set(['sticky_note', 'group']);

// ============================================================================
// URL Detection Helpers
// ============================================================================

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];

function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  if (IMAGE_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  if (lower.includes('fal.media') && !lower.includes('.mp4') && !VIDEO_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  return false;
}

function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  if (VIDEO_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  return false;
}

function isAudioUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  if (AUDIO_EXTENSIONS.some(ext => lower.includes(ext))) return true;
  return false;
}

function detectOutputType(value: any): 'image' | 'video' | 'audio' | 'text' | 'trigger' | 'unknown' {
  if (value === 'trigger' || value === true) return 'trigger';
  if (typeof value !== 'string') return 'unknown';
  if (isVideoUrl(value)) return 'video';
  if (isImageUrl(value)) return 'image';
  if (isAudioUrl(value)) return 'audio';
  if (value.startsWith('http://') || value.startsWith('https://')) return 'unknown';
  return 'text';
}

// ============================================================================
// FAL.ai Helpers
// ============================================================================

// Get the model path for FAL.ai status API
// For most models, use the full path. Only strip for certain patterns.
function getStatusModel(fullModel: string): string {
  // FAL.ai status endpoint uses the full model path
  return fullModel;
}

async function checkFalJobStatus(jobId: string, model: string, apiKey: string): Promise<{
  status: string;
  output?: any;
  error?: string;
}> {
  const statusModel = getStatusModel(model);

  try {
    const response = await fetch(`https://queue.fal.run/${statusModel}/requests/${jobId}/status`, {
      headers: {
        'Authorization': `Key ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { status: 'failed', error: `Status check failed: ${response.status}` };
    }

    const data = await response.json();

    if (data.status === 'COMPLETED') {
      const resultResponse = await fetch(`https://queue.fal.run/${statusModel}/requests/${jobId}`, {
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
      });

      if (resultResponse.ok) {
        const result = await resultResponse.json();
        return { status: 'completed', output: result };
      }
    }

    return {
      status: data.status === 'IN_QUEUE' ? 'pending' :
             data.status === 'IN_PROGRESS' ? 'running' :
             data.status === 'FAILED' ? 'failed' : 'running'
    };

  } catch (err) {
    console.error(`[Run Status] Error checking job ${jobId}:`, err);
    return { status: 'failed', error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function extractOutputUrl(result: any): { type: string; url: string } | null {
  if (result.images?.[0]?.url) {
    return { type: 'image', url: result.images[0].url };
  }
  if (result.video?.url) {
    return { type: 'video', url: result.video.url };
  }
  if (result.audio?.url) {
    return { type: 'audio', url: result.audio.url };
  }
  if (result.mesh?.url) {
    return { type: '3d_model', url: result.mesh.url };
  }
  if (result.output) {
    return { type: 'text', url: result.output };
  }
  return null;
}

// ============================================================================
// Input Collection
// ============================================================================

interface CollectedInputs {
  prompt?: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  inputs: Record<string, any>;
  inputTypes: Record<string, string>;
}

function collectInputsForNode(
  nodeId: string,
  edges: any[],
  completedLogs: Map<string, any>
): CollectedInputs {
  const result: CollectedInputs = {
    inputs: {},
    inputTypes: {}
  };

  // Find all edges that target this node
  const incomingEdges = edges.filter(edge => {
    const targetId = edge.target || edge.target_node_id;
    return targetId === nodeId;
  });

  for (const edge of incomingEdges) {
    const sourceId = edge.source || edge.source_node_id;
    const sourceLog = completedLogs.get(sourceId);

    if (!sourceLog?.output_data) continue;

    // Get port indices from the edge
    const sourcePortIndex = edge.sourcePortIndex ?? parseInt(edge.source_output_id || '0', 10);
    const targetPortIndex = edge.targetPortIndex ?? parseInt(edge.target_input_id || '0', 10);

    // Get the output value using source port index
    const outputKey = `output_${sourcePortIndex}`;
    let value = sourceLog.output_data[outputKey];

    // Fallback to result if output_N not found
    if (value === undefined) {
      value = sourceLog.output_data.result;
    }
    // Last resort: use any available value
    if (value === undefined && Object.keys(sourceLog.output_data).length > 0) {
      const firstKey = Object.keys(sourceLog.output_data).find(k => k !== 'type' && k !== 'raw');
      if (firstKey) value = sourceLog.output_data[firstKey];
    }

    if (value === undefined) continue;

    // Store at target port index
    const inputKey = `input_${targetPortIndex}`;
    result.inputs[inputKey] = value;

    // Detect and classify the type
    const outputType = detectOutputType(value);
    result.inputTypes[inputKey] = outputType;

    // Classify into semantic inputs for generation nodes
    if (typeof value === 'string') {
      if (outputType === 'image' && !result.image_url) {
        result.image_url = value;
      } else if (outputType === 'video' && !result.video_url) {
        result.video_url = value;
      } else if (outputType === 'audio' && !result.audio_url) {
        result.audio_url = value;
      } else if (outputType === 'text' && !result.prompt) {
        result.prompt = value;
      }
    }
  }

  return result;
}

// ============================================================================
// Node Execution Handlers
// ============================================================================

async function executeInputNode(
  log: any,
  node: any,
  inputData: Record<string, any>,
  collectedInputs: CollectedInputs
): Promise<{ output_data: Record<string, any> }> {
  const nodeType = node.type || node.node_type;
  let outputValue: any;
  let outputType = 'text';

  // Priority: workflow input > upstream passthrough > node's own data
  const workflowInputKey = node.id;

  if (inputData[workflowInputKey] !== undefined) {
    // Use workflow-level input
    outputValue = inputData[workflowInputKey];
  } else if (Object.keys(collectedInputs.inputs).length > 0) {
    // Passthrough from upstream
    outputValue = collectedInputs.inputs.input_0 ?? Object.values(collectedInputs.inputs)[0];
  } else {
    // Use node's own data
    const data = node.data || {};
    switch (nodeType) {
      case 'text':
        outputValue = data.content || data.panelSettings?.prompt || '';
        break;
      case 'file':
      case 'image':
        outputValue = data.imageUrl || data.content || '';
        outputType = isImageUrl(outputValue) ? 'image' : (isVideoUrl(outputValue) ? 'video' : 'file');
        break;
      case 'number':
        outputValue = data.content ?? data.value ?? 0;
        outputType = 'number';
        break;
      case 'toggle':
        outputValue = data.content ?? data.value ?? false;
        outputType = 'boolean';
        break;
      case 'seed':
        outputValue = data.content ?? data.seed ?? Math.floor(Math.random() * 2147483647);
        outputType = 'number';
        break;
      default:
        outputValue = data.content || '';
    }
  }

  // Detect type if not already set
  if (outputType === 'text' && typeof outputValue === 'string') {
    outputType = detectOutputType(outputValue);
    if (outputType === 'unknown') outputType = 'text';
  }

  return {
    output_data: {
      output_0: outputValue,
      result: outputValue,
      type: outputType
    }
  };
}

async function executeWorkflowNode(
  log: any,
  node: any,
  collectedInputs: CollectedInputs
): Promise<{ output_data: Record<string, any> }> {
  const nodeType = node.type || node.node_type;

  if (nodeType === 'start_workflow') {
    return {
      output_data: {
        output_0: 'trigger',
        result: 'trigger',
        type: 'trigger'
      }
    };
  }

  if (nodeType === 'output') {
    // Pass through input_0 as final result
    const inputValue = collectedInputs.inputs.input_0 ?? Object.values(collectedInputs.inputs)[0];
    const inputType = collectedInputs.inputTypes.input_0 ?? 'unknown';

    return {
      output_data: {
        output_0: inputValue,
        result: inputValue,
        type: inputType
      }
    };
  }

  return {
    output_data: {
      output_0: null,
      result: null,
      type: 'unknown'
    }
  };
}

async function submitGenerationNode(
  log: any,
  node: any,
  collectedInputs: CollectedInputs,
  apiKey: string
): Promise<{ job_id?: string; job_model?: string; input_data?: any; error?: string }> {
  const nodeType = node.type || node.node_type;
  const model = MODEL_MAP[nodeType];

  if (!model) {
    return { error: `Unknown model for node type: ${nodeType}` };
  }

  // Build API input from collected inputs and node settings
  const nodeData = node.data || {};
  const panelSettings = nodeData.panelSettings || {};

  // Start with panel settings as base
  const apiInput: Record<string, any> = {
    ...panelSettings
  };

  // Override with collected inputs
  if (collectedInputs.prompt) {
    apiInput.prompt = collectedInputs.prompt;
  } else if (nodeData.content) {
    apiInput.prompt = nodeData.content;
  } else if (!apiInput.prompt) {
    apiInput.prompt = '';
  }

  if (collectedInputs.image_url) {
    apiInput.image_url = collectedInputs.image_url;
  } else if (nodeData.imageUrl) {
    apiInput.image_url = nodeData.imageUrl;
  }

  if (collectedInputs.video_url) {
    apiInput.video_url = collectedInputs.video_url;
  }

  if (collectedInputs.audio_url) {
    apiInput.audio_url = collectedInputs.audio_url;
  }

  // Set defaults for common parameters
  if (apiInput.num_images === undefined && nodeType.includes('flux') || nodeType.includes('nano') || nodeType.includes('ideogram') || nodeType.includes('imagen')) {
    apiInput.num_images = 1;
  }

  try {
    console.log(`[Run Status] Submitting ${nodeType} to FAL:`, { model, prompt: apiInput.prompt?.slice(0, 50), has_image: !!apiInput.image_url });

    const response = await fetch(`https://queue.fal.run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiInput),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Run Status] FAL submission failed: ${response.status}`, errorText);
      return { error: `FAL submission failed: ${response.status} - ${errorText}` };
    }

    const result = await response.json();
    console.log(`[Run Status] FAL job submitted: ${result.request_id}`);

    return {
      job_id: result.request_id,
      job_model: model,
      input_data: apiInput
    };
  } catch (err) {
    console.error(`[Run Status] Error submitting to FAL:`, err);
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ============================================================================
// Main Handler
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    console.log(`[Run Status] Checking status for run: ${runId}`);

    // ========================================================================
    // Step 1: Fetch current state
    // ========================================================================

    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (runError || !run) {
      return res.status(404).json({ error: 'Workflow run not found' });
    }

    // If already completed or failed, return immediately
    if (run.status === 'completed' || run.status === 'failed') {
      return res.status(200).json({
        runId: run.id,
        status: run.status,
        totalNodes: run.total_nodes,
        completedNodes: run.completed_nodes,
        output: run.output_data,
        error: run.error_message
      });
    }

    // Fetch execution logs
    const { data: logs, error: logsError } = await supabase
      .from('execution_logs')
      .select('*')
      .eq('run_id', runId)
      .order('execution_order', { ascending: true });

    if (logsError) {
      console.error('[Run Status] Error fetching logs:', logsError);
      return res.status(500).json({ error: 'Failed to fetch execution logs' });
    }

    // Fetch workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('nodes, edges')
      .eq('id', run.workflow_id)
      .single();

    if (workflowError || !workflow) {
      console.error('[Run Status] Error fetching workflow:', workflowError);
      return res.status(500).json({ error: 'Failed to fetch workflow' });
    }

    const FAL_API_KEY = process.env.FAL_API_KEY;
    if (!FAL_API_KEY) {
      console.warn('[Run Status] FAL_API_KEY not set!');
    }
    const nodes = workflow.nodes || [];
    const edges = workflow.edges || [];
    const inputData = run.input_data || {};

    console.log(`[Run Status] Fetched ${logs?.length || 0} logs, statuses:`, (logs || []).map(l => `${l.node_type}:${l.status}`).join(', '));

    // ========================================================================
    // Step 2: Build lookup maps
    // ========================================================================

    const nodeMap = new Map<string, any>();
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    const logsMap = new Map<string, any>();
    const completedLogsMap = new Map<string, any>();

    for (const log of logs || []) {
      logsMap.set(log.workflow_node_id, log);
      if (log.status === 'completed') {
        completedLogsMap.set(log.workflow_node_id, log);
      }
    }

    // Debug: log current state of running jobs
    const runningJobs = (logs || []).filter(l => l.status === 'running');
    if (runningJobs.length > 0) {
      console.log(`[Run Status] Found ${runningJobs.length} running jobs:`, runningJobs.map(l => ({ node: l.node_type, job_id: l.job_id, job_model: l.job_model })));
    }

    // ========================================================================
    // Step 3: Poll running FAL.ai jobs and update status
    // ========================================================================

    let hasUpdates = false;

    for (const log of logs || []) {
      if (log.status === 'running' && log.job_id && FAL_API_KEY) {
        const model = log.job_model || MODEL_MAP[log.node_type];
        const statusUrl = `https://queue.fal.run/${model}/requests/${log.job_id}/status`;
        console.log(`[Run Status] Polling FAL job: ${statusUrl}`);
        if (model) {
          const jobStatus = await checkFalJobStatus(log.job_id, model, FAL_API_KEY);
          console.log(`[Run Status] FAL job ${log.job_id} status: ${jobStatus.status}`);

          if (jobStatus.status === 'completed' && jobStatus.output) {
            const outputInfo = extractOutputUrl(jobStatus.output);
            const outputData: Record<string, any> = {
              raw: jobStatus.output
            };

            if (outputInfo) {
              outputData.output_0 = outputInfo.url;
              outputData.result = outputInfo.url;
              outputData.type = outputInfo.type;
            }

            await supabase
              .from('execution_logs')
              .update({
                status: 'completed',
                output_data: outputData,
                completed_at: new Date().toISOString()
              })
              .eq('id', log.id);

            log.status = 'completed';
            log.output_data = outputData;
            completedLogsMap.set(log.workflow_node_id, log);
            hasUpdates = true;

            console.log(`[Run Status] Node ${log.workflow_node_id} (${log.node_type}) completed`);

          } else if (jobStatus.status === 'failed') {
            await supabase
              .from('execution_logs')
              .update({
                status: 'failed',
                error_message: jobStatus.error || 'Job failed',
                completed_at: new Date().toISOString()
              })
              .eq('id', log.id);

            log.status = 'failed';
            hasUpdates = true;
            console.log(`[Run Status] Node ${log.workflow_node_id} (${log.node_type}) failed: ${jobStatus.error}`);
          }
        }
      }
    }

    // ========================================================================
    // Step 4: Find pending nodes where all dependencies are completed
    // ========================================================================

    const completedNodeIds = new Set(completedLogsMap.keys());
    const runningNodeIds = new Set(
      (logs || []).filter(l => l.status === 'running').map(l => l.workflow_node_id)
    );

    const readyNodes: any[] = [];

    for (const log of logs || []) {
      if (log.status !== 'pending') continue;

      // Check if all dependencies are completed
      const incomingEdges = edges.filter((e: any) => {
        const targetId = e.target || e.target_node_id;
        return targetId === log.workflow_node_id;
      });

      // Node with no incoming edges is ready if it hasn't been processed
      // Node with incoming edges is ready if all sources are completed
      const allDepsCompleted = incomingEdges.every((e: any) => {
        const sourceId = e.source || e.source_node_id;
        return completedNodeIds.has(sourceId);
      });

      if (allDepsCompleted) {
        readyNodes.push(log);
      }
    }

    // ========================================================================
    // Step 5: Execute ready nodes based on their category
    // ========================================================================

    for (const log of readyNodes) {
      const node = nodeMap.get(log.workflow_node_id);
      if (!node) {
        console.warn(`[Run Status] Node not found: ${log.workflow_node_id}`);
        continue;
      }

      const nodeType = node.type || node.node_type || log.node_type;

      // Skip annotation nodes
      if (ANNOTATION_NODE_TYPES.has(nodeType)) {
        await supabase
          .from('execution_logs')
          .update({
            status: 'skipped',
            completed_at: new Date().toISOString()
          })
          .eq('id', log.id);

        log.status = 'skipped';
        hasUpdates = true;
        continue;
      }

      // Collect inputs from upstream nodes
      const collectedInputs = collectInputsForNode(log.workflow_node_id, edges, completedLogsMap);

      // Handle based on node category
      if (INPUT_NODE_TYPES.has(nodeType)) {
        // Input nodes: execute immediately
        const result = await executeInputNode(log, node, inputData, collectedInputs);

        await supabase
          .from('execution_logs')
          .update({
            status: 'completed',
            output_data: result.output_data,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('id', log.id);

        log.status = 'completed';
        log.output_data = result.output_data;
        completedLogsMap.set(log.workflow_node_id, log);
        hasUpdates = true;

        console.log(`[Run Status] Input node ${log.workflow_node_id} (${nodeType}) completed: ${JSON.stringify(result.output_data).slice(0, 100)}`);

      } else if (WORKFLOW_NODE_TYPES.has(nodeType)) {
        // Workflow nodes: execute immediately
        const result = await executeWorkflowNode(log, node, collectedInputs);

        await supabase
          .from('execution_logs')
          .update({
            status: 'completed',
            output_data: result.output_data,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('id', log.id);

        log.status = 'completed';
        log.output_data = result.output_data;
        completedLogsMap.set(log.workflow_node_id, log);
        hasUpdates = true;

        console.log(`[Run Status] Workflow node ${log.workflow_node_id} (${nodeType}) completed`);

      } else if (FAL_API_KEY) {
        // Generation nodes: submit to FAL.ai
        const result = await submitGenerationNode(log, node, collectedInputs, FAL_API_KEY);

        if (result.error) {
          await supabase
            .from('execution_logs')
            .update({
              status: 'failed',
              error_message: result.error,
              started_at: new Date().toISOString(),
              completed_at: new Date().toISOString()
            })
            .eq('id', log.id);

          log.status = 'failed';
          hasUpdates = true;

          console.log(`[Run Status] Generation node ${log.workflow_node_id} (${nodeType}) failed: ${result.error}`);
        } else if (result.job_id) {
          const { error: updateError } = await supabase
            .from('execution_logs')
            .update({
              status: 'running',
              job_id: result.job_id,
              job_model: result.job_model,
              input_data: result.input_data,
              started_at: new Date().toISOString()
            })
            .eq('id', log.id);

          if (updateError) {
            console.error(`[Run Status] Failed to update execution log:`, updateError);
          } else {
            log.status = 'running';
            log.job_id = result.job_id;
            log.job_model = result.job_model;
            hasUpdates = true;

            console.log(`[Run Status] Generation node ${log.workflow_node_id} (${nodeType}) submitted: ${result.job_id}`);
          }
        }
      }
    }

    // ========================================================================
    // Step 6: Calculate overall status
    // ========================================================================

    // Re-count statuses after updates
    let completedCount = 0;
    let runningCount = 0;
    let failedCount = 0;
    let pendingCount = 0;

    for (const log of logs || []) {
      switch (log.status) {
        case 'completed':
        case 'skipped':
          completedCount++;
          break;
        case 'running':
          runningCount++;
          break;
        case 'failed':
          failedCount++;
          break;
        case 'pending':
          pendingCount++;
          break;
      }
    }

    const totalNodes = logs?.length || 0;
    const allCompleted = completedCount === totalNodes;
    const hasFailed = failedCount > 0;

    let runStatus = run.status;
    let outputData = run.output_data;

    if (allCompleted && !hasFailed) {
      runStatus = 'completed';

      // Collect final outputs from output nodes
      const outputLogs = (logs || []).filter(l => l.node_type === 'output' && l.output_data);
      if (outputLogs.length > 0) {
        outputData = {};
        for (const outLog of outputLogs) {
          outputData[outLog.workflow_node_id] = outLog.output_data;
        }
      } else {
        // Use last completed node's output
        const lastLog = (logs || []).filter(l => l.status === 'completed').pop();
        if (lastLog?.output_data) {
          outputData = lastLog.output_data;
        }
      }

      console.log(`[Run Status] Workflow completed with output:`, JSON.stringify(outputData).slice(0, 200));

    } else if (hasFailed) {
      // Check if failure blocks the output
      // For now, mark as failed if any node failed
      runStatus = 'failed';
    }

    // ========================================================================
    // Step 7: Update run and return progress
    // ========================================================================

    if (runStatus !== run.status || completedCount !== run.completed_nodes) {
      await supabase
        .from('workflow_runs')
        .update({
          status: runStatus,
          completed_nodes: completedCount,
          output_data: outputData,
          completed_at: runStatus === 'completed' || runStatus === 'failed' ? new Date().toISOString() : null
        })
        .eq('id', runId);
    }

    return res.status(200).json({
      runId: run.id,
      status: runStatus,
      totalNodes: totalNodes,
      completedNodes: completedCount,
      output: outputData,
      logs: (logs || []).map(l => ({
        nodeId: l.workflow_node_id,
        nodeType: l.node_type,
        status: l.status,
        output: l.output_data,
        error: l.error_message,
        order: l.execution_order
      }))
    });

  } catch (error) {
    console.error('[Run Status] Error:', error);
    return res.status(500).json({
      error: 'Failed to get workflow run status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
