// Enhanced Keyboard Shortcuts System

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category: 'navigation' | 'file' | 'conversion' | 'ui';
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeEventListeners();
    }
  }

  private initializeEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const shortcutKey = this.getShortcutKey(event);
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
    }
  }

  private getShortcutKey(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }

  public registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKeyFromShortcut(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  private getShortcutKeyFromShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.meta) parts.push('meta');
    
    parts.push(shortcut.key.toLowerCase());
    
    return parts.join('+');
  }

  public unregisterShortcut(key: string): void {
    this.shortcuts.delete(key);
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  public getShortcutsByCategory(category: string): KeyboardShortcut[] {
    return this.getShortcuts().filter(shortcut => shortcut.category === category);
  }

  public destroy(): void {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    this.shortcuts.clear();
  }
}

// Predefined shortcuts for SnapConvert
export const createSnapConvertShortcuts = (
  actions: {
    openFileDialog: () => void;
    startConversion: () => void;
    cancelConversion: () => void;
    downloadAll: () => void;
    clearFiles: () => void;
    toggleSettings: () => void;
    toggleHistory: () => void;
    toggleHelp: () => void;
    focusSearch: () => void;
    selectAll: () => void;
    undo: () => void;
    redo: () => void;
  }
): KeyboardShortcut[] => {
  return [
    // File Operations
    {
      key: 'o',
      ctrl: true,
      description: 'Open file dialog',
      action: actions.openFileDialog,
      category: 'file'
    },
    {
      key: 's',
      ctrl: true,
      description: 'Start conversion',
      action: actions.startConversion,
      category: 'conversion'
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Download all converted files',
      action: actions.downloadAll,
      category: 'file'
    },
    {
      key: 'a',
      ctrl: true,
      description: 'Select all files',
      action: actions.selectAll,
      category: 'file'
    },
    {
      key: 'Delete',
      description: 'Clear selected files',
      action: actions.clearFiles,
      category: 'file'
    },

    // Conversion Control
    {
      key: 'Escape',
      description: 'Cancel conversion',
      action: actions.cancelConversion,
      category: 'conversion'
    },
    {
      key: 'Enter',
      description: 'Start conversion',
      action: actions.startConversion,
      category: 'conversion'
    },

    // UI Navigation
    {
      key: 'h',
      ctrl: true,
      description: 'Toggle help/shortcuts',
      action: actions.toggleHelp,
      category: 'ui'
    },
    {
      key: 't',
      ctrl: true,
      description: 'Toggle settings panel',
      action: actions.toggleSettings,
      category: 'ui'
    },
    {
      key: 'y',
      ctrl: true,
      description: 'Toggle history panel',
      action: actions.toggleHistory,
      category: 'ui'
    },
    {
      key: 'f',
      ctrl: true,
      description: 'Focus search',
      action: actions.focusSearch,
      category: 'navigation'
    },

    // Undo/Redo
    {
      key: 'z',
      ctrl: true,
      description: 'Undo last action',
      action: actions.undo,
      category: 'ui'
    },
    {
      key: 'y',
      ctrl: true,
      shift: true,
      description: 'Redo last action',
      action: actions.redo,
      category: 'ui'
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      description: 'Redo last action',
      action: actions.redo,
      category: 'ui'
    },

    // Navigation
    {
      key: 'g',
      ctrl: true,
      description: 'Go to guides/blog',
      action: () => window.location.href = '/blog',
      category: 'navigation'
    },
    {
      key: '1',
      ctrl: true,
      description: 'Go to convert page',
      action: () => window.location.href = '/',
      category: 'navigation'
    }
  ];
};

// Format shortcut display
export function formatShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Cmd');
  
  // Format the key
  let key = shortcut.key;
  if (key === ' ') key = 'Space';
  if (key === 'ArrowUp') key = '↑';
  if (key === 'ArrowDown') key = '↓';
  if (key === 'ArrowLeft') key = '←';
  if (key === 'ArrowRight') key = '→';
  
  parts.push(key);
  
  return parts.join(' + ');
}

// Singleton instance
let shortcutManager: KeyboardShortcutManager | null = null;

export function getShortcutManager(): KeyboardShortcutManager {
  if (!shortcutManager && typeof window !== 'undefined') {
    shortcutManager = new KeyboardShortcutManager();
  }
  return shortcutManager!;
}

export function destroyShortcutManager(): void {
  if (shortcutManager) {
    shortcutManager.destroy();
    shortcutManager = null;
  }
}
