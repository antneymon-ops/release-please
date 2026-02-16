import React, { useState, useEffect, useCallback } from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Settings, Users, LogOut, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  const handleSelect = useCallback((callback: () => void) => {
    callback();
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[1040]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Command Palette */}
          <div className="fixed inset-0 z-[1050] flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Command className="rounded-lg border border-border bg-background shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-border px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type a command or search..."
                    className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                    <span className="text-xs">ESC</span>
                  </kbd>
                </div>
                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground mb-2">
                    <CommandItem
                      icon={<FileText className="h-4 w-4" />}
                      onSelect={() => handleSelect(() => console.log('Navigate to dashboard'))}
                    >
                      Dashboard
                    </CommandItem>
                    <CommandItem
                      icon={<FileText className="h-4 w-4" />}
                      onSelect={() => handleSelect(() => console.log('Navigate to releases'))}
                    >
                      Releases
                    </CommandItem>
                    <CommandItem
                      icon={<Users className="h-4 w-4" />}
                      onSelect={() => handleSelect(() => console.log('Navigate to team'))}
                    >
                      Team
                    </CommandItem>
                    <CommandItem
                      icon={<Settings className="h-4 w-4" />}
                      onSelect={() => handleSelect(() => console.log('Navigate to settings'))}
                    >
                      Settings
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading="Actions" className="text-xs font-medium text-muted-foreground mb-2">
                    <CommandItem
                      icon={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      onSelect={() => handleSelect(toggleTheme)}
                      shortcut="⌘D"
                    >
                      Toggle theme
                    </CommandItem>
                    <CommandItem
                      icon={<LogOut className="h-4 w-4" />}
                      onSelect={() => handleSelect(() => console.log('Logout'))}
                    >
                      Logout
                    </CommandItem>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CommandItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

const CommandItem: React.FC<CommandItemProps> = ({ children, icon, shortcut, onSelect }) => {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer select-none outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground transition-colors"
    >
      {icon}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
};
