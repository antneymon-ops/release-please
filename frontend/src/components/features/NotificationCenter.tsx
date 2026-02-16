import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-[1000] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed md:absolute right-0 md:right-auto top-0 md:top-full md:mt-2 w-full md:w-96 h-full md:h-auto md:max-h-[600px] bg-background border border-border rounded-none md:rounded-lg shadow-2xl z-[1010] flex flex-col"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        title="Mark all as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        title="Clear all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No notifications yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll notify you when something important happens
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={() => markAsRead(notification.id)}
                        onClear={() => clearNotification(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message?: string;
    timestamp: Date;
    read: boolean;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onMarkAsRead: () => void;
  onClear: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClear,
}) => {
  const typeStyles = {
    info: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    error: 'border-l-red-500',
  };

  return (
    <div
      className={cn(
        'p-4 border-l-4 transition-colors hover:bg-accent',
        typeStyles[notification.type],
        !notification.read && 'bg-accent/50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold">{notification.title}</h3>
            {!notification.read && (
              <span className="h-2 w-2 bg-primary rounded-full" aria-label="Unread" />
            )}
          </div>
          {notification.message && (
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.timestamp)}
          </p>
          {notification.action && (
            <Button
              variant="link"
              size="sm"
              onClick={notification.action.onClick}
              className="mt-2 p-0 h-auto"
            >
              {notification.action.label}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!notification.read && (
            <button
              onClick={onMarkAsRead}
              className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClear}
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
            title="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
