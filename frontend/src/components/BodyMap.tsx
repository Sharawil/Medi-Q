import React, { useState } from 'react';
import { FiCheck, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';

interface BodyMapProps {
  onSubmit: (areas: Array<{bodyPart: string; severity: number; description?: string}>) => void;
  affectedAreas: Array<{bodyPart: string; severity: number; description?: string}>;
}

// Body parts with their positions on the SVG (percentage-based for responsiveness)
const bodyParts = [
  // Head
  { id: 'head', name: 'Head', x: 50, y: 8, radius: 12 },
  { id: 'neck', name: 'Neck', x: 50, y: 22, radius: 8 },

  // Upper body - Front
  { id: 'chest', name: 'Chest', x: 50, y: 32, radius: 15 },
  { id: 'left_shoulder', name: 'Left Shoulder', x: 25, y: 28, radius: 10 },
  { id: 'right_shoulder', name: 'Right Shoulder', x: 75, y: 28, radius: 10 },
  { id: 'left_upper_arm', name: 'Left Upper Arm', x: 15, y: 38, radius: 8 },
  { id: 'right_upper_arm', name: 'Right Upper Arm', x: 85, y: 38, radius: 8 },
  { id: 'left_elbow', name: 'Left Elbow', x: 12, y: 48, radius: 6 },
  { id: 'right_elbow', name: 'Right Elbow', x: 88, y: 48, radius: 6 },
  { id: 'left_forearm', name: 'Left Forearm', x: 10, y: 58, radius: 6 },
  { id: 'right_forearm', name: 'Right Forearm', x: 90, y: 58, radius: 6 },
  { id: 'left_wrist', name: 'Left Wrist', x: 8, y: 68, radius: 5 },
  { id: 'right_wrist', name: 'Right Wrist', x: 92, y: 68, radius: 5 },
  { id: 'left_hand', name: 'Left Hand', x: 5, y: 75, radius: 6 },
  { id: 'right_hand', name: 'Right Hand', x: 95, y: 75, radius: 6 },

  // Abdomen
  { id: 'abdomen', name: 'Abdomen', x: 50, y: 48, radius: 14 },
  { id: 'left_hip', name: 'Left Hip', x: 30, y: 58, radius: 10 },
  { id: 'right_hip', name: 'Right Hip', x: 70, y: 58, radius: 10 },

  // Legs
  { id: 'left_thigh', name: 'Left Thigh', x: 32, y: 65, radius: 10 },
  { id: 'right_thigh', name: 'Right Thigh', x: 68, y: 65, radius: 10 },
  { id: 'left_knee', name: 'Left Knee', x: 32, y: 76, radius: 8 },
  { id: 'right_knee', name: 'Right Knee', x: 68, y: 76, radius: 8 },
  { id: 'left_calf', name: 'Left Calf', x: 32, y: 84, radius: 8 },
  { id: 'right_calf', name: 'Right Calf', x: 68, y: 84, radius: 8 },
  { id: 'left_ankle', name: 'Left Ankle', x: 32, y: 92, radius: 6 },
  { id: 'right_ankle', name: 'Right Ankle', x: 68, y: 92, radius: 6 },
  { id: 'left_foot', name: 'Left Foot', x: 32, y: 97, radius: 6 },
  { id: 'right_foot', name: 'Right Foot', x: 68, y: 97, radius: 6 },

  // Back (these would be on a back view)
  { id: 'upper_back', name: 'Upper Back', x: 50, y: 32, radius: 15, back: true },
  { id: 'lower_back', name: 'Lower Back', x: 50, y: 50, radius: 14, back: true },
];

const BodyMap: React.FC<BodyMapProps> = ({ onSubmit, affectedAreas }) => {
  const [selectedAreas, setSelectedAreas] = useState<Array<{bodyPart: string; severity: number; description?: string}>>(
    affectedAreas || []
  );
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [currentBodyPart, setCurrentBodyPart] = useState<string | null>(null);

  const handleBodyPartClick = (bodyPartId: string) => {
    const existingIndex = selectedAreas.findIndex(a => a.bodyPart === bodyPartId);

    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedAreas(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add new selection with default severity
      setCurrentBodyPart(bodyPartId);
      setShowSeverityModal(true);
    }
  };

  const handleSeverityConfirm = (severity: number, description?: string) => {
    if (currentBodyPart) {
      setSelectedAreas(prev => [
        ...prev,
        { bodyPart: currentBodyPart, severity, description }
      ]);
    }
    setShowSeverityModal(false);
    setCurrentBodyPart(null);
  };

  const isSelected = (bodyPartId: string) => {
    return selectedAreas.some(a => a.bodyPart === bodyPartId);
  };

  const getSeverity = (bodyPartId: string) => {
    const area = selectedAreas.find(a => a.bodyPart === bodyPartId);
    return area?.severity || 0;
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return '#ef4444'; // red
    if (severity >= 5) return '#f59e0b'; // amber
    return '#3b82f6'; // blue
  };

  const handleSubmit = () => {
    if (selectedAreas.length === 0) {
      alert('Please select at least one affected area');
      return;
    }
    onSubmit(selectedAreas);
  };

  // Only show front view body parts
  const frontBodyParts = bodyParts.filter(p => !p.back);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Affected Areas</h3>
        <p className="text-gray-500 text-sm">Click on the body parts where you're experiencing symptoms</p>
      </div>

      {/* Body Map SVG */}
      <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full max-w-md mx-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Body outline - simplified human figure */}
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Head */}
          <ellipse
            cx="50"
            cy="8"
            rx="12"
            ry="10"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Neck */}
          <rect
            x="42"
            y="18"
            width="16"
            height="6"
            rx="2"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Torso */}
          <path
            d="M 25 24 Q 20 35 22 55 Q 24 65 35 65 Q 40 65 42 60 Q 45 55 45 50 Q 45 40 50 35 Q 55 40 55 50 Q 58 55 60 60 Q 63 65 75 65 Q 86 65 88 55 Q 90 35 85 24 Q 80 22 75 22 Q 70 22 65 24 Q 58 24 50 24 Q 42 24 35 22 Q 30 22 25 24 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Arms - Left */}
          <path
            d="M 25 28 Q 15 35 12 48 Q 10 58 8 68 Q 6 75 10 78 Q 12 78 12 68 Q 14 58 16 48 Q 20 35 25 28 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Arms - Right */}
          <path
            d="M 75 28 Q 85 35 88 48 Q 90 58 92 68 Q 94 75 90 78 Q 88 78 88 68 Q 86 58 84 48 Q 80 35 75 28 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Legs - Left */}
          <path
            d="M 35 65 Q 32 72 32 84 Q 30 92 35 95 Q 38 95 38 92 Q 36 84 38 72 Q 40 65 35 65 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Legs - Right */}
          <path
            d="M 65 65 Q 68 72 68 84 Q 70 92 65 95 Q 62 95 62 92 Q 64 84 62 72 Q 60 65 65 65 Z"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            filter="url(#shadow)"
          />

          {/* Interactive body part circles - front view */}
          {frontBodyParts.map((part) => (
            <g key={part.id}>
              <circle
                cx={part.x}
                cy={part.y}
                r={part.radius}
                fill={isSelected(part.id) ? getSeverityColor(getSeverity(part.id)) : 'transparent'}
                stroke={isSelected(part.id) ? getSeverityColor(getSeverity(part.id)) : '#94a3b8'}
                strokeWidth={isSelected(part.id) ? 3 : 2}
                strokeDasharray={isSelected(part.id) ? 'none' : '4 4'}
                onClick={() => handleBodyPartClick(part.id)}
                className="cursor-pointer transition-all duration-200 hover:stroke-indigo-600"
                style={{ filter: isSelected(part.id) ? 'drop-shadow(0 0 4px currentColor)' : 'none' }}
              />
              {isSelected(part.id) && (
                <text
                  x={part.x}
                  y={part.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {getSeverity(part.id)}
                </text>
              )}
            </g>
          ))}

          {/* Labels for selected areas */}
          {frontBodyParts
            .filter(part => isSelected(part.id))
            .map((part) => (
              <text
                key={`label-${part.id}`}
                x={part.x}
                y={part.y - part.radius - 4}
                textAnchor="middle"
                fill="#1e293b"
                fontSize="7"
                fontWeight="500"
                pointerEvents="none"
              >
                {part.name}
              </text>
            ))}
        </svg>
      </div>

      {/* Selected Areas List */}
      {selectedAreas.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Selected Areas ({selectedAreas.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedAreas.map((area, index) => {
              const partInfo = bodyParts.find(p => p.id === area.bodyPart);
              const severityColor = getSeverityColor(area.severity);
              return (
                <div
                  key={`${area.bodyPart}-${index}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full border-2"
                      style={{ borderColor: severityColor, backgroundColor: severityColor }}
                    />
                    <span className="text-sm font-medium text-gray-900">{partInfo?.name || area.bodyPart}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${severityColor}20`, color: severityColor }}
                    >
                      Severity: {area.severity}/10
                    </span>
                    <button
                      onClick={() => handleBodyPartClick(area.bodyPart)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Severity Modal */}
      {showSeverityModal && currentBodyPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {bodyParts.find(p => p.id === currentBodyPart)?.name} - Severity
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              How severe is the discomfort in this area? (1 = Mild, 10 = Severe)
            </p>

            <div className="flex justify-center gap-1 mb-4" role="radiogroup" aria-label="Severity level">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                <button
                  key={level}
                  onClick={() => handleSeverityConfirm(level)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    level <= 3
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : level <= 6
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  role="radio"
                  aria-checked="false"
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Sharp pain when moving, dull ache at rest..."
                onChange={(e) => {
                  // Store description temporarily
                  if (currentBodyPart) {
                    // We'll include this in handleSeverityConfirm
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSeverityModal(false); setCurrentBodyPart(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const description = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                  handleSeverityConfirm(5, description || undefined); // Default to 5 if not selected
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedAreas.length === 0}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Symptoms
          <FiArrowRight className="inline ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default BodyMap;