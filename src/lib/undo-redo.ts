// Undo/Redo System for SnapConvert

export interface ConversionAction {
  id: string;
  type: 'conversion' | 'file_add' | 'file_remove' | 'settings_change';
  timestamp: number;
  description: string;
  data: any;
  undo: () => void;
  redo: () => void;
}

export interface UndoRedoState {
  history: ConversionAction[];
  currentIndex: number;
  maxHistorySize: number;
}

export class UndoRedoManager {
  private state: UndoRedoState = {
    history: [],
    currentIndex: -1,
    maxHistorySize: 50
  };

  private listeners: Set<(state: UndoRedoState) => void> = new Set();

  constructor(maxHistorySize: number = 50) {
    this.state.maxHistorySize = maxHistorySize;
  }

  public addAction(action: Omit<ConversionAction, 'id' | 'timestamp'>): void {
    const fullAction: ConversionAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now()
    };

    // Remove any actions after current index (when branching from history)
    this.state.history = this.state.history.slice(0, this.state.currentIndex + 1);

    // Add new action
    this.state.history.push(fullAction);
    this.state.currentIndex = this.state.history.length - 1;

    // Limit history size
    if (this.state.history.length > this.state.maxHistorySize) {
      this.state.history.shift();
      this.state.currentIndex--;
    }

    this.notifyListeners();
  }

  public undo(): boolean {
    if (!this.canUndo()) return false;

    const action = this.state.history[this.state.currentIndex];
    action.undo();
    this.state.currentIndex--;

    this.notifyListeners();
    return true;
  }

  public redo(): boolean {
    if (!this.canRedo()) return false;

    this.state.currentIndex++;
    const action = this.state.history[this.state.currentIndex];
    action.redo();

    this.notifyListeners();
    return true;
  }

  public canUndo(): boolean {
    return this.state.currentIndex >= 0;
  }

  public canRedo(): boolean {
    return this.state.currentIndex < this.state.history.length - 1;
  }

  public getCurrentAction(): ConversionAction | null {
    if (this.state.currentIndex >= 0 && this.state.currentIndex < this.state.history.length) {
      return this.state.history[this.state.currentIndex];
    }
    return null;
  }

  public getHistory(): ConversionAction[] {
    return [...this.state.history];
  }

  public getUndoHistory(): ConversionAction[] {
    return this.state.history.slice(0, this.state.currentIndex + 1);
  }

  public getRedoHistory(): ConversionAction[] {
    return this.state.history.slice(this.state.currentIndex + 1);
  }

  public clear(): void {
    this.state.history = [];
    this.state.currentIndex = -1;
    this.notifyListeners();
  }

  public subscribe(listener: (state: UndoRedoState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private generateId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Action creators for common operations
export const createConversionAction = (
  files: File[],
  settings: any,
  results: any[],
  onUndo: () => void,
  onRedo: () => void
): Omit<ConversionAction, 'id' | 'timestamp'> => ({
  type: 'conversion',
  description: `Convert ${files.length} file${files.length > 1 ? 's' : ''} to ${settings.format.toUpperCase()}`,
  data: { files, settings, results },
  undo: onUndo,
  redo: onRedo
});

export const createFileAddAction = (
  files: File[],
  onUndo: () => void,
  onRedo: () => void
): Omit<ConversionAction, 'id' | 'timestamp'> => ({
  type: 'file_add',
  description: `Add ${files.length} file${files.length > 1 ? 's' : ''}`,
  data: { files },
  undo: onUndo,
  redo: onRedo
});

export const createFileRemoveAction = (
  files: File[],
  onUndo: () => void,
  onRedo: () => void
): Omit<ConversionAction, 'id' | 'timestamp'> => ({
  type: 'file_remove',
  description: `Remove ${files.length} file${files.length > 1 ? 's' : ''}`,
  data: { files },
  undo: onUndo,
  redo: onRedo
});

export const createSettingsChangeAction = (
  oldSettings: any,
  newSettings: any,
  onUndo: () => void,
  onRedo: () => void
): Omit<ConversionAction, 'id' | 'timestamp'> => ({
  type: 'settings_change',
  description: `Change settings to ${newSettings.format.toUpperCase()}`,
  data: { oldSettings, newSettings },
  undo: onUndo,
  redo: onRedo
});

// Singleton instance
let undoRedoManager: UndoRedoManager | null = null;

export function getUndoRedoManager(): UndoRedoManager {
  if (!undoRedoManager) {
    undoRedoManager = new UndoRedoManager();
  }
  return undoRedoManager;
}

export function destroyUndoRedoManager(): void {
  if (undoRedoManager) {
    undoRedoManager.clear();
    undoRedoManager = null;
  }
}
