import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { CommonCard } from '../common/CommonCard';
import { CommonTable } from '../common/CommonTable';
import { CommonBadge } from '../common/CommonBadge';
import { CommonAlert } from '../common/CommonAlert';
import { api } from '../../services/apiService';
import { getTranslation } from '../../utils/translations';
import { RefreshCw, CheckCircle, Users, BellRing, Clock } from 'lucide-react';

export const StaffDashboard = () => {
  const { selectedLanguage } = useKiosk();
  const t = (key) => getTranslation(selectedLanguage, key);

  const [dashboardData, setDashboardData] = useState({
    queueCount: 0,
    urgentAlerts: [],
    allRedFlags: [],
    sessions: []
  });

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/staff/dashboard');
      setDashboardData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledge = async (eventId) => {
    try {
      await api.post('/staff/acknowledge', { eventId, staffName: 'Duty Nurse Station 1' });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      header: t('tokenCol'),
      accessor: 'sessionId',
      render: (row) => (
        <span className="font-mono font-bold text-blue-400">{row.sessionId}</span>
      )
    },
    {
      header: t('nameCol'),
      accessor: 'patientName',
      render: (row) => (
        <div>
          <span className="font-bold text-white block">{row.patientName}</span>
          <span className="text-xs text-slate-400">{row.age} yrs, {row.gender}</span>
        </div>
      )
    },
    {
      header: t('triageCol'),
      accessor: 'triageTier',
      render: (row) => {
        const isRed = row.triageTier?.includes('RED');
        const isYellow = row.triageTier?.includes('YELLOW');
        return (
          <CommonBadge variant={isRed ? 'danger' : isYellow ? 'warning' : 'success'}>
            {row.triageTier}
          </CommonBadge>
        );
      }
    },
    {
      header: t('roomCol'),
      accessor: 'roomNumber'
    },
    {
      header: t('waitCol'),
      accessor: 'estimatedWait',
      render: (row) => (
        <span className="font-bold text-emerald-400 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {row.estimatedWait}
        </span>
      )
    },
    {
      header: t('statusCol'),
      accessor: 'status',
      render: (row) => (
        <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          {row.status}
        </span>
      )
    }
  ];

  const metrics = [
    {
      label: 'Queue Load',
      value: dashboardData.queueCount || 0,
      detail: 'Patients waiting',
      tone: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
    },
    {
      label: 'Urgent Cases',
      value: dashboardData.urgentAlerts?.length || 0,
      detail: 'Requires immediate attention',
      tone: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    },
    {
      label: 'Avg Wait',
      value: dashboardData.sessions?.length ? '14 min' : '0 min',
      detail: 'Current OPD estimate',
      tone: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      <CommonCard
        title={t('staffTitle')}
        subtitle={t('staffSubtitle')}
        headerAction={
          <button
            onClick={fetchDashboard}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 flex items-center gap-2 font-bold text-sm"
          >
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t('liveSyncBtn')}</span>
          </button>
        }
      >
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className={`rounded-2xl border p-4 ${metric.tone}`}>
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">{metric.label}</p>
              <p className="mt-3 text-3xl font-black text-white">{metric.value}</p>
              <p className="mt-1 text-sm opacity-80">{metric.detail}</p>
            </div>
          ))}
        </div>

        {dashboardData.urgentAlerts && dashboardData.urgentAlerts.length > 0 ? (
          <div className="mb-8 space-y-4">
            <h3 className="text-2xl font-black text-rose-400 flex items-center gap-2">
              <BellRing className="w-7 h-7 animate-bounce" />
              <span>{t('urgentRedFlags')} ({dashboardData.urgentAlerts.length})</span>
            </h3>

            {dashboardData.urgentAlerts.map((flag) => (
              <CommonAlert
                key={flag.eventId}
                variant="danger"
                title={`HIGH PRIORITY ALERT: ${flag.patientName} (${flag.sessionId})`}
                action={
                  <button
                    onClick={() => handleAcknowledge(flag.eventId)}
                    className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shrink-0 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{t('ackAlertBtn')}</span>
                  </button>
                }
              >
                <div className="space-y-1">
                  <p className="font-bold text-white text-lg">{flag.triggerRule}</p>
                  <p className="text-xs font-mono text-slate-300">Triggered at {new Date(flag.timestamp).toLocaleTimeString()}</p>
                </div>
              </CommonAlert>
            ))}
          </div>
        ) : (
          <div className="bg-emerald-950/60 border border-emerald-700/80 rounded-2xl p-4 mb-8 flex items-center justify-between text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="font-bold">{t('noRedFlags')}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time scanner active</span>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span>{t('activeQueueTitle')} ({dashboardData.queueCount})</span>
            </h3>
          </div>

          <CommonTable
            columns={columns}
            data={dashboardData.sessions}
            emptyMessage="No active OPD kiosk sessions registered yet."
          />
        </div>
      </CommonCard>
    </div>
  );
};
