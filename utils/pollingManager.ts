import { apiService, StatusResponse } from '../services/apiService';

interface PollingConfig {
  jobId: string;
  nodeId: string;
  nodeType: string;
  usedModel?: string;
  onUpdate: (status: StatusResponse) => void;
  onComplete: (result: StatusResponse) => void;
  onError: (error: Error) => void;
  interval?: number;
  maxAttempts?: number;
}

class PollingManager {
  private activePolls = new Map<string, number>();

  startPolling(config: PollingConfig) {
    const { 
      jobId, 
      nodeId,
      nodeType,
      usedModel,
      onUpdate, 
      onComplete, 
      onError, 
      interval = 3000, 
      maxAttempts = 200 
    } = config;
    
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        const status = await apiService.getJobStatus(jobId, nodeType, usedModel);
        
        onUpdate(status);

        if (status.status === 'completed') {
          this.stopPolling(nodeId);
          onComplete(status);
        } else if (status.status === 'failed') {
          this.stopPolling(nodeId);
          onError(new Error(status.result?.error || 'Generation failed'));
        } else if (attempts >= maxAttempts) {
          this.stopPolling(nodeId);
          onError(new Error('Polling timeout: Maximum attempts reached'));
        }
      } catch (error) {
        this.stopPolling(nodeId);
        onError(error as Error);
      }
    };

    // Start polling immediately, then at intervals
    poll();
    const intervalId = window.setInterval(poll, interval);
    this.activePolls.set(nodeId, intervalId);
  }

  stopPolling(nodeId: string) {
    const intervalId = this.activePolls.get(nodeId);
    if (intervalId) {
      clearInterval(intervalId);
      this.activePolls.delete(nodeId);
    }
  }

  stopAllPolling() {
    this.activePolls.forEach((intervalId) => clearInterval(intervalId));
    this.activePolls.clear();
  }
}

export const pollingManager = new PollingManager();

