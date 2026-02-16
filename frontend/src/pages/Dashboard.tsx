import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Package, Users, TrendingUp, Activity, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Loading';
import { useNotifications } from '@/contexts/NotificationContext';

export const Dashboard: React.FC = () => {
  const { showNotification } = useNotifications();

  useEffect(() => {
    // Show a welcome notification on mount
    showNotification({
      type: 'success',
      title: 'Welcome to Release Please!',
      message: 'Your comprehensive release management dashboard is ready.',
    });
  }, [showNotification]);

  const stats = [
    {
      title: 'Total Releases',
      value: '24',
      change: '+12%',
      icon: Package,
      trend: 'up',
    },
    {
      title: 'Active Branches',
      value: '8',
      change: '+2',
      icon: GitBranch,
      trend: 'up',
    },
    {
      title: 'Team Members',
      value: '12',
      change: 'Stable',
      icon: Users,
      trend: 'neutral',
    },
    {
      title: 'Release Rate',
      value: '2.4/week',
      change: '+8%',
      icon: TrendingUp,
      trend: 'up',
    },
  ];

  const recentReleases = [
    {
      version: 'v2.3.0',
      date: '2 hours ago',
      status: 'published',
      changes: 'feat: Add new dashboard UI components',
    },
    {
      version: 'v2.2.1',
      date: '1 day ago',
      status: 'published',
      changes: 'fix: Resolve authentication bug',
    },
    {
      version: 'v2.2.0',
      date: '3 days ago',
      status: 'published',
      changes: 'feat: Implement dark mode support',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your releases.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Package className="h-4 w-4" />}>
            Create Release
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                    <Badge
                      variant={stat.trend === 'up' ? 'success' : 'secondary'}
                      size="sm"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Releases */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Releases</CardTitle>
                  <CardDescription>Latest published releases</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReleases.map((release, index) => (
                  <div
                    key={release.version}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-primary/10 rounded">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{release.version}</span>
                        <Badge variant="success" size="sm">
                          {release.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">
                        {release.changes}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {release.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Package className="h-4 w-4" />}
                  className="justify-start"
                >
                  Create New Release
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<GitBranch className="h-4 w-4" />}
                  className="justify-start"
                >
                  View All Branches
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Users className="h-4 w-4" />}
                  className="justify-start"
                >
                  Manage Team
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<TrendingUp className="h-4 w-4" />}
                  className="justify-start"
                >
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card padding="sm">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘K</kbd>
            <span>or</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+K</kbd>
            <span>to open command palette</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
