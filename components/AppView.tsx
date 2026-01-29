import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Play, AlertCircle, Upload, X, Loader2, Image as ImageIcon, Video, Music, Type, FileImage, CheckCircle2, XCircle } from 'lucide-react';
import { CanvasNode, Edge, NodeType } from '../types';
import { apiService } from '../services/apiService';

interface AppViewProps {
  nodes: CanvasNode[];
  edges: Edge[];
  workflowTitle: string;
  workflowId?: string;
  onUpdateNode: (id: string, data: any) => void;
}

interface TriggerInput {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  value: string;
  fileUrl?: string;
}

interface WorkflowResult {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  content?: string;
}

interface RunProgress {
  runId: string;
  status: string;
  totalNodes: number;
  completedNodes: number;
  logs?: Array<{
    nodeId: string;
    nodeType: string;
    status: string;
    output?: any;
    error?: string;
  }>;
}

export const AppView: React.FC<AppViewProps> = ({ nodes, edges, workflowTitle, workflowId, onUpdateNode }) => {
  const [triggerInputs, setTriggerInputs] = useState<Record<string, TriggerInput>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<WorkflowResult[]>([]);
  const [runProgress, setRunProgress] = useState<RunProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Find the start_workflow node
  const startNode = useMemo(() => {
    return nodes.find(n => n.type === 'start_workflow');
  }, [nodes]);

  // Find the output node
  const outputNode = useMemo(() => {
    return nodes.find(n => n.type === 'output');
  }, [nodes]);

  // Find triggers connected to the start node
  const triggers = useMemo(() => {
    if (!startNode) return [];

    const startEdges = edges.filter(e => e.source === startNode.id);

    const triggerNodes = startEdges
      .map(edge => {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode && (targetNode.type === 'text' || targetNode.type === 'basic_call' || targetNode.type === 'file')) {
          return targetNode;
        }
        return null;
      })
      .filter((n): n is CanvasNode => n !== null);

    return triggerNodes;
  }, [startNode, edges, nodes]);

  // Find nodes connected to the output node (results)
  const resultNodes = useMemo(() => {
    if (!outputNode) return [];

    const outputEdges = edges.filter(e => e.target === outputNode.id);

    const sourceNodes = outputEdges
      .map(edge => nodes.find(n => n.id === edge.source))
      .filter((n): n is CanvasNode => n !== null);

    return sourceNodes;
  }, [outputNode, edges, nodes]);

  // Initialize trigger inputs when triggers change
  useMemo(() => {
    const initialInputs: Record<string, TriggerInput> = {};
    triggers.forEach(trigger => {
      if (!triggerInputs[trigger.id]) {
        initialInputs[trigger.id] = {
          nodeId: trigger.id,
          nodeType: trigger.type,
          label: trigger.data.label || (trigger.type === 'text' || trigger.type === 'basic_call' ? 'Prompt' : 'Image'),
          value: trigger.data.content || '',
          fileUrl: trigger.data.imageUrl,
        };
      } else {
        initialInputs[trigger.id] = triggerInputs[trigger.id];
      }
    });
    if (Object.keys(initialInputs).length > 0 && JSON.stringify(initialInputs) !== JSON.stringify(triggerInputs)) {
      setTriggerInputs(initialInputs);
    }
  }, [triggers]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleTextChange = (nodeId: string, value: string) => {
    setTriggerInputs(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], value }
    }));
  };

  const handleFileUpload = async (nodeId: string, file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setTriggerInputs(prev => ({
        ...prev,
        [nodeId]: { ...prev[nodeId], value: base64, fileUrl: base64 }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (nodeId: string) => {
    setTriggerInputs(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], value: '', fileUrl: undefined }
    }));
    if (fileInputRefs.current[nodeId]) {
      fileInputRefs.current[nodeId]!.value = '';
    }
  };

  const pollRunStatus = useCallback(async (runId: string) => {
    try {
      const status = await apiService.getWorkflowRunStatus(runId);

      setRunProgress({
        runId: status.runId,
        status: status.status,
        totalNodes: status.totalNodes,
        completedNodes: status.completedNodes,
        logs: status.logs
      });

      // Update results from completed logs
      if (status.logs) {
        const completedResults: WorkflowResult[] = [];

        for (const log of status.logs) {
          if (log.status === 'completed' && log.output) {
            const output = log.output;
            const result: WorkflowResult = {
              nodeId: log.nodeId,
              nodeType: log.nodeType as NodeType,
              label: log.nodeType,
            };

            // Extract URL based on type
            if (output.type === 'video' || output.result?.includes?.('.mp4')) {
              result.videoUrl = output.result || output.output_0;
            } else if (output.type === 'audio' || output.result?.includes?.('.mp3')) {
              result.audioUrl = output.result || output.output_0;
            } else if (output.type === 'image' || typeof output.result === 'string' && output.result.startsWith('http')) {
              result.imageUrl = output.result || output.output_0;
            } else if (typeof output.result === 'string') {
              result.content = output.result;
            }

            if (result.imageUrl || result.videoUrl || result.audioUrl || result.content) {
              completedResults.push(result);
            }
          }
        }

        if (completedResults.length > 0) {
          setResults(completedResults);
        }
      }

      // Check if run is complete
      if (status.status === 'completed' || status.status === 'failed') {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setIsRunning(false);

        if (status.status === 'failed') {
          setError(status.error || 'Workflow execution failed');
        }
      }

    } catch (err) {
      console.error('Error polling run status:', err);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setIsRunning(false);
      setError(err instanceof Error ? err.message : 'Failed to get run status');
    }
  }, []);

  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setResults([]);
    setError(null);
    setRunProgress(null);

    // Update nodes with input values
    const inputValues = Object.values(triggerInputs) as TriggerInput[];
    const inputData: Record<string, string> = {};

    inputValues.forEach((input: TriggerInput) => {
      if (input.nodeType === 'text' || input.nodeType === 'basic_call') {
        onUpdateNode(input.nodeId, { content: input.value });
        inputData[input.nodeId] = input.value;
      } else if (input.nodeType === 'file') {
        onUpdateNode(input.nodeId, {
          content: input.value,
          imageUrl: input.fileUrl
        });
        inputData[input.nodeId] = input.fileUrl || input.value;
      }
    });

    // If we have a workflow ID, use the real execution API
    if (workflowId) {
      try {
        const runResult = await apiService.startWorkflowRun(workflowId, inputData);

        setRunProgress({
          runId: runResult.runId,
          status: runResult.status,
          totalNodes: runResult.totalNodes,
          completedNodes: 0
        });

        // Start polling for status updates
        pollingRef.current = setInterval(() => {
          pollRunStatus(runResult.runId);
        }, 3000);

        // Do initial poll immediately
        await pollRunStatus(runResult.runId);

      } catch (err) {
        console.error('Error starting workflow:', err);
        setError(err instanceof Error ? err.message : 'Failed to start workflow');
        setIsRunning(false);
      }
    } else {
      // Fallback to simulated execution for unsaved workflows
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newResults: WorkflowResult[] = resultNodes.map(node => ({
        nodeId: node.id,
        nodeType: node.type,
        label: node.data.label || 'Result',
        imageUrl: node.data.imageUrl,
        videoUrl: (node.data as any).videoUrl,
        audioUrl: (node.data as any).audioUrl,
        content: node.data.content,
      }));

      setResults(newResults);
      setIsRunning(false);
    }
  };

  // Get the primary result (first one with media)
  const primaryResult = useMemo(() => {
    return results.find(r => r.imageUrl || r.videoUrl || r.audioUrl) || results[0];
  }, [results]);

  // Error states
  if (!startNode) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-white">No Start Workflow Node</h2>
          <p className="text-gray-400">
            Add a Start Workflow node to your canvas and connect it to text or file nodes to define your app inputs.
          </p>
        </div>
      </div>
    );
  }

  if (!outputNode) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-white">No Output Node</h2>
          <p className="text-gray-400">
            Add an Output node to your canvas and connect it to nodes that produce results (images, videos, etc.).
          </p>
        </div>
      </div>
    );
  }

  if (triggers.length === 0) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-white">No Triggers Connected</h2>
          <p className="text-gray-400">
            Connect the Start Workflow node to text or file nodes. These will become input fields in your app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 top-14 flex bg-[#050506]">
      {/* LEFT PANEL - Inputs */}
      <div className="w-[420px] h-full border-r border-white/10 flex flex-col bg-[#0a0a0b]">
        {/* Scrollable inputs area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {triggers.map((trigger, index) => {
            const input = triggerInputs[trigger.id];
            if (!input) return null;

            const isTextType = trigger.type === 'text' || trigger.type === 'basic_call';

            return (
              <div key={trigger.id} className="space-y-3">
                {/* Label Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                    isTextType
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isTextType ? <Type size={12} /> : <FileImage size={12} />}
                    {input.label}
                  </span>
                </div>

                {/* Input Field */}
                {isTextType ? (
                  <textarea
                    className="w-full min-h-[100px] rounded-lg bg-[#141517] border border-white/10 p-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500/50 resize-none"
                    placeholder="Enter your prompt..."
                    value={input.value}
                    onChange={(e) => handleTextChange(trigger.id, e.target.value)}
                  />
                ) : (
                  <div className="space-y-2">
                    <div
                      className={`relative w-full rounded-lg border border-white/10 transition-colors bg-[#0f1012] ${
                        !input.fileUrl ? 'hover:border-purple-500/50 cursor-pointer' : ''
                      } overflow-hidden`}
                      onClick={() => !input.fileUrl && fileInputRefs.current[trigger.id]?.click()}
                    >
                      <input
                        ref={el => { fileInputRefs.current[trigger.id] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(trigger.id, file);
                        }}
                      />

                      {input.fileUrl ? (
                        <div className="relative bg-[#0f1012] p-2">
                          <img
                            src={input.fileUrl}
                            alt="Upload preview"
                            className="w-full h-auto max-h-[200px] object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 px-4">
                          <Upload size={24} className="text-gray-600" />
                          <span className="text-xs text-gray-500">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </div>

                    {input.fileUrl && (
                      <button
                        onClick={() => handleRemoveFile(trigger.id)}
                        className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                      >
                        <X size={12} />
                        Remove File
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress indicator */}
        {runProgress && isRunning && (
          <div className="px-4 py-3 border-t border-white/10 bg-[#0f1012]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Processing nodes...
              </span>
              <span className="text-xs text-purple-400">
                {runProgress.completedNodes}/{runProgress.totalNodes}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${(runProgress.completedNodes / runProgress.totalNodes) * 100}%` }}
              />
            </div>
            {runProgress.logs && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {runProgress.logs.slice(-4).map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {log.status === 'completed' ? (
                      <CheckCircle2 size={12} className="text-green-400" />
                    ) : log.status === 'failed' ? (
                      <XCircle size={12} className="text-red-400" />
                    ) : (
                      <Loader2 size={12} className="text-purple-400 animate-spin" />
                    )}
                    <span className="text-gray-500 truncate">{log.nodeType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="px-4 py-3 border-t border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Fixed Run button at bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isRunning
                ? 'bg-purple-600/50 text-purple-200 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={18} />
                Run Workflow
              </>
            )}
          </button>
          {!workflowId && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Save your workflow to enable real execution
            </p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Output */}
      <div className="flex-1 h-full flex items-center justify-center p-6 bg-[#050506]">
        <div className="w-full h-full rounded-xl border border-white/10 bg-[#0a0a0b] flex items-center justify-center overflow-hidden">
          {primaryResult?.imageUrl ? (
            <img
              src={primaryResult.imageUrl}
              alt={primaryResult.label}
              className="max-w-full max-h-full object-contain"
            />
          ) : primaryResult?.videoUrl ? (
            <video
              src={primaryResult.videoUrl}
              controls
              className="max-w-full max-h-full"
            />
          ) : primaryResult?.audioUrl ? (
            <div className="flex flex-col items-center gap-4">
              <Music size={48} className="text-yellow-400" />
              <audio src={primaryResult.audioUrl} controls />
            </div>
          ) : isRunning ? (
            <div className="flex flex-col items-center gap-4 text-gray-500">
              <Loader2 size={48} className="animate-spin text-purple-400" />
              <span className="text-sm">Generating output...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center">
                <ImageIcon size={28} />
              </div>
              <span className="text-sm">Output will appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
