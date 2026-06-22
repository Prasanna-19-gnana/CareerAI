import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass p-8 rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-white/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4 shadow-inner">
              <UserPlus size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Start your career journey with AI</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/50 transition-all outline-none text-slate-700" 
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/50 transition-all outline-none text-slate-700" 
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white/50 transition-all outline-none text-slate-700" 
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-500 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
