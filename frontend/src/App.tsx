import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { CommandPalette } from './components/ui/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { Header } from './components/layout/Header';

const AppContent: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Setup global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      callback: () => setIsCommandPaletteOpen(true),
      description: 'Open command palette',
    },
    {
      key: '/',
      callback: (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          // Focus search input
        }
      },
      description: 'Focus search',
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <Toaster position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
