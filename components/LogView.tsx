import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2, Play, AlertCircle, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { apiService } from '../services/apiService';

interface LogViewProps {
  workflowId: string | null;
}

interface WorkflowRun {
  id: string;
  status: string;
  totalNodes: number;
  completedNodes: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

interface ExecutionLogEntry {
  id: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: string;
  input?: any;
  output?: any;
  jobId?: string;
  error?: string;
  executionOrder: number;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
}

export const LogView: React.FC<LogViewProps> = ({ workflowId }) => {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Fetch runs for this workflow
  const fetchRuns = useCallback(async () => {
    if (!workflowId) return;

    try {
      setIsLoading(true);
      setError(null);
      const workflowRuns = await apiService.listWorkflowRuns(workflowId);
      setRuns(workflowRuns);

      // Auto-select the most recent run
      if (workflowRuns.length > 0 && !selectedRunId) {
        setSelectedRunId(workflowRuns[0].id);
      }
    } catch (err) {
      console.error('Error fetching runs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch runs');
    } finally {
      setIsLoading(false);
    }
  }, [workflowId, selectedRunId]);

  // Fetch logs for selected run
  const fetchLogs = useCallback(async () => {
    if (!selectedRunId) return;

    try {
      setIsRefreshing(true);
      const result = await apiService.getExecutionLogs(selectedRunId);
      setLogs(result.logs);

      // Auto-refresh if run is still in progress
      const selectedRun = runs.find(r => r.id === selectedRunId);
      if (selectedRun && (selectedRun.status === 'running' || selectedRun.status === 'pending')) {
        setTimeout(() => {
          fetchRuns();
          fetchLogs();
        }, 3000);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedRunId, runs, fetchRuns]);

  // Initial fetch
  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  // Fetch logs when run is selected
  useEffect(() => {
    if (selectedRunId) {
      fetchLogs();
    }
  }, [selectedRunId, fetchLogs]);

  const toggleLogExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'running':
        return <Loader2 size={16} className="text-purple-400 animate-spin" />;
      case 'pending':
        return <Clock size={16} className="text-gray-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      case 'running':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (!workflowId) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-gray-700/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white">No Workflow Selected</h2>
          <p className="text-gray-400">
            Save your workflow to view execution logs.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && runs.length === 0) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-purple-400 animate-spin" />
          <span className="text-gray-400">Loading runs...</span>
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="absolute inset-0 top-14 flex items-center justify-center bg-[#050506]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-gray-700/20 flex items-center justify-center">
            <Play size={32} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white">No Runs Yet</h2>
          <p className="text-gray-400">
            Run your workflow from the App tab to see execution logs here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 top-14 flex bg-[#050506]">
      {/* LEFT PANEL - Run List */}
      <div className="w-[300px] h-full border-r border-white/10 flex flex-col bg-[#0a0a0b]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Execution History</h3>
          <button
            onClick={() => fetchRuns()}
            className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {runs.map(run => (
            <button
              key={run.id}
              onClick={() => setSelectedRunId(run.id)}
              className={`w-full p-4 text-left border-b border-white/5 transition-colors ${
                selectedRunId === run.id
                  ? 'bg-purple-500/10 border-l-2 border-l-purple-500'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(run.status)}
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(run.status)}`}>
                    {run.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {run.completedNodes}/{run.totalNodes}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(run.startedAt || run.createdAt)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - Log Details */}
      <div className="flex-1 h-full flex flex-col bg-[#050506]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Execution Log</h3>
          {isRefreshing && (
            <Loader2 size={14} className="text-purple-400 animate-spin" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No logs available</p>
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="bg-[#0a0a0b] border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleLogExpanded(log.id)}
                  className="w-full p-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {expandedLogs.has(log.id) ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}

                  {getStatusIcon(log.status)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate">
                        {log.nodeLabel}
                      </span>
                      <span className="text-xs text-gray-500">
                        {log.nodeType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatDuration(log.duration)}</span>
                    <span className="text-gray-600">#{log.executionOrder + 1}</span>
                  </div>
                </button>

                {expandedLogs.has(log.id) && (
                  <div className="border-t border-white/5 p-3 bg-[#0f1012] space-y-3 text-xs">
                    {log.error && (
                      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400">
                        <span className="font-semibold">Error:</span> {log.error}
                      </div>
                    )}

                    {log.jobId && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Job ID:</span>
                        <code className="text-gray-400 bg-black/30 px-1.5 py-0.5 rounded">
                          {log.jobId}
                        </code>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-500">Started:</span>{' '}
                        <span className="text-gray-300">{formatTime(log.startedAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>{' '}
                        <span className="text-gray-300">{formatTime(log.completedAt)}</span>
                      </div>
                    </div>

                    {log.input && Object.keys(log.input).length > 0 && (
                      <div>
                        <span className="text-gray-500 block mb-1">Input:</span>
                        <pre className="bg-black/30 p-2 rounded overflow-x-auto text-gray-400">
                          {JSON.stringify(log.input, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.output && Object.keys(log.output).length > 0 && (
                      <div>
                        <span className="text-gray-500 block mb-1">Output:</span>
                        <pre className="bg-black/30 p-2 rounded overflow-x-auto text-gray-400">
                          {JSON.stringify(log.output, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
