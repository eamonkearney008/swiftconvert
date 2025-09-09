'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, FileImage, Settings, Navigation, RotateCcw } from 'lucide-react';
import { KeyboardShortcut, formatShortcutDisplay } from '../lib/keyboard-shortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts
}: KeyboardShortcutsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Shortcuts', icon: Keyboard },
    { id: 'file', name: 'File Operations', icon: FileImage },
    { id: 'conversion', name: 'Conversion', icon: Settings },
    { id: 'navigation', name: 'Navigation', icon: Navigation },
    { id: 'ui', name: 'Interface', icon: RotateCcw }
  ];

  const filteredShortcuts = selectedCategory === 'all' 
    ? shortcuts 
    : shortcuts.filter(shortcut => shortcut.category === selectedCategory);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Speed up your workflow with these shortcuts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                const count = category.id === 'all' 
                  ? shortcuts.length 
                  : shortcuts.filter(s => s.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                      ${isActive
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Shortcuts List */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {filteredShortcuts.length > 0 ? (
                <div className="space-y-3">
                  {filteredShortcuts.map((shortcut, index) => (
                    <motion.div
                      key={`${shortcut.key}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {shortcut.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {formatShortcutDisplay(shortcut).split(' + ').map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-sm">
                              {key}
                            </kbd>
                            {keyIndex < formatShortcutDisplay(shortcut).split(' + ').length - 1 && (
                              <span className="text-slate-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Keyboard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No shortcuts found for this category
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <p>
                  Press <kbd className="px-1 py-0.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded">Esc</kbd> to close
                </p>
                <p>
                  {filteredShortcuts.length} shortcut{filteredShortcuts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
