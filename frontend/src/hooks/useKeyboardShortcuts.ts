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
        
        // Check modifier keys: only validate if explicitly set
        const ctrlMatch = shortcut.ctrlKey === undefined ? true : shortcut.ctrlKey === event.ctrlKey;
        const metaMatch = shortcut.metaKey === undefined ? true : shortcut.metaKey === event.metaKey;
        const shiftMatch = shortcut.shiftKey === undefined ? true : shortcut.shiftKey === event.shiftKey;
        const altMatch = shortcut.altKey === undefined ? true : shortcut.altKey === event.altKey;

        // For cross-platform shortcuts (Cmd on Mac, Ctrl on Windows/Linux)
        // Check if either ctrl or meta is specified, and if so, match either
        const crossPlatformMatch = (shortcut.ctrlKey || shortcut.metaKey)
          ? (event.ctrlKey || event.metaKey)
          : true;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch && crossPlatformMatch) {
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
