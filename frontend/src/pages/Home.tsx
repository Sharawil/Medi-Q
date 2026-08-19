import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiUserCheck, FiClock, FiCheckSquare, FiShield, FiHeart, FiArrowRight } from 'react-icons/fi';

const Home: React.FC = () => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border border-red-100 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl shadow-red-100/50">
        
        {/* Decorative First Aid Watermark Background */}
        <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
          <div className="w-96 h-96 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-48 h-16 bg-white rounded-md"></div>
            <div className="h-48 w-16 bg-white rounded-md absolute"></div>
          </div>
        </div>

        <div className="max-w-3xl space-y-6 relative z-10">
          
          {/* First Aid Emergency Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>First Aid & Smart Queue Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Streamlined Emergency <br />
            <span className="text-red-600 underline decoration-red-200 underline-offset-8">Pre-Consultation</span> Queue
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Medi-Q</strong> is a modern patient pre-consultation system designed to reduce hospital wait times. Patients register symptoms visually before seeing the doctor, granting healthcare providers instant insights and giving patients instant queue tokens.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/patient/check-in"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-extrabold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-2xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <FiActivity className="w-6 h-6 mr-3 stroke-[2.5]" />
              Start Patient Check-In
              <FiArrowRight className="w-5 h-5 ml-3" />
            </Link>

            <Link
              to="/doctor/dashboard"
              className="inline-flex items-center justify-center px-6 py-4 text-base font-bold text-red-700 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl transition-colors"
            >
              <FiUserCheck className="w-5 h-5 mr-2 text-red-600" />
              Doctor Access
            </Link>
          </div>

        </div>
      </section>

      {/* What is Medi-Q About Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How Medi-Q Works</h2>
          <p className="mt-2 text-slate-600">Simple 3-step digital intake to skip waiting room confusion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-md hover:shadow-xl hover:border-red-300 transition-all space-y-4 group">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <FiCheckSquare className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. Instant Patient Intake</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter basic details (Name, Age, Blood Group) in seconds without messy paper registration forms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-md hover:shadow-xl hover:border-red-300 transition-all space-y-4 group">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <FiActivity className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. Visual Card Selection</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Select body parts and symptoms using clear visual cards (no complex medical jargon or dropdown menus).
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-md hover:shadow-xl hover:border-red-300 transition-all space-y-4 group">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <FiClock className="w-7 h-7 stroke-[2]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Token & Doctor Review</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get your live digital token number. Doctors inspect your pre-filled symptom chart before calling your token.
            </p>
          </div>

        </div>
      </section>

      {/* Medical Trust Banner */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-red-200">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold">Ready to check in?</h3>
          <p className="text-red-100 text-sm">Join the queue in less than 60 seconds with our intuitive card system.</p>
        </div>
        <Link
          to="/patient/check-in"
          className="px-8 py-3.5 bg-white text-red-700 hover:bg-red-50 font-black rounded-xl shadow transition-colors whitespace-nowrap"
        >
          Check-In Now
        </Link>
      </section>
    </div>
  );
};

export default Home;