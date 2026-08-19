import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUserCheck, FiLock, FiMail, FiArrowRight, FiInfo } from 'react-icons/fi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const enteredEmail = formData.email.toLowerCase().trim();
      const enteredPassword = formData.password.trim();

      // Enforce fixed username: doc@medic.com and password: mediq123
      if (
        (enteredEmail === 'doc@medic.com' || enteredEmail === 'doc') &&
        enteredPassword === 'mediq123'
      ) {
        const mockUser = {
          id: '1',
          name: 'Dr. Smith',
          email: 'doc@medic.com',
          role: 'doctor'
        };

        localStorage.setItem('token', 'mock-jwt-token-doctor');
        localStorage.setItem('doctor_user', JSON.stringify(mockUser));
        navigate('/doctor/dashboard');
      } else {
        throw new Error('Invalid credentials. Username must be doc@medic.com and password must be mediq123');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-red-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-red-100 space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-200 text-white">
            <FiUserCheck className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Doctor Login
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Sign in to view live patient queue and submitted symptoms
          </p>
        </div>

        {/* Credentials Info Badge */}
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 text-xs text-red-900 space-y-1.5 shadow-sm">
          <div className="flex items-center space-x-1.5 font-extrabold text-red-700">
            <FiInfo className="w-4 h-4 text-red-600" />
            <span>Doctor Authorization Credentials:</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between font-mono bg-white p-2.5 rounded-xl border border-red-200 gap-1 text-slate-800">
            <span>Username: <strong className="text-red-700">doc@medic.com</strong></span>
            <span>Password: <strong className="text-red-700">mediq123</strong></span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm font-medium">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
              <FiMail className="w-4 h-4 mr-1.5 text-red-600" />
              Doctor Username / Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
              placeholder="doc@medic.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center">
              <FiLock className="w-4 h-4 mr-1.5 text-red-600" />
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
              placeholder="mediq123"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Authenticating...</span>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <FiArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm font-semibold text-slate-500 pt-1">
          <Link to="/" className="text-red-600 hover:text-red-800 transition-colors">
            ← Return to Home Landing
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;