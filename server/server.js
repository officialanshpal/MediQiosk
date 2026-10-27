import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';
import { requestInterceptor } from './middlewares/requestInterceptor.js';
import { errorFilter } from './middlewares/errorFilter.js';
import { schedulerService } from './services/schedulerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & Body Parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply Request Interceptor Middleware
app.use(requestInterceptor);

// Register API Routes
app.use('/api', apiRoutes);

// Serve Static Frontend assets in Production build
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to React index.html for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
      if (err) {
        res.status(200).send('MediQiosk API Server running. Frontend static build will appear here when built.');
      }
    });
  }
});

// Apply Global Error Filter
app.use(errorFilter);

// Start Server & Background Cron Scheduler
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MediQiosk SIH Server active on http://localhost:${PORT}`);
  console.log(`====================================================`);
  
  // Launch Background Scheduler
  schedulerService.startScheduler(30000);
});
