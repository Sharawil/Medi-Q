import React, { useState } from 'react';
import { 
  FiActivity, 
  FiEye, FiVolume2, FiWind, FiHeart, 
  FiUserCheck, FiShield, FiHelpCircle, FiCheck, FiArrowRight, FiMic, FiDisc, FiLayers, FiSun
} from 'react-icons/fi';
import { 
  GiBrain, GiStomach, GiLeg, GiArm
} from 'react-icons/gi';

interface BodyPartSelectionProps {
  onSubmit: (selectedBodyPart: string) => void;
}

interface BodyPartOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

const bodyPartCards: BodyPartOption[] = [
  { id: 'Head', name: 'Head', desc: 'Headache, Migraine, Dizziness', icon: <GiBrain className="w-8 h-8" /> },
  { id: 'Eyes', name: 'Eyes', desc: 'Vision issue, Redness, Pain', icon: <FiEye className="w-8 h-8" /> },
  { id: 'Ear', name: 'Ear', desc: 'Hearing loss, Pain, Discharge', icon: <FiVolume2 className="w-8 h-8" /> },
  { id: 'Nose', name: 'Nose', desc: 'Congestion, Bleeding, Sinus', icon: <FiWind className="w-8 h-8" /> },
  { id: 'Throat', name: 'Throat', desc: 'Cough, Sore throat, Swallowing', icon: <FiMic className="w-8 h-8" /> },
  { id: 'Chest', name: 'Chest', desc: 'Chest pain, Breathing, Palpitation', icon: <FiHeart className="w-8 h-8" /> },
  { id: 'Stomach', name: 'Stomach', desc: 'Abdominal pain, Nausea, Acidity', icon: <GiStomach className="w-8 h-8" /> },
  { id: 'Hand', name: 'Hand / Arm', desc: 'Joint pain, Numbness, Fracture', icon: <GiArm className="w-8 h-8" /> },
  { id: 'Leg', name: 'Leg / Foot', desc: 'Swelling, Sprain, Walking issue', icon: <GiLeg className="w-8 h-8" /> },
  { id: 'Back', name: 'Back & Spine', desc: 'Lower back, Stiffness, Nerve pain', icon: <FiLayers className="w-8 h-8" /> },
  { id: 'Skin', name: 'Skin', desc: 'Rash, Allergy, Burn, Lesions', icon: <FiSun className="w-8 h-8" /> },
  { id: 'Other', name: 'Other Area', desc: 'General weakness, Fever, Unsure', icon: <FiHelpCircle className="w-8 h-8" /> },
];

const BodyPartSelection: React.FC<BodyPartSelectionProps> = ({ onSubmit }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [otherBodyPart, setOtherBodyPart] = useState<string>('');

  const handleSubmit = () => {
    let finalSelection = selectedBodyPart;
    if (selectedBodyPart === 'Other' && otherBodyPart.trim()) {
      finalSelection = otherBodyPart.trim();
    }

    if (finalSelection) {
      onSubmit(finalSelection);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Where is the problem located?
        </h3>
        <p className="text-slate-600 text-sm">
          Tap the visual card that best matches your affected area.
        </p>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {bodyPartCards.map((part) => {
          const isSelected = selectedBodyPart === part.id;
          return (
            <div
              key={part.id}
              onClick={() => {
                setSelectedBodyPart(part.id);
                if (part.id !== 'Other') {
                  setOtherBodyPart('');
                }
              }}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all transform hover:-translate-y-1 flex flex-col justify-between items-center text-center space-y-3 ${
                isSelected
                  ? 'border-red-600 bg-red-50/80 shadow-lg shadow-red-200 ring-2 ring-red-500/20'
                  : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'
              }`}
            >
              {/* Checkmark Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Icon Container */}
              <div className={`p-3.5 rounded-2xl transition-colors ${
                isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-red-50 text-red-600'
              }`}>
                {part.icon}
              </div>

              {/* Text Information */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{part.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{part.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Other Specification Input */}
      {selectedBodyPart === 'Other' && (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2">
          <label htmlFor="other-body-part" className="block text-sm font-bold text-red-900">
            Please specify your problem area:
          </label>
          <input
            type="text"
            id="other-body-part"
            value={otherBodyPart}
            onChange={(e) => setOtherBodyPart(e.target.value)}
            placeholder="e.g. Toothache, Whole body, Fatigue..."
            className="w-full px-4 py-3 bg-white text-slate-900 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
        </div>
      )}

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedBodyPart || (selectedBodyPart === 'Other' && !otherBodyPart.trim())}
          className="px-8 py-3.5 bg-red-600 text-white font-extrabold rounded-xl hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all flex items-center gap-2"
        >
          Continue to Symptoms
          <FiArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default BodyPartSelection;