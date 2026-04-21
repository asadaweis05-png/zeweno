import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="section-full-width flex-center" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
      </div>
      
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="stat-card-icon red mb-lg" style={{ 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 2rem',
          background: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--accent-red)'
        }}>
          <Ghost size={40} />
        </div>
        
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1.5rem' }}>Boggan lama helin</h2>
        <p className="text-secondary mb-xl">
          Waan ka xunnahay, boggii aad raadinaysay ma jiro ama waa laga guuray.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Dib u noqo
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <Home size={18} /> Suuqa Guud
          </button>
        </div>
      </div>
    </div>
  );
}
