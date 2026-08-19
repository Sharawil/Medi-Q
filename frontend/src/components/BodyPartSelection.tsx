import React, { useState } from 'react';

interface BodyPartSelectionProps {
  onSubmit: (selectedBodyPart: string) => void;
}

const bodyParts = [
  'Head',
  'Eyes',
  'Ear',
  'Nose',
  'Throat',
  'Chest',
  'Stomach',
  'Hand',
  'Leg',
  'Back',
  'Skin',
  'Other'
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
    } else {
      alert('Please select a body part');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Where are you experiencing the problem?
        </h3>
        <p className="text-gray-500 text-sm">
          Select the body part that best describes your issue
        </p>
      </div>

      <div className="space-y-3">
        {bodyParts.map((part, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`body-part-${index}`}
              value={part}
              checked={selectedBodyPart === part}
              onChange={(e) => {
                setSelectedBodyPart(e.target.value);
                if (part !== 'Other') {
                  setOtherBodyPart('');
                }
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label
              htmlFor={`body-part-${index}`}
              className="cursor-pointer text-gray-700 font-medium flex-1"
            >
              {part}
            </label>
            {part === 'Other' && (
              <input
                type="text"
                id="other-body-part"
                value={otherBodyPart}
                onChange={(e) => setOtherBodyPart(e.target.value)}
                placeholder="Please specify"
                className="ml-4 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={selectedBodyPart !== 'Other'}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedBodyPart || (selectedBodyPart === 'Other' && !otherBodyPart.trim())}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Symptoms
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default BodyPartSelection;