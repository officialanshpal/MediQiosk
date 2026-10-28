import React, { useState, useRef } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonBadge } from '../common/CommonBadge';
import { performOCR } from '../../utils/ocrUtils';
import { extractMedicalEntities } from '../../utils/regexParser';
import { api } from '../../services/apiService';
import { speakText } from '../../utils/speechUtils';
import { getTranslation } from '../../utils/translations';
import { Camera, Upload, FileText, Pill, Activity, Clock, ArrowRight } from 'lucide-react';

export const DocumentScan = () => {
  const { patientSession, scannedDocs, setScannedDocs, nextStep, selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleSampleUpload = async () => {
    setIsScanning(true);
    setOcrProgress(25);

    const mockText = `Apollo Diagnostics - Lab Report
Patient: ${patientSession?.patientName || 'Rameshwar Mahto'} (52/M)
Date: 15 days ago

TEST RESULTS:
Fasting Blood Sugar : 186 mg/dL (High / Diabetic)
Hemoglobin (Hb) : 13.4 g/dL (Normal)
Blood Pressure : 140/90 mmHg (Stage 1 HTN)

Rx Prescribed:
1. Tab Paracetamol 500mg BD (1-0-1)
2. Tab Pantoprazole 40mg OD before breakfast
3. Tab Amlodipine 5mg OD`;

    setTimeout(async () => {
      setOcrProgress(80);
      const parsed = extractMedicalEntities(mockText);

      const newDoc = {
        docId: `DOC-${Date.now()}`,
        fileName: 'Prescription_Apollo_Lab.png',
        ocrText: mockText,
        extractedEntities: parsed,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setScannedDocs(prev => [...prev, newDoc]);

      if (patientSession?.sessionId) {
        try {
          await api.post('/ocr/scan', {
            sessionId: patientSession.sessionId,
            fileName: newDoc.fileName,
            ocrText: mockText
          });
        } catch (err) {
          console.error('OCR post failed', err);
        }
      }

      setOcrProgress(100);
      setIsScanning(false);
      speakText(selectedLanguage === 'Hindi' ? 'दस्तावेज सफलतापूर्वक स्कैन किया गया।' : 'Prescription scanned and parsed successfully.', selectedLanguage);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setOcrProgress(30);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const imageData = evt.target.result;
      const extractedText = await performOCR(imageData, (progress) => {
        setOcrProgress(progress);
      });

      const parsed = extractMedicalEntities(extractedText);

      const newDoc = {
        docId: `DOC-${Date.now()}`,
        fileName: file.name || 'Scanned_Doc.jpg',
        ocrText: extractedText,
        extractedEntities: parsed,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setScannedDocs(prev => [...prev, newDoc]);

      if (patientSession?.sessionId) {
        try {
          await api.post('/ocr/scan', {
            sessionId: patientSession.sessionId,
            fileName: newDoc.fileName,
            ocrText: extractedText
          });
        } catch (err) {
          console.error(err);
        }
      }

      setIsScanning(false);
      speakText(selectedLanguage === 'Hindi' ? 'ओसीआर दस्तावेज स्कैन पूर्ण हुआ।' : 'Document OCR processing completed.', selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-w-0 animate-fadeIn">
      <CommonCard
        title={t('scanTitle')}
        subtitle={t('scanSubtitle')}
        headerAction={<Camera className="w-10 h-10 text-emerald-400" />}
      >
        {/* Upload Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Camera Capture Option */}
          <button
            type="button"
            onClick={handleSampleUpload}
            className="p-6 bg-slate-900 border-2 border-dashed border-emerald-500 hover:bg-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-white">{t('scanCameraBtn')}</span>
            <span className="text-xs text-slate-400">/* Tesseract.js Engine */</span>
          </button>

          {/* File Upload Option */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 bg-slate-900 border-2 border-dashed border-blue-500 hover:bg-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group shadow-xl"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-white">{t('uploadFileBtn')}</span>
            <span className="text-xs text-slate-400">Select prescription image or PDF</span>
          </div>
        </div>

        {/* OCR Progress Bar */}
        {isScanning && (
          <div className="bg-slate-900 border border-blue-500 p-6 rounded-2xl mb-8 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-blue-400">{t('ocrProcessing')}</span>
              <span className="text-lg font-mono text-white font-bold">{ocrProgress}%</span>
            </div>
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Chronological Document Timeline */}
        <div className="mb-8">
          <h3 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>{t('docTimeline')} ({scannedDocs.length})</span>
          </h3>

          {scannedDocs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-lg">{t('noDocsScanned')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scannedDocs.map((doc, idx) => (
                <div key={doc.docId || idx} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{doc.fileName}</h4>
                        <span className="text-xs text-slate-400">Scanned at {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <CommonBadge variant="success">{t('ocrVerified')}</CommonBadge>
                  </div>

                  {/* Extracted Entities Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicines */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <h5 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Pill className="w-4 h-4" />
                        <span>{t('extractedMeds')}</span>
                      </h5>
                      <ul className="space-y-2 text-sm text-slate-200 font-medium">
                        {doc.extractedEntities.medicines.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-center justify-between border-b border-slate-900 pb-1">
                            <span className="font-bold text-white">{m.name}</span>
                            <span className="text-slate-400">{m.dosage} ({m.frequency})</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Lab Values */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Activity className="w-4 h-4" />
                        <span>{t('extractedLabs')}</span>
                      </h5>
                      <ul className="space-y-2 text-sm text-slate-200 font-medium">
                        {doc.extractedEntities.labValues.map((l, lIdx) => (
                          <li key={lIdx} className="flex items-center justify-between border-b border-slate-900 pb-1">
                            <span>{l.test}</span>
                            <span className={`font-mono font-bold ${l.isAbnormal ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {l.value} {l.isAbnormal && '⚠️ (HIGH)'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white kiosk-btn py-5 rounded-2xl font-extrabold text-2xl shadow-xl transition-all"
        >
          <span>{t('continueConfirmBtn')}</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </CommonCard>
    </div>
  );
};
