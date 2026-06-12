import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (!fullName) {
        setError('Fadlan gali magacaaga oo buuxa.');
        setLoading(false);
        return;
      }
      result = await signup(email, password, fullName);
    }

    setLoading(false);

    if (result.error) {
      // Map common Supabase errors to Somali or simple text
      if (result.error.message.includes('Invalid login credentials')) {
         setError('Email-ka ama Password-ka waa khalad.');
      } else if (result.error.message.includes('User already registered')) {
         setError('Email-kan horay ayaa loo diiwaangeliyay.');
      } else if (result.error.message.includes('Password should be at least')) {
         setError('Password-ku waa inuu ahaadaa ugu yaraan 6 xaraf.');
      } else {
         setError(result.error.message);
      }
    } else {
      if (!isLogin && result.data?.user?.identities?.length === 0) {
        setError('Email-kan horay ayaa loo diiwaangeliyay.');
        return;
      }
      onClose(); // Close modal on success
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-sm">
              P
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Ku Soo Dhowow' : 'Sameyso Akoon Cusub'}
            </h2>
            <p className="text-slate-600 mt-2">
              {isLogin ? 'Geli xogtaada si aad u gasho akoonkaaga.' : 'Ku biir ciyaartoyda maanta oo hel dhibco.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Magaca Buuxa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 bg-white"
                    placeholder="Magacaaga..."
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 bg-white"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 bg-white"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex justify-center items-center mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Gal Akoonka' : 'Diiwaangeli'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
            {isLogin ? "Miyaadan lahayn akoon? " : "Miyuu kuu furan yahay akoon? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-brand-600 font-bold hover:underline ml-1"
            >
              {isLogin ? 'Is-diiwaangeli' : 'Soo Gal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
