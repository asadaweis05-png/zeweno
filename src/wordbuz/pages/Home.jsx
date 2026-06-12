import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Play, Users, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdUnit from '../components/AdUnit';
import AuthModal from '../components/AuthModal';

const Home = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 section-padding max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12 border-b border-slate-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold mb-2">
          <CheckCircle2 size={16} />
          <span>Tartan Cusub 24 Saac Kasta</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Hano Hal-xiraalaha.<br/>
          <span className="text-brand-600">La Wareeg Hogaanka.</span>
        </h1>
        
        <p className="text-slate-800 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
          Ku biir ciyaartoyda xalinaya hal-xiraalayaasha caqliga u baahan maalin kasta, si aad ugu guuleysato abaalmarino iyo dhibco.
        </p>
        
        {!user && (
          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              Bilow Safarkaaga <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Featured Daily Challenge */}
      <section className="clean-card bg-slate-900 text-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm uppercase tracking-wide">
              <Trophy size={18} />
              <span>Abaalmarinta Maanta: $10.00</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Ma xalin kartaa Tartanka Maanta?</h2>
            <p className="text-slate-600">Hal fursad. Hal jawaab. Hal guuleyste maalin kasta.</p>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-brand-600 flex items-center justify-center text-[10px] font-bold">
                  +84
                </div>
              </div>
              <div className="text-sm text-slate-600">Waa ay ka qaybgaleen</div>
            </div>
          </div>
          
          <div className="w-full lg:w-auto bg-slate-800 p-6 rounded-xl text-center border border-slate-700">
            <div className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Waqtiga Haray</div>
            <div className="text-3xl font-mono font-bold tabular-nums mb-4 text-white">
              {timeLeft}
            </div>
            <Link to="/wordbuz/daily" className="btn-primary w-full shadow-none bg-brand-500 hover:bg-brand-600">
              Hada Ciyaar
            </Link>
          </div>
        </div>
      </section>

      <AdUnit slotId="home-premium-mid" />

      {/* Game Modes Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/wordbuz/free-play" className="clean-card flex flex-col group">
          <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 mb-4 transition-transform group-hover:scale-105">
            <Play size={24} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ciyaar Xor ah</h3>
          <p className="text-slate-800 text-sm flex-1 mb-4">Dhowr nooc oo adkaansho leh. Halkan ku tababaro oo dhibco ururso wakhti kasta.</p>
          <div className="flex items-center gap-1 text-brand-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Bilow Ciyaarta <ChevronRight size={16} />
          </div>
        </Link>

        <Link to="/wordbuz/leaderboard" className="clean-card flex flex-col group">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4 transition-transform group-hover:scale-105">
            <Trophy size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Hogaanka Ciyaarta</h3>
          <p className="text-slate-800 text-sm flex-1 mb-4">Eeg cida ugu dhibcaha badan ama ugu guulaha badan asbuucan.</p>
          <div className="flex items-center gap-1 text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
            Eeg Hogaanka <ChevronRight size={16} />
          </div>
        </Link>

        <div className="clean-card flex flex-col sm:col-span-2 lg:col-span-1 bg-brand-50 border-brand-100">
          <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Casuum & Hel Dhibco</h3>
          <p className="text-slate-800 text-sm flex-1 mb-4">U dir saaxiibadaa linkigaaga si aad u hesho 50 dhibcood oo bilaash ah markay is-diiwaangeliyaan.</p>
          <Link to="/wordbuz/profile" className="btn-secondary text-sm py-2">
            Hel Linkigaaga
          </Link>
        </div>
      </section>

      {/* Trust Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
        {[
          { label: 'Ciyaartoyda', value: '4,200+' },
          { label: 'Abaalmarinta', value: '$8,450' },
          { label: 'Hal-xiraale Xalisan', value: '150k+' },
          { label: 'Heerka Guusha', value: '94.2%' },
        ].map((stat, i) => (
          <div key={i} className="text-center p-4">
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-700 uppercase tracking-wide font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Home;
