const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/releases', (req, res) => {
  // Mock data for demonstration
  res.json({
    releases: [
      {
        id: 1,
        version: 'v2.3.0',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        changes: 'feat: Add new dashboard UI components',
      },
      {
        id: 2,
        version: 'v2.2.1',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        changes: 'fix: Resolve authentication bug',
      },
      {
        id: 3,
        version: 'v2.2.0',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        changes: 'feat: Implement dark mode support',
      },
    ],
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalReleases: 24,
    activeBranches: 8,
    teamMembers: 12,
    releaseRate: '2.4/week',
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send welcome message
  socket.emit('notification', {
    type: 'info',
    title: 'Connected to Release Please',
    message: 'Real-time updates are now active',
    timestamp: new Date().toISOString(),
  });

  // Handle client events
  socket.on('subscribe', (data) => {
    console.log('Client subscribed to:', data);
    socket.join(data.channel);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate real-time events every 30 seconds
setInterval(() => {
  io.emit('notification', {
    type: 'info',
    title: 'System Update',
    message: 'All systems operational',
    timestamp: new Date().toISOString(),
  });
}, 30000);

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
