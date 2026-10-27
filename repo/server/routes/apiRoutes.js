import express from 'express';
import { sessionController } from '../controllers/sessionController.js';
import { triageController } from '../controllers/triageController.js';
import { ocrController } from '../controllers/ocrController.js';
import { doctorController } from '../controllers/doctorController.js';
import { staffController } from '../controllers/staffController.js';
import { bhashiniController } from '../controllers/bhashiniController.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = express.Router();

// Apply authGuard to all API endpoints
router.use(authGuard);

// 1. Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'MediQiosk Engine Server',
    timestamp: new Date().toISOString()
  });
});

// 2. Auth & Session Routes
router.post('/auth/abha', sessionController.authenticateAbha);
router.post('/session/consent', sessionController.updateConsent);
router.get('/session/:sessionId', sessionController.getSession);
router.post('/session/clear', sessionController.clearSessionData);

// 3. Triage & Interview Routes
router.post('/triage/turn', triageController.submitTurn);
router.get('/triage/turns/:sessionId', triageController.getSessionTurns);

// 4. Document OCR Scan Routes
router.post('/ocr/scan', ocrController.processScan);
router.get('/ocr/docs/:sessionId', ocrController.getSessionDocuments);

// 5. Doctor EHR View Routes
router.get('/doctor/summary/:sessionId', doctorController.getSummary);
router.post('/doctor/accept', doctorController.acceptSummary);

// 6. Staff Emergency Dashboard Routes
router.get('/staff/dashboard', staffController.getDashboardData);
router.post('/staff/acknowledge', staffController.acknowledgeAlert);

// 7. Digital India Bhashini NMT & Speech Routes
router.post('/bhashini/translate', bhashiniController.translate);
router.post('/bhashini/asr', bhashiniController.asr);
router.post('/bhashini/tts', bhashiniController.tts);

export default router;
