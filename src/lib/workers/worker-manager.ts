import { ConversionSettings, ConversionResult } from '@/types';

// Worker message types
interface WorkerMessage {
  type: 'convert' | 'ping';
  id: string;
  data?: any;
}

interface WorkerResponse {
  type: 'result' | 'error' | 'progress' | 'pong';
  id: string;
  data?: any;
  error?: string;
  progress?: number;
}

// Worker pool configuration
interface WorkerPoolConfig {
  maxWorkers: number;
  workerScript: string;
}

/**
 * Worker Manager for handling image processing in Web Workers
 */
export class WorkerManager {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private busyWorkers: Set<Worker> = new Set();
  private pendingTasks: Array<{
    resolve: (result: ConversionResult) => void;
    reject: (error: Error) => void;
    worker: Worker;
    id: string;
  }> = [];
  private config: WorkerPoolConfig;
  private messageId = 0;

  constructor(config: WorkerPoolConfig) {
    this.config = config;
    // Only initialize workers on the client side
    if (typeof window !== 'undefined') {
      this.initializeWorkers();
    }
  }

  /**
   * Ensure workers are initialized (lazy initialization)
   */
  private ensureWorkersInitialized() {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initializeWorkers();
    }
  }

  /**
   * Initialize worker pool
   */
  private initializeWorkers() {
    const workerCount = Math.min(
      this.config.maxWorkers,
      navigator.hardwareConcurrency || 4
    );

    for (let i = 0; i < workerCount; i++) {
      this.createWorker();
    }
  }

  /**
   * Create a new worker
   */
  private createWorker(): Worker {
    if (typeof Worker === 'undefined') {
      throw new Error('Web Workers are not supported in this environment');
    }
    
    const worker = new Worker(
      new URL('./image-processor.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.handleWorkerMessage(worker, event.data);
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.handleWorkerError(worker, error);
    };

    this.workers.push(worker);
    this.availableWorkers.push(worker);

    return worker;
  }

  /**
   * Handle messages from workers
   */
  private handleWorkerMessage(worker: Worker, message: WorkerResponse) {
    const task = this.pendingTasks.find(t => t.id === message.id);
    
    if (!task) {
      console.warn(`Received message for unknown task: ${message.id}`);
      return;
    }

    switch (message.type) {
      case 'result':
        task.resolve(message.data);
        this.completeTask(worker, task);
        break;
        
      case 'error':
        task.reject(new Error(message.error || 'Worker error'));
        this.completeTask(worker, task);
        break;
        
      case 'progress':
        // Handle progress updates if needed
        console.log(`Task ${message.id} progress: ${message.progress}%`);
        break;
        
      case 'pong':
        // Worker is alive
        break;
    }
  }

  /**
   * Handle worker errors
   */
  private handleWorkerError(worker: Worker, error: ErrorEvent) {
    const task = this.pendingTasks.find(t => t.worker === worker);
    
    if (task) {
      task.reject(new Error(`Worker error: ${error.message}`));
      this.completeTask(worker, task);
    }
    
    // Remove and recreate the worker
    this.removeWorker(worker);
    this.createWorker();
  }

  /**
   * Complete a task and return worker to available pool
   */
  private completeTask(worker: Worker, task: any) {
    this.busyWorkers.delete(worker);
    this.availableWorkers.push(worker);
    
    const taskIndex = this.pendingTasks.indexOf(task);
    if (taskIndex > -1) {
      this.pendingTasks.splice(taskIndex, 1);
    }
  }

  /**
   * Remove a worker from the pool
   */
  private removeWorker(worker: Worker) {
    worker.terminate();
    
    const workerIndex = this.workers.indexOf(worker);
    if (workerIndex > -1) {
      this.workers.splice(workerIndex, 1);
    }
    
    const availableIndex = this.availableWorkers.indexOf(worker);
    if (availableIndex > -1) {
      this.availableWorkers.splice(availableIndex, 1);
    }
    
    this.busyWorkers.delete(worker);
  }

  /**
   * Get an available worker
   */
  private getAvailableWorker(): Worker | null {
    // Ensure workers are initialized
    this.ensureWorkersInitialized();
    
    if (this.availableWorkers.length > 0) {
      return this.availableWorkers.pop()!;
    }
    
    // If no workers available and we haven't reached max, create a new one
    if (this.workers.length < this.config.maxWorkers) {
      return this.createWorker();
    }
    
    return null;
  }

  /**
   * Process an image conversion task
   */
  async processImage(
    file: File,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    // Ensure workers are initialized
    this.ensureWorkersInitialized();
    
    // If we're on the server side, fall back to a simple error
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Web Workers are not available on the server side'));
    }
    
    return new Promise((resolve, reject) => {
      const worker = this.getAvailableWorker();
      
      if (!worker) {
        reject(new Error('No available workers'));
        return;
      }

      const taskId = `task_${++this.messageId}`;
      
      // Move worker to busy pool
      this.busyWorkers.add(worker);
      
      // Store task
      this.pendingTasks.push({
        resolve,
        reject,
        worker,
        id: taskId,
      });

      // Convert file to ArrayBuffer
      file.arrayBuffer().then(buffer => {
        const message: WorkerMessage = {
          type: 'convert',
          id: taskId,
          data: {
            file: buffer,
            fileName: file.name,
            settings,
          },
        };
        
        worker.postMessage(message);
      }).catch(error => {
        reject(error);
        this.completeTask(worker, this.pendingTasks.find(t => t.id === taskId));
      });
    });
  }

  /**
   * Process multiple images in parallel
   */
  async processImages(
    files: File[],
    settings: ConversionSettings
  ): Promise<ConversionResult[]> {
    const promises = files.map(file => this.processImage(file, settings));
    return Promise.all(promises);
  }

  /**
   * Check if workers are available
   */
  isAvailable(): boolean {
    return this.availableWorkers.length > 0 || this.workers.length < this.config.maxWorkers;
  }

  /**
   * Get worker pool status
   */
  getStatus(): {
    totalWorkers: number;
    availableWorkers: number;
    busyWorkers: number;
    pendingTasks: number;
  } {
    return {
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.busyWorkers.size,
      pendingTasks: this.pendingTasks.length,
    };
  }

  /**
   * Ping all workers to check if they're alive
   */
  async pingWorkers(): Promise<boolean[]> {
    const pingPromises = this.workers.map(worker => {
      return new Promise<boolean>((resolve) => {
        const pingId = `ping_${++this.messageId}`;
        const timeout = setTimeout(() => resolve(false), 5000);
        
        const handlePong = (event: MessageEvent<WorkerResponse>) => {
          if (event.data.type === 'pong' && event.data.id === pingId) {
            clearTimeout(timeout);
            worker.removeEventListener('message', handlePong);
            resolve(true);
          }
        };
        
        worker.addEventListener('message', handlePong);
        worker.postMessage({ type: 'ping', id: pingId });
      });
    });
    
    return Promise.all(pingPromises);
  }

  /**
   * Terminate all workers
   */
  terminate(): void {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.busyWorkers.clear();
    this.pendingTasks = [];
  }
}

// Lazy-loaded worker manager instance
let _workerManager: WorkerManager | null = null;

export const getWorkerManager = (): WorkerManager => {
  if (!_workerManager && typeof window !== 'undefined') {
    _workerManager = new WorkerManager({
      maxWorkers: Math.min(navigator.hardwareConcurrency || 4, 8),
      workerScript: './image-processor.worker.ts',
    });
  }
  return _workerManager!;
};
