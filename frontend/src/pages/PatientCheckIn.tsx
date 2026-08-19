import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiActivity, FiTag, FiFileText } from 'react-icons/fi';
import PatientForm from '../components/PatientForm';
import BodyPartSelection from '../components/BodyPartSelection';
import SymptomQuestionnaire from '../components/SymptomQuestionnaire';

interface QueueToken {
  tokenNumber: string;
}

interface PatientCheckInProps {}

const PatientCheckIn: React.FC<PatientCheckInProps> = () => {
  const [step, setStep] = useState(1); // 1: patient info, 2: token, 3: body part, 4: symptoms, 5: review, 6: complete
  const [patientData, setPatientData] = useState<any>(null);
  const [queueToken, setQueueToken] = useState<QueueToken | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [symptomAnswers, setSymptomAnswers] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePatientSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setPatientData(data);
      
      // Generate sequential queue token numberwise (P-01, P-02, P-03...)
      const currentCount = parseInt(localStorage.getItem('mediq_token_counter') || '0', 10);
      const nextCount = currentCount + 1;
      const formattedNum = nextCount.toString().padStart(2, '0');
      const token = `P-${formattedNum}`;
      
      // Save counter
      localStorage.setItem('mediq_token_counter', nextCount.toString());
      setQueueToken({ tokenNumber: token });
      
      setStep(2); // Show token
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save patient data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBodyPartSubmit = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setStep(4); // Symptoms
  };

  const handleSymptomSubmit = (answers: any) => {
    setSymptomAnswers(answers);
    setStep(5); // Final review
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const newSubmission = {
        tokenNumber: queueToken?.tokenNumber || 'P-01',
        patient: {
          name: patientData?.name || 'Patient',
          age: patientData?.age || '30',
          bloodGroup: patientData?.bloodGroup || 'O+'
        },
        bodyPart: selectedBodyPart || 'General',
        symptomAnswers: symptomAnswers || {},
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Persist to localStorage for Doctor Dashboard live access
      const existingQueue = JSON.parse(localStorage.getItem('mediq_queue_tokens') || '[]');
      const filteredQueue = existingQueue.filter((item: any) => item.tokenNumber !== newSubmission.tokenNumber);
      localStorage.setItem('mediq_queue_tokens', JSON.stringify([...filteredQueue, newSubmission]));

      await new Promise(resolve => setTimeout(resolve, 500));
      setStep(6); // Completion
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PatientForm
            onSubmit={handlePatientSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case 2:
        return (
          <div className="space-y-8 text-center py-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 text-red-700 font-extrabold text-sm border border-red-200">
              <FiCheckCircle className="w-5 h-5 text-red-600" />
              <span>Token Generated Successfully</span>
            </div>

            {queueToken && (
              <div className="bg-gradient-to-b from-red-50/50 to-white border-2 border-red-200 rounded-3xl p-8 max-w-md mx-auto shadow-lg shadow-red-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Live Queue Token</p>
                <p className="text-6xl font-black text-red-600 tracking-tight my-4">
                  #{queueToken.tokenNumber}
                </p>
                <p className="text-sm font-medium text-slate-600">
                  Please keep this token visible. The doctor will call your number next.
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-red-600 text-white font-extrabold rounded-xl hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-200 transition-all flex items-center gap-2"
              >
                Continue to Symptom Assessment
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <BodyPartSelection
            onSubmit={handleBodyPartSubmit}
          />
        );
      case 4:
        return (
          <SymptomQuestionnaire
            affectedAreas={selectedBodyPart ? [{ bodyPart: selectedBodyPart.toLowerCase().replace(' ', '_'), severity: 5 }] : []}
            onSubmit={handleSymptomSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case 5:
        return (
          <div className="space-y-8 text-center py-2">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 text-red-700 font-extrabold text-sm border border-red-200">
              <FiFileText className="w-5 h-5 text-red-600" />
              <span>Final Check-In Review</span>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto text-left space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Patient Name</p>
                  <p className="text-base font-extrabold text-slate-900">{patientData?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Age</p>
                  <p className="text-base font-extrabold text-slate-900">{patientData?.age} yrs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Blood Group</p>
                  <p className="text-base font-extrabold text-red-600">{patientData?.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Queue Token</p>
                  <p className="text-base font-extrabold text-red-600">#{queueToken?.tokenNumber}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Selected Body Part</p>
                <p className="text-base font-extrabold text-slate-900">{selectedBodyPart}</p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-10 py-4 bg-red-600 text-white font-black text-lg rounded-2xl hover:bg-red-700 active:bg-red-800 disabled:opacity-50 shadow-xl shadow-red-200 transition-all flex items-center gap-3"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Join Queue'}
                <FiArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 text-center py-8">
            <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-200">
              <FiCheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h2 className="text-3xl font-black text-slate-900">Check-In Completed!</h2>
              <p className="text-slate-600">
                Your symptom summary has been transmitted to the doctor's queue screen.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm space-y-2">
              <p className="text-xs font-bold uppercase text-slate-500">Your Assigned Token</p>
              <p className="text-5xl font-black text-red-600">#{queueToken?.tokenNumber}</p>
              <p className="text-xs text-slate-500 pt-2">Please take a seat in the waiting hall.</p>
            </div>
          </div>
        );
      default:
        return <div>Loading...</div>;
    }
  };

  const stepsList = [
    { num: 1, label: 'Info' },
    { num: 2, label: 'Token' },
    { num: 3, label: 'Area' },
    { num: 4, label: 'Symptoms' },
    { num: 5, label: 'Review' },
    { num: 6, label: 'Done' }
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Patient <span className="text-red-600">Check-In</span>
        </h1>
        <p className="text-slate-600 text-sm">
          Complete basic information to generate your queue token and enter doctor consultation.
        </p>
      </div>

      {/* Progress Steps Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-red-100 shadow-sm">
        <div className="flex items-center justify-between">
          {stepsList.map((st) => {
            const isDone = st.num < step;
            const isCurrent = st.num === step;
            return (
              <React.Fragment key={st.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-all ${
                    isDone
                      ? 'bg-red-600 border-red-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-white border-red-600 text-red-600 ring-4 ring-red-100'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {isDone ? <FiCheckCircle className="w-5 h-5 stroke-[2.5]" /> : st.num}
                  </div>
                  <span className={`mt-1.5 text-xs font-extrabold hidden sm:block ${
                    isCurrent ? 'text-red-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
                {st.num < 6 && (
                  <div className={`flex-1 h-1 mx-1.5 sm:mx-3 rounded-full transition-colors ${
                    st.num < step ? 'bg-red-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Current Step Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-red-100/40 border border-red-100 p-6 sm:p-10">
        {renderStepContent()}
      </div>

      {/* Back button */}
      {step > 1 && step < 6 && step !== 2 && (
        <div className="flex justify-start">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <FiArrowLeft className="w-4 h-4" />
            Previous Step
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientCheckIn;