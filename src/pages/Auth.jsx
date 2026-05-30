import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, Mail, Lock, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp } = useApp();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Fadlan geli email-ka iyo erayga sirta ah.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Erayada sirta ah isma laha.');
      return;
    }

    if (password.length < 6) {
      setError('Erayga sirta ah waa inuu ka koobnaadaa ugu yaraan 6 xaraf.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('Akoonkaaga waa la abuuray! Fadlan hubi email-kaaga si aad u xaqiijiso.');
        // If auto-confirm is enabled in Supabase, we can navigate directly, 
        // but showing a success message is robust. Let's also support direct navigation
        setTimeout(() => {
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
        }, 3000);
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'Invalid login credentials') {
        setError('Email-ka ama erayga sirta ah waa khalad.');
      } else if (err.message === 'User already registered') {
        setError('Email-kan mar hore ayaa la diwaangeliyey.');
      } else {
        setError(err.message || 'Wax qalad ah ayaa dhacay. Fadlan isku day markale.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
      </div>
      
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-text text-gradient">zeweno</span>
            <span className="logo-badge"><Sparkles size={10} />OS</span>
          </div>
          <h2>{isSignUp ? 'Abuur Akoon Cusub' : 'Ku Soo Dhowow Zeweno'}</h2>
          <p className="text-secondary">
            {isSignUp 
              ? 'Ku biir nidaamkayaga modular-ka ah ee shaqada, waxbarashada, iyo caafimaadka.' 
              : 'Fadlan geli macluumaadkaaga si aad u gasho nidaamka.'}
          </p>
        </div>

        {error && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert success">
            <Shield size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="magacaaga@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Erayga Sirta Ah (Password)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="form-group animate-slide-up">
              <label>Hubi Erayga Sirta Ah</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full mt-md" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Abuur Akoon' : 'Gal Nidaamka'}</span>
                {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isSignUp ? 'Malahaa akoon mar hore ayaad samaysatay?' : 'Miyaanad lahayn akoon diwaangashan?'}</span>
          <button 
            type="button" 
            className="auth-toggle-btn"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
            disabled={loading}
          >
            {isSignUp ? 'Soo Gal' : 'Isku Diwaangeli'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
