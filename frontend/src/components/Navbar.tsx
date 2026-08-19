import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser, FiUserCheck, FiActivity } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [doctorUser, setDoctorUser] = useState<any>(
    JSON.parse(localStorage.getItem('doctor_user') || 'null')
  );

  // Sync auth state whenever route changes
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setDoctorUser(JSON.parse(localStorage.getItem('doctor_user') || 'null'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctor_user');
    setToken(null);
    setDoctorUser(null);
    navigate('/doctor/login');
  };

  const isDoctorPage = location.pathname.startsWith('/doctor');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-red-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand with First Aid Symbol */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
              {/* First Aid Cross Icon */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute w-6 h-2 bg-white rounded-sm"></div>
                <div className="absolute h-6 w-2 bg-white rounded-sm"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">Medi</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">-Q</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Emergency Intake & Queue</p>
            </div>
          </Link>

          {/* Top Right Navigation & Doctor Login Button */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/patient/check-in"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                >
                  <FiActivity className="w-4 h-4 mr-2 text-red-600" />
                  Patient Check-In
                </Link>
                
                {/* Doctor Login Button links to /doctor/login for credentials verification */}
                <Link
                  to="/doctor/login"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-200 transition-all transform hover:-translate-y-0.5"
                >
                  <FiUserCheck className="w-4 h-4 mr-2 stroke-[2.5]" />
                  Doctor Login
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center px-3.5 py-1.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold">
                  <FiUser className="h-4 w-4 mr-1.5 text-red-600" />
                  <span>{doctorUser?.name || 'Dr. Smith'}</span>
                </div>
                
                <Link
                  to="/doctor/dashboard"
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isDoctorPage ? 'bg-red-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Doctor Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-extrabold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-xl transition-all"
                >
                  <FiLogOut className="mr-1.5 h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;