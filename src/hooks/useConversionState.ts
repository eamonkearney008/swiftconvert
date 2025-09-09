import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ConversionJob, BatchConversion, ConversionSettings, ConversionResult } from '@/types';

// Core state atoms
export const selectedFilesAtom = atom<File[]>([]);
export const conversionSettingsAtom = atom<ConversionSettings>({
  format: 'webp',
  quality: 85,
  preserveExif: false,
  preserveColorProfile: false,
});

export const activeBatchesAtom = atom<BatchConversion[]>([]);
export const conversionResultsAtom = atom<ConversionResult[]>([]);
export const isProcessingAtom = atom<boolean>(false);

// Derived atoms
export const totalFilesAtom = atom((get) => get(selectedFilesAtom).length);
export const hasSelectedFilesAtom = atom((get) => get(selectedFilesAtom).length > 0);

export const activeBatchCountAtom = atom((get) => 
  get(activeBatchesAtom).filter(batch => 
    batch.status === 'processing' || batch.status === 'pending'
  ).length
);

export const completedBatchesAtom = atom((get) =>
  get(activeBatchesAtom).filter(batch => batch.status === 'completed')
);

export const errorBatchesAtom = atom((get) =>
  get(activeBatchesAtom).filter(batch => batch.status === 'error')
);

export const totalProgressAtom = atom((get) => {
  const batches = get(activeBatchesAtom);
  if (batches.length === 0) return 0;
  
  const totalProgress = batches.reduce((sum, batch) => sum + batch.progress, 0);
  return totalProgress / batches.length;
});

// Action atoms
export const addFilesAtom = atom(
  null,
  (get, set, files: File[]) => {
    const currentFiles = get(selectedFilesAtom);
    set(selectedFilesAtom, [...currentFiles, ...files]);
  }
);

export const removeFileAtom = atom(
  null,
  (get, set, fileIndex: number) => {
    const currentFiles = get(selectedFilesAtom);
    set(selectedFilesAtom, currentFiles.filter((_, index) => index !== fileIndex));
  }
);

export const clearFilesAtom = atom(
  null,
  (get, set) => {
    set(selectedFilesAtom, []);
    set(conversionResultsAtom, []);
  }
);

export const updateSettingsAtom = atom(
  null,
  (get, set, settings: Partial<ConversionSettings>) => {
    const currentSettings = get(conversionSettingsAtom);
    set(conversionSettingsAtom, { ...currentSettings, ...settings });
  }
);

export const addBatchAtom = atom(
  null,
  (get, set, batch: BatchConversion) => {
    const currentBatches = get(activeBatchesAtom);
    set(activeBatchesAtom, [...currentBatches, batch]);
  }
);

export const updateBatchAtom = atom(
  null,
  (get, set, batchId: string, updates: Partial<BatchConversion>) => {
    const currentBatches = get(activeBatchesAtom);
    const updatedBatches = currentBatches.map(batch =>
      batch.id === batchId ? { ...batch, ...updates } : batch
    );
    set(activeBatchesAtom, updatedBatches);
  }
);

export const removeBatchAtom = atom(
  null,
  (get, set, batchId: string) => {
    const currentBatches = get(activeBatchesAtom);
    set(activeBatchesAtom, currentBatches.filter(batch => batch.id !== batchId));
  }
);

export const addResultsAtom = atom(
  null,
  (get, set, results: ConversionResult[]) => {
    const currentResults = get(conversionResultsAtom);
    set(conversionResultsAtom, [...currentResults, ...results]);
  }
);

export const clearResultsAtom = atom(
  null,
  (get, set) => {
    set(conversionResultsAtom, []);
  }
);

export const setProcessingAtom = atom(
  null,
  (get, set, isProcessing: boolean) => {
    set(isProcessingAtom, isProcessing);
  }
);

// Custom hooks for common operations
export function useConversionState() {
  const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
  const [settings, setSettings] = useAtom(conversionSettingsAtom);
  const [activeBatches, setActiveBatches] = useAtom(activeBatchesAtom);
  const [results, setResults] = useAtom(conversionResultsAtom);
  const [isProcessing, setIsProcessing] = useAtom(isProcessingAtom);

  const addFiles = useSetAtom(addFilesAtom);
  const removeFile = useSetAtom(removeFileAtom);
  const clearFiles = useSetAtom(clearFilesAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);
  const addBatch = useSetAtom(addBatchAtom);
  const updateBatch = useSetAtom(updateBatchAtom);
  const removeBatch = useSetAtom(removeBatchAtom);
  const addResults = useSetAtom(addResultsAtom);
  const clearResults = useSetAtom(clearResultsAtom);
  const setProcessing = useSetAtom(setProcessingAtom);

  return {
    // State
    selectedFiles,
    settings,
    activeBatches,
    results,
    isProcessing,
    
    // Actions
    addFiles,
    removeFile,
    clearFiles,
    updateSettings,
    addBatch,
    updateBatch,
    removeBatch,
    addResults,
    clearResults,
    setProcessing,
  };
}

export function useConversionStats() {
  const totalFiles = useAtomValue(totalFilesAtom);
  const hasSelectedFiles = useAtomValue(hasSelectedFilesAtom);
  const activeBatchCount = useAtomValue(activeBatchCountAtom);
  const completedBatches = useAtomValue(completedBatchesAtom);
  const errorBatches = useAtomValue(errorBatchesAtom);
  const totalProgress = useAtomValue(totalProgressAtom);

  return {
    totalFiles,
    hasSelectedFiles,
    activeBatchCount,
    completedBatches,
    errorBatches,
    totalProgress,
  };
}

export function useBatchOperations() {
  const addBatch = useSetAtom(addBatchAtom);
  const updateBatch = useSetAtom(updateBatchAtom);
  const removeBatch = useSetAtom(removeBatchAtom);

  const createBatch = (files: File[], settings: ConversionSettings) => {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const jobs: ConversionJob[] = files.map((file, index) => ({
      id: `${batchId}_${index}`,
      file,
      settings,
      status: 'pending',
      progress: 0,
    }));

    const batch: BatchConversion = {
      id: batchId,
      jobs,
      status: 'pending',
      progress: 0,
      totalFiles: files.length,
      completedFiles: 0,
    };

    addBatch(batch);
    return batch;
  };

  const cancelBatch = (batchId: string) => {
    updateBatch(batchId, { status: 'error' });
  };

  const completeBatch = (batchId: string, zipResult?: Blob) => {
    updateBatch(batchId, { 
      status: 'completed', 
      progress: 100,
      zipResult 
    });
  };

  return {
    createBatch,
    updateBatch,
    removeBatch,
    cancelBatch,
    completeBatch,
  };
}

