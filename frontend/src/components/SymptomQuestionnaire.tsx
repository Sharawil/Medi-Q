import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiArrowLeft, FiAlertCircle, FiCheck, FiCheckCircle } from 'react-icons/fi';

interface SymptomQuestionnaireProps {
  affectedAreas: Array<{bodyPart: string; severity: number; description?: string}>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  error: string | null;
}

const SymptomQuestionnaire: React.FC<SymptomQuestionnaireProps> = ({
  affectedAreas,
  onSubmit,
  isSubmitting,
  error
}) => {
  const bodyPart = affectedAreas[0]?.bodyPart || '';

  const getQuestionsForBodyPart = (part: string) => {
    const questions: Array<{
      id: string;
      label: string;
      type: 'select' | 'radio' | 'checkbox' | 'number' | 'text' | 'textarea' | 'duration';
      required: boolean;
      options?: Array<{ value: string; label: string }>;
      min?: number;
      max?: number;
      step?: number;
      dependsOn?: { field: string; value: any };
    }> = [];

    questions.push(
      {
        id: 'primarySymptom',
        label: 'What is your primary symptom?',
        type: 'select',
        required: true,
        options: [
          { value: 'pain', label: 'Pain' },
          { value: 'discomfort', label: 'Discomfort' },
          { value: 'numbness', label: 'Numbness / Tingling' },
          { value: 'swelling', label: 'Swelling' },
          { value: 'stiffness', label: 'Stiffness' },
          { value: 'weakness', label: 'Weakness' },
          { value: 'other', label: 'Other' },
        ]
      },
      {
        id: 'symptomDuration',
        label: 'How long have you had this symptom?',
        type: 'duration',
        required: true,
      },
      {
        id: 'symptomFrequency',
        label: 'How often do you experience this symptom?',
        type: 'radio',
        required: true,
        options: [
          { value: 'constant', label: 'Constant' },
          { value: 'frequent', label: 'Frequent (multiple times / day)' },
          { value: 'occasional', label: 'Occasional (once per day)' },
          { value: 'rare', label: 'Rare (less than once per day)' },
        ]
      },
      {
        id: 'painLevel',
        label: 'On a scale of 0-10, how severe is your pain/discomfort?',
        type: 'number',
        required: true,
        min: 0,
        max: 10,
        step: 1,
      }
    );

    switch (part) {
      case 'head':
        questions.push(
          {
            id: 'headache',
            label: 'Are you experiencing headaches?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          },
          {
            id: 'dizziness',
            label: 'Are you experiencing dizziness or vertigo?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          }
        );
        break;
      case 'chest':
        questions.push(
          {
            id: 'chestPain',
            label: 'Are you experiencing chest pain or discomfort?',
            type: 'radio',
            required: true,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          },
          {
            id: 'shortnessOfBreath',
            label: 'Are you experiencing shortness of breath?',
            type: 'radio',
            required: true,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          }
        );
        break;
      case 'abdomen':
      case 'stomach':
        questions.push(
          {
            id: 'nausea',
            label: 'Are you experiencing nausea?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          },
          {
            id: 'vomiting',
            label: 'Have you been vomiting?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          }
        );
        break;
      case 'upper_back':
      case 'back':
        questions.push(
          {
            id: 'backPain',
            label: 'Are you experiencing back pain?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          },
          {
            id: 'numbnessTingling',
            label: 'Are you experiencing numbness or tingling in your legs?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          }
        );
        break;
      default:
        questions.push(
          {
            id: 'numbnessTingling',
            label: 'Are you experiencing numbness or tingling?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          },
          {
            id: 'swelling',
            label: 'Are you experiencing swelling?',
            type: 'radio',
            required: false,
            options: [
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]
          }
        );
        break;
    }

    questions.push(
      {
        id: 'fever',
        label: 'Do you have a fever?',
        type: 'radio',
        required: false,
        options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ]
      },
      {
        id: 'feverTemperature',
        label: 'If yes, what is your temperature? (°F)',
        type: 'number',
        required: false,
        min: 95,
        max: 105,
        step: 0.1,
        dependsOn: { field: 'fever', value: 'true' }
      },
      {
        id: 'fatigue',
        label: 'Are you experiencing unusual fatigue?',
        type: 'radio',
        required: false,
        options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ]
      }
    );

    questions.push({
      id: 'description',
      label: 'Additional details about your symptoms',
      type: 'textarea',
      required: false,
    });

    return questions;
  };

  const questions = getQuestionsForBodyPart(bodyPart);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    symptomDuration: { value: 1, unit: 'days' }
  });
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const isQuestionVisible = (question: typeof currentQuestion) => {
    if (!question.dependsOn) return true;
    return answers[question.dependsOn.field] === question.dependsOn.value;
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      return; // Prevent navigation if required field is empty
    }

    if (currentQuestionIndex < questions.length - 1) {
      // Find next visible question
      let nextIndex = currentQuestionIndex + 1;
      while (nextIndex < questions.length && !isQuestionVisible(questions[nextIndex])) {
        nextIndex++;
      }
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setShowReview(true);
      }
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // Find previous visible question
      let prevIndex = currentQuestionIndex - 1;
      while (prevIndex >= 0 && !isQuestionVisible(questions[prevIndex])) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        setCurrentQuestionIndex(prevIndex);
      }
    }
  };

  const handleSubmit = () => {
    // Validate all required questions
    const requiredQuestions = questions.filter(q => q.required && isQuestionVisible(q));
    const missingRequired = requiredQuestions.filter(q => !answers[q.id]);

    if (missingRequired.length > 0) {
      // Navigate to first missing required question
      const firstMissingIndex = questions.findIndex(q => q.id === missingRequired[0].id);
      setCurrentQuestionIndex(firstMissingIndex);
      return;
    }

    onSubmit(answers);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showReview) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Answers</h3>
          <p className="text-gray-500 text-sm">Please verify your responses before submitting</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
          <dl className="space-y-4">
            {questions
              .filter(q => isQuestionVisible(q) && answers[q.id] !== undefined)
              .map((question) => (
                <div key={question.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <dt className="text-sm font-medium text-gray-500">{question.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Array.isArray(answers[question.id])
                      ? answers[question.id].join(', ')
                      : answers[question.id]}
                  </dd>
                </div>
              ))}
          </dl>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
            <p className="flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5" />
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => setShowReview(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Edit Answers
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Symptoms'}
            <FiArrowRight className="inline ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!isQuestionVisible(currentQuestion)) {
    // Skip invisible questions
    useEffect(() => {
      handleNext();
    }, []);
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center">
        Question {currentQuestionIndex + 1} of {questions.filter(isQuestionVisible).length}
      </p>

      {/* Question Card */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.label}
          {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
        </h3>

        {currentQuestion.type === 'select' && (
          <select
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required={currentQuestion.required}
          >
            <option value="">Select an option</option>
            {currentQuestion.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {currentQuestion.type === 'radio' && (
          <div className="space-y-3" role="radiogroup" aria-label={currentQuestion.label}>
            {currentQuestion.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={opt.value}
                  checked={answers[currentQuestion.id] === opt.value}
                  onChange={() => handleAnswerChange(opt.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'checkbox' && (
          <div className="space-y-3" role="group" aria-label={currentQuestion.label}>
            {currentQuestion.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(opt.value)}
                  onChange={(e) => {
                    const current = answers[currentQuestion.id] || [];
                    if (e.target.checked) {
                      handleAnswerChange([...current, opt.value]);
                    } else {
                      handleAnswerChange(current.filter((v: string) => v !== opt.value));
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-gray-900">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'number' && (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(Number(e.target.value) || 0)}
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-medium"
              required={currentQuestion.required}
            />
            {currentQuestion.id === 'painLevel' && (
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>No pain (0)</span>
                  <span>Moderate (5)</span>
                  <span>Worst pain (10)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
                    style={{ width: `${((answers[currentQuestion.id] || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required={currentQuestion.required}
          />
        )}

        {currentQuestion.type === 'textarea' && (
          <textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Please provide any additional details..."
          />
        )}

        {currentQuestion.type === 'duration' && (
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={answers[currentQuestion.id]?.value || 1}
              onChange={(e) => {
                const newValue = {
                  ...answers[currentQuestion.id],
                  value: Number(e.target.value) || 1
                };
                handleAnswerChange(newValue);
              }}
              min={1}
              max={365}
              step={1}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-medium"
              required={currentQuestion.required}
            />
            <select
              value={answers[currentQuestion.id]?.unit || 'days'}
              onChange={(e) => {
                const newValue = {
                  ...answers[currentQuestion.id],
                  unit: e.target.value
                };
                handleAnswerChange(newValue);
              }}
              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={currentQuestion.required && !answers[currentQuestion.id]}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <FiArrowRight className="inline ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SymptomQuestionnaire;