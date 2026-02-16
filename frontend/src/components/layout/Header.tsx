import React from 'react';
import { Moon, Sun, Settings, Menu } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationCenter } from '@/components/features/NotificationCenter';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isConnected } = useSocket();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Release Please</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Automated Release Management
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent">
            <StatusBadge status={isConnected ? 'online' : 'offline'} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2"
          >
            {theme === 'dark' || theme === 'system' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Settings"
            className="hidden md:flex p-2"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Avatar */}
          <Avatar
            size="sm"
            fallback="U"
            status="online"
            className="cursor-pointer hover:ring-2 hover:ring-ring transition-all"
          />
        </div>
      </div>
    </header>
  );
};
