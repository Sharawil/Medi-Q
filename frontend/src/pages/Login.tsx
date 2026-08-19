import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUserCheck, FiLock, FiMail, FiArrowRight, FiInfo, FiUserPlus, FiShield } from 'react-icons/fi';

interface DoctorCredentials {
  name: string;
  username: string;
  password: string;
}

const getDoctorCredentials = (): DoctorCredentials[] => {
  const savedDoctors = localStorage.getItem('mediq_doctors');
  if (savedDoctors) return JSON.parse(savedDoctors);

  const legacyDoctor = localStorage.getItem('doctor_credentials');
  return legacyDoctor ? [JSON.parse(legacyDoctor)] : [];
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isSetup, setIsSetup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if doctor is already set up
  useEffect(() => {
    if (getDoctorCredentials().length > 0) {
      setIsSetup(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (isSetup) {
        // Login flow
        const doctors = getDoctorCredentials();
        if (doctors.length === 0) {
          throw new Error('No credentials found. Please set up first.');
        }

        const credentials = doctors.find(doctor => doctor.username === formData.username);

        if (credentials && formData.password === credentials.password) {
          const mockUser = {
            id: '1',
            name: credentials.name,
            username: credentials.username,
            role: 'doctor'
          };

          localStorage.setItem('token', 'mock-jwt-token-doctor');
          localStorage.setItem('doctor_user', JSON.stringify(mockUser));
          navigate('/doctor/dashboard');
        } else {
          throw new Error('Invalid username or password');
        }
      } else {
        // Setup flow
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const credentials: DoctorCredentials = {
          name: formData.name.trim(),
          username: formData.username.trim(),
          password: formData.password
        };

        localStorage.setItem('mediq_doctors', JSON.stringify([credentials]));
        localStorage.setItem('doctor_credentials', JSON.stringify(credentials));
        setIsSetup(true);
        setFormData({ name: '', username: '', password: '', confirmPassword: '' });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-red-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-red-100 space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
            isSetup ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {isSetup ? (
              <FiLock className="w-9 h-9 stroke-[2.5]" />
            ) : (
              <FiUserPlus className="w-9 h-9 stroke-[2.5]" />
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isSetup ? 'Doctor Login' : 'Doctor Setup'}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {isSetup
              ? 'Sign in to view live patient queue and submitted symptoms'
              : 'Set up your doctor account to get started'}
          </p>
        </div>

        {/* Info Badge for Setup */}
        {!isSetup && (
          <div className="bg-green-50/90 border border-green-200 rounded-2xl p-4 text-xs text-green-900 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-extrabold text-green-700">
              <FiShield className="w-4 h-4 text-green-600" />
              <span>First Time Setup</span>
            </div>
            <p className="text-green-800">
              Create your doctor account. This will be your permanent login credentials.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm font-medium">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name Field - Only in Setup */}
          {!isSetup && (
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
                <FiUserCheck className="w-4 h-4 mr-1.5 text-green-600" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium"
                placeholder="Dr. Smith"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Username/Email Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
              <FiMail className="w-4 h-4 mr-1.5 text-red-600" />
              {isSetup ? 'Username / Email' : 'Create Username / Email'}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete={isSetup ? "username" : "email"}
              required
              className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
              placeholder={isSetup ? "doc@medic.com" : "doc@medic.com"}
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
              <FiLock className="w-4 h-4 mr-1.5 text-red-600" />
              {isSetup ? 'Password' : 'Create Password'}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSetup ? "current-password" : "new-password"}
                required
                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium pr-12"
                placeholder={isSetup ? "mediq123" : "Enter password (min 6 chars)"}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <FiLock className="w-5 h-5" />
                ) : (
                  <FiUserCheck className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password - Only in Setup */}
          {!isSetup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
                <FiLock className="w-4 h-4 mr-1.5 text-red-600" />
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 px-4 font-extrabod rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                isSetup
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-red-200'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-green-200'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>{isSetup ? 'Signing In...' : 'Setting Up...'}</span>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </>
              ) : (
                <>
                  <span>{isSetup ? 'Sign In to Dashboard' : 'Create Account & Continue'}</span>
                  <FiArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm font-semibold text-slate-500">
          <Link to="/" className="text-red-600 hover:text-red-800 transition-colors">
            ← Return to Home Landing
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
