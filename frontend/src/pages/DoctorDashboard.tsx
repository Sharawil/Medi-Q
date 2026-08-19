import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiUser, FiX, FiActivity, FiClock, FiArchive, FiTrash2, FiLogOut } from 'react-icons/fi';

interface Patient {
  name: string;
  age: string;
  bloodGroup: string;
}

interface QueueToken {
  tokenNumber: string;
  patient: Patient;
  bodyPart: string;
  symptomAnswers: Record<string, any>;
  submittedAt?: string;
  completedAt?: string;
}

interface DoctorInfo {
  name: string;
  username: string;
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeQueue, setActiveQueue] = useState<QueueToken[]>([]);
  const [completedHistory, setCompletedHistory] = useState<QueueToken[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<QueueToken | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);

  const loadDoctorInfo = () => {
    try {
      const storedDoctor = localStorage.getItem('doctor_credentials');
      if (storedDoctor) {
        const doctor = JSON.parse(storedDoctor);
        setDoctorInfo({
          name: doctor.name,
          username: doctor.username
        });
      }
    } catch (err) {
      console.error('Failed to load doctor info:', err);
    }
  };

  const loadData = () => {
    try {
      const storedActive: QueueToken[] = JSON.parse(localStorage.getItem('mediq_queue_tokens') || '[]');
      const storedHistory: QueueToken[] = JSON.parse(localStorage.getItem('mediq_completed_tokens') || '[]');

      setActiveQueue(storedActive);
      setCompletedHistory(storedHistory);
      setLoading(false);
    } catch (err) {
      setError('Failed to load queue data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/doctor/login');
      return;
    }

    loadDoctorInfo();
    loadData();

    // Listen for storage updates across tabs or windows
    const handleStorage = () => {
      loadDoctorInfo();
      loadData();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctor_user');
    navigate('/doctor/login');
  };

  const handleTokenSelect = (token: QueueToken) => {
    setSelectedToken(token);
  };

  const handleCloseDetails = () => {
    setSelectedToken(null);
  };

  const handleCompleteCheckup = (tokenToComplete: QueueToken) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const completedItem: QueueToken = {
      ...tokenToComplete,
      completedAt: timestamp
    };

    const updatedActive = activeQueue.filter(item => item.tokenNumber !== tokenToComplete.tokenNumber);
    localStorage.setItem('mediq_queue_tokens', JSON.stringify(updatedActive));
    setActiveQueue(updatedActive);

    const updatedHistory = [completedItem, ...completedHistory];
    localStorage.setItem('mediq_completed_tokens', JSON.stringify(updatedHistory));
    setCompletedHistory(updatedHistory);

    setSelectedToken(null);
  };

  // Delete single item from history
  const handleDeleteHistoryItem = (tokenNumber: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updatedHistory = completedHistory.filter(item => item.tokenNumber !== tokenNumber);
    localStorage.setItem('mediq_completed_tokens', JSON.stringify(updatedHistory));
    setCompletedHistory(updatedHistory);
    if (selectedToken?.tokenNumber === tokenNumber) {
      setSelectedToken(null);
    }
  };

  // Clear all completed history
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all consultation history records?')) {
      localStorage.removeItem('mediq_completed_tokens');
      setCompletedHistory([]);
      setSelectedToken(null);
    }
  };

  const formatAnswerVal = (key: string, val: any) => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'object') {
      if (val.value !== undefined && val.unit !== undefined) {
        return `${val.value} ${val.unit}`;
      }
      return JSON.stringify(val);
    }
    return String(val);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <FiLoader className="h-10 w-10 text-red-600 animate-spin" />
        <p className="text-slate-600 font-semibold">Loading patient queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <FiAlertCircle className="h-10 w-10 text-red-600" />
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  const currentList = activeTab === 'queue' ? activeQueue : completedHistory;

  return (
    <div className="space-y-8 py-2">
      {/* Header Banner */}
      <div className="bg-white border border-red-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>Live Consultation Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Doctor Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-red-50 border border-red-200 px-4 py-2 rounded-2xl">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
              <FiUser className="h-4 w-4" />
            </div>
            <div>
              {doctorInfo ? (
                <>
                  <p className="text-sm font-black text-slate-900">Dr. {doctorInfo.name}</p>
                  <p className="text-xs font-semibold text-red-600">On Duty • {doctorInfo.username}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-black text-slate-900">Doctor</p>
                  <p className="text-xs font-semibold text-red-600">On Duty • Not Set</p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs & Queue List Container */}
      <div className="bg-white rounded-3xl border border-red-100 shadow-md overflow-hidden">

        {/* Navigation Tabs Header */}
        <div className="px-6 sm:px-8 py-4 bg-gradient-to-r from-red-50 to-white border-b border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FiActivity className="w-4 h-4" />
              Active Queue ({activeQueue.length})
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FiArchive className="w-4 h-4" />
              Consultation History ({completedHistory.length})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'history' && completedHistory.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Clear History
              </button>
            )}

            <button
              onClick={() => loadData()}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* List of Patients */}
        <div className="divide-y divide-slate-100">
          {currentList.map((token) => (
            <div
              key={token.tokenNumber}
              className="px-6 sm:px-8 py-5 cursor-pointer hover:bg-red-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              onClick={() => handleTokenSelect(token)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-md transition-transform group-hover:scale-105 ${
                  activeTab === 'queue' ? 'bg-red-600 text-white shadow-red-200' : 'bg-slate-700 text-white shadow-slate-200'
                }`}>
                  <span className="text-[10px] font-bold opacity-80">TOKEN</span>
                  <span className="text-lg leading-tight">{token.tokenNumber}</span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">{token.patient.name}</h3>
                    {token.completedAt && (
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        Completed at {token.completedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500 mt-1">
                    <span>{token.patient.age} yrs</span>
                    <span>•</span>
                    <span className="text-red-600 font-extrabold">Blood: {token.patient.bloodGroup}</span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                      Area: {token.bodyPart}
                    </span>
                    {token.submittedAt && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">Checked in {token.submittedAt}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:self-center">
                {activeTab === 'history' && (
                  <button
                    onClick={(e) => handleDeleteHistoryItem(token.tokenNumber, e)}
                    title="Delete record from history"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}

                <span className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-colors ${
                  activeTab === 'queue'
                    ? 'text-red-600 bg-red-50 border-red-200 group-hover:bg-red-600 group-hover:text-white'
                    : 'text-slate-600 bg-slate-100 border-slate-200 group-hover:bg-slate-800 group-hover:text-white'
                }`}>
                  {activeTab === 'queue' ? 'Inspect Symptoms →' : 'View Summary'}
                </span>
              </div>
            </div>
          ))}

          {currentList.length === 0 && (
            <div className="px-6 py-16 text-center space-y-3">
              <FiCheckCircle className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">
                {activeTab === 'queue' ? 'No patients in queue' : 'No completed consultations yet'}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {activeTab === 'queue'
                  ? 'Only real patients who check in will appear here. No dummy data.'
                  : 'Completed patient checkups will move here.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-red-100">
            {/* Modal Sticky Header */}
            <div className="p-6 border-b border-red-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-3">
                <div className="px-3.5 py-1.5 bg-red-600 text-white font-black text-sm rounded-xl">
                  #{selectedToken.tokenNumber}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedToken.patient.name}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">Pre-Consultation Overview</p>
                </div>
              </div>
              <button onClick={handleCloseDetails} className="text-slate-500 hover:text-red-600 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Patient Basic Profile */}
              <div className="grid grid-cols-3 gap-4 bg-red-50/60 border border-red-100 p-4 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Age</p>
                  <p className="text-base font-black text-slate-900">{selectedToken.patient.age} yrs</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Blood Group</p>
                  <p className="text-base font-black text-red-600">{selectedToken.patient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Affected Area</p>
                  <p className="text-base font-black text-slate-900">{selectedToken.bodyPart}</p>
                </div>
              </div>

              {/* Symptom Answers */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center">
                  <FiActivity className="w-5 h-5 mr-2 text-red-600" />
                  Pre-Consultation Symptom Responses
                </h3>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  {Object.entries(selectedToken.symptomAnswers || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                      <span className="font-semibold text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/\./g, ' ')}
                      </span>
                      <span className="font-bold text-red-600 capitalize">
                        {formatAnswerVal(key, val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer with Actions */}
            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50 rounded-b-3xl">
              <button onClick={handleCloseDetails} className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors">
                Close Window
              </button>

              {activeTab === 'queue' ? (
                <button onClick={() => handleCompleteCheckup(selectedToken)} className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>Checkup Complete (Move to History)</span>
                </button>
              ) : (
                <button onClick={() => handleDeleteHistoryItem(selectedToken.tokenNumber)} className="w-full sm:w-auto px-6 py-2.5 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2">
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Record from History</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;