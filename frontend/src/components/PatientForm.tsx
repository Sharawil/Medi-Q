import React, { useState } from 'react';
import { FiArrowRight, FiUser, FiCalendar, FiDroplet } from 'react-icons/fi';

interface PatientFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  error: string | null;
}

const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  isSubmitting,
  error
}) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    age: '',
    bloodGroup: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) newErrors.age = 'Please enter a valid age';
    else if (Number(formData.age) > 150) newErrors.age = 'Please enter a realistic age';
    if (!formData.bloodGroup.trim()) newErrors.bloodGroup = 'Blood group is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-start gap-3">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center">
            <FiUser className="w-4 h-4 mr-1.5 text-red-600" />
            Full Name <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white text-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
        </div>

        {/* Age & Blood Group Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center">
              <FiCalendar className="w-4 h-4 mr-1.5 text-red-600" />
              Age <span className="text-red-600 ml-1">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white text-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                errors.age ? 'border-red-500' : 'border-slate-300'
              }`}
              min="1"
              max="150"
              placeholder="Enter age (e.g. 28)"
            />
            {errors.age && <p className="mt-1 text-sm text-red-600 font-medium">{errors.age}</p>}
          </div>

          {/* Blood Group Dropdown (Only for first step as requested) */}
          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center">
              <FiDroplet className="w-4 h-4 mr-1.5 text-red-600" />
              Blood Group <span className="text-red-600 ml-1">*</span>
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white text-slate-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors cursor-pointer ${
                errors.bloodGroup ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            {errors.bloodGroup && <p className="mt-1 text-sm text-red-600 font-medium">{errors.bloodGroup}</p>}
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-red-600 text-white font-extrabold rounded-xl hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-200 transition-all flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Generate Token
              <FiArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
