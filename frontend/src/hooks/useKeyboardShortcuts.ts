import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey || shortcut.ctrlKey === undefined;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey || shortcut.metaKey === undefined;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey || shortcut.shiftKey === undefined;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey || shortcut.altKey === undefined;

        // For ctrlOrMeta shortcuts (cross-platform)
        const ctrlOrMetaMatch = (shortcut.ctrlKey || shortcut.metaKey) && (event.ctrlKey || event.metaKey);

        if (keyMatch && (ctrlOrMetaMatch || (ctrlMatch && metaMatch)) && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.callback(event);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export interface KeyboardShortcutHelpItem {
  category: string;
  shortcuts: Array<{
    keys: string;
    description: string;
  }>;
}

export const COMMON_SHORTCUTS: KeyboardShortcutHelpItem[] = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: '⌘K / Ctrl+K', description: 'Open command palette' },
      { keys: '/', description: 'Focus search' },
      { keys: 'G then D', description: 'Go to dashboard' },
      { keys: 'G then S', description: 'Go to settings' },
    ],
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: '⌘D / Ctrl+D', description: 'Toggle dark mode' },
      { keys: '⌘N / Ctrl+N', description: 'New release' },
      { keys: '⌘S / Ctrl+S', description: 'Save changes' },
      { keys: 'Esc', description: 'Close modal/dialog' },
    ],
  },
  {
    category: 'General',
    shortcuts: [
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: '⌘,', description: 'Open preferences' },
    ],
  },
];
