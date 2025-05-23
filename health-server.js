/**
 * Standalone Health Check Server
 * 
 * This is a minimal HTTP server that only responds to health check requests.
 * It's designed to be extremely reliable and have minimal dependencies.
 */

const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Set timestamp for logging
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`[${timestamp}] Request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Handle health check requests
  if (req.url === '/health' || req.url === '/health/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'health-check',
      timestamp
    }));
    console.log(`[${timestamp}] Health check - responded with 200 OK`);
    return;
  }
  
  // For all other requests, redirect to /health
  res.writeHead(302, { 'Location': '/health' });
  res.end();
  console.log(`[${timestamp}] Redirected to /health`);
});

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start server
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Health check server running on port ${PORT}`);
});