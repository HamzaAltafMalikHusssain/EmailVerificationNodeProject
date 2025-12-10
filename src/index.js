// src/index.js - DEBUG VERSION (updated)
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// simple request logger to help debug Postman requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ─ ${req.method} ${req.originalUrl}`);
  next();
});

console.log('🔍 Debugging routes...');

// Check if routes file exists
const routesPath = path.join(__dirname, 'routes', 'auth.js');
console.log('Routes path:', routesPath);
console.log('File exists:', fs.existsSync(routesPath));

try {
  // Try to require the routes
  const authRoutes = require('./routes/auth');
  console.log('✅ authRoutes imported successfully');
  console.log('Type of authRoutes:', typeof authRoutes);
  console.log('Is authRoutes a function?', typeof authRoutes === 'function');
  console.log('Is authRoutes an object?', typeof authRoutes === 'object');

  if (typeof authRoutes === 'function') {
    console.log('✅ authRoutes is a function (router)');
    app.use('/api/auth', authRoutes);
  } else if (
    authRoutes &&
    typeof authRoutes === 'object' &&
    authRoutes.router
  ) {
    console.log('✅ authRoutes has .router property');
    app.use('/api/auth', authRoutes.router);
  } else {
    console.log('❌ authRoutes is not in expected format');
    // Create simple routes instead
    const {
      register,
      verifyByCode,
      verifyByToken,
    } = require('./controllers/authController');
    app.post('/api/auth/register', register);
    app.post('/api/auth/verify/code', verifyByCode);
    app.post('/api/auth/verify/token', verifyByToken);
  }
} catch (error) {
  console.error('❌ Error importing routes:', error.message);
  console.error('Stack:', error.stack);

  // Fallback: import controller directly
  console.log('🔄 Creating direct routes...');
  const {
    register,
    verifyByCode,
    verifyByToken,
  } = require('./controllers/authController');
  app.post('/api/auth/register', register);
  app.post('/api/auth/verify/code', verifyByCode);
  app.post('/api/auth/verify/token', verifyByToken);
}

// Health endpoint
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    message: 'Server is running',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Auth API',
    status: 'running',
    endpoints: {
      register: 'POST /api/auth/register',
      verifyCode: 'POST /api/auth/verify/code',
      verifyToken: 'POST /api/auth/verify/token',
      health: 'GET /healthz',
    },
  });
});

const PORT = process.env.PORT || 4000;
// bind to 0.0.0.0 so webcontainers / sandboxes can forward the port
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
});
