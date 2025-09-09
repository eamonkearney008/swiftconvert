// Web Worker Manager for Image Processing
export class WorkerManager {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingMessages = new Map<number, { resolve: Function; reject: Function }>();

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('/image-worker.js');
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleError.bind(this);
    }
  }

  private handleMessage(e: MessageEvent) {
    const { messageId, type, data, error } = e.data;
    
    if (messageId && this.pendingMessages.has(messageId)) {
      const { resolve, reject } = this.pendingMessages.get(messageId)!;
      this.pendingMessages.delete(messageId);
      
      if (error) {
        reject(new Error(error));
      } else {
        resolve({ type, data });
      }
    }
  }

  private handleError(error: ErrorEvent) {
    console.error('Web Worker error:', error);
    // Reject all pending messages
    this.pendingMessages.forEach(({ reject }) => {
      reject(new Error('Worker error'));
    });
    this.pendingMessages.clear();
  }

  private sendMessage(type: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Worker not available'));
        return;
      }

      const messageId = ++this.messageId;
      this.pendingMessages.set(messageId, { resolve, reject });

      this.worker.postMessage({
        messageId,
        type,
        data
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId);
          reject(new Error('Worker timeout'));
        }
      }, 30000);
    });
  }

  async convertImage(file: File, settings: any, format: string): Promise<any> {
    return this.sendMessage('CONVERT_IMAGE', { file, settings, format });
  }

  async extractMetadata(file: File): Promise<any> {
    return this.sendMessage('EXTRACT_METADATA', { file });
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingMessages.clear();
  }
}

// Singleton instance
let workerManager: WorkerManager | null = null;

export function getWorkerManager(): WorkerManager {
  if (!workerManager) {
    workerManager = new WorkerManager();
  }
  return workerManager;
}

export function destroyWorkerManager() {
  if (workerManager) {
    workerManager.destroy();
    workerManager = null;
  }
}
