import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Copy, CheckCircle2, User, Trophy, Flame, Target, Star, Gift, Users } from 'lucide-react';

const Profile = () => {
  const { user, userProfile, logout } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mb-2">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Fadlan Soo Gal</h2>
        <p className="text-slate-800 text-center max-w-sm">
          Si aad u aragto natiijadaada iyo dhibcahaaga, fadlan akoonkaaga soo gal.
        </p>
      </div>
    );
  }

  const copyReferral = () => {
    const link = `${window.location.origin}/wordbuz?ref=${userProfile?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Dhibcaha', value: userProfile?.points || 0, icon: <Star className="text-brand-500" size={24}/>, color: 'bg-brand-50 border-brand-100' },
    { label: 'Joogtaynta', value: `${userProfile?.streak || 0} Cisho`, icon: <Flame className="text-orange-500" size={24}/>, color: 'bg-orange-50 border-orange-100' },
    { label: 'Saxsanaanta', value: `${userProfile?.accuracy || 0}%`, icon: <Target className="text-blue-500" size={24}/>, color: 'bg-blue-50 border-blue-100' },
    { label: 'Hal-xiraale Xalisan', value: userProfile?.total_attempts || 0, icon: <Trophy className="text-amber-500" size={24}/>, color: 'bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="px-4 section-padding max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="clean-card flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-slate-100 border-4 border-white shadow-sm rounded-full flex items-center justify-center text-4xl font-bold text-slate-800 shrink-0">
          {userProfile?.username?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">{userProfile?.username || 'Ciyaartoy'}</h1>
          <p className="text-slate-700">{user.email}</p>
        </div>
        <button 
          onClick={logout}
          className="btn-secondary w-full md:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
        >
          <LogOut size={18} />
          Ka Bax
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-xl border ${stat.color} flex flex-col justify-center`}>
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-slate-800 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="clean-card space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="text-brand-500" size={24}/>
            <h2 className="text-xl font-bold text-slate-900">Guulaha (Badges)</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Flame size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900">Bilowga Kulul</div>
                <div className="text-sm text-slate-700">Xali hal-xiraalaha 3 cisho oo xiriir ah.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200  grayscale">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Target size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900">Maskax Furan</div>
                <div className="text-sm text-slate-700">Gaar 90% saxsanaan bishan.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals */}
        <div className="clean-card space-y-6 bg-brand-50 border-brand-100">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-brand-600" size={24}/>
            <h2 className="text-xl font-bold text-slate-900">Casuum Saaxiibadaa</h2>
          </div>
          <p className="text-slate-800 text-sm">
            Wadaag linkigaaga. Qof kasta oo ku soo biira, waxaad helaysaa <strong className="text-brand-700">50 dhibcood</strong> oo bilaash ah!
          </p>
          
          <div className="flex gap-2">
            <div className="input-field flex-1 font-mono text-sm overflow-hidden whitespace-nowrap bg-white">
              {window.location.origin}/wordbuz?ref={userProfile?.referral_code}
            </div>
            <button 
              onClick={copyReferral}
              className={`px-4 rounded-lg font-bold flex items-center justify-center transition-colors ${
                copied ? 'bg-emerald-500 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
            >
              {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-lg border border-brand-200">
            <Users size={16} className="text-brand-500" />
            Dadka aad casuuntay: {userProfile?.referrals || 0} qof
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
