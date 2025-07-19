import express from 'express';
import { resolve } from 'path';
import { setupVite, log } from './vite';
import { createServer } from 'http';

const app = express();
const port = parseInt(process.env.PORT || '5000');

const server = createServer(app);

// In development, use Vite dev server
if (process.env.NODE_ENV === 'development') {
  setupVite(app, server);
} else {
  // In production, serve static files
  app.use(express.static(resolve(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../client/dist/index.html'));
  });
}

server.listen(port, '0.0.0.0', () => {
  log(`serving on port ${port}`);
});