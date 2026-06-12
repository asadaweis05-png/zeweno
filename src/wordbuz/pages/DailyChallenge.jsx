import React, { useEffect } from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import { useAuth } from '../context/AuthContext';
import PuzzlePlayer from '../components/PuzzlePlayer';
import AdUnit from '../components/AdUnit';
import { Trophy, Users, Zap, Share2, Star, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DailyChallenge = () => {
  const { startPuzzle, isSolved } = usePuzzles();
  const { userProfile } = useAuth();

  useEffect(() => {
    const loadDailyPuzzle = async () => {
      const todayId = 'daily-' + new Date().toISOString().split('T')[0];
      try {
        const { data, error } = await supabase
          .from('puzzles')
          .select('*')
          .eq('id', todayId)
          .single();

        if (data) {
          startPuzzle(data);
        } else {
          throw error || new Error('No daily puzzle found');
        }
      } catch (err) {
        console.warn('Could not load daily puzzle from Supabase, using fallback:', err);
        startPuzzle({
          id: todayId,
          type: 'Mantiq (Logic)',
          difficulty: 'Dhexdhexaad',
          question: 'Waa maxay waxa qoyan marka uu ku qallajinayo?',
          answer: ['Shukumaan', 'Towel'],
          explanation: 'Shukumaanka (Towel) wuxuu nuugaa biyaha marka aad isku qallajinayso, sidaas ayuuna ku qoyaa.',
          isDaily: true
        });
      }
    };

    loadDailyPuzzle();
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'PuzzleWin Tartan',
      text: `Waan xaliyay hal-xiraalaha maanta ee PuzzleWin! Igu soo biir oo ku guuleyso $10!`,
      url: window.location.origin + '/wordbuz?ref=' + (userProfile?.referral_code || '')
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        navigator.clipboard.writeText(shareData.url);
        alert('Linkiga waa la koobiyey!');
      }
    } catch (err) { console.log('Cilad wadaagista:', err); }
  };

  return (
    <div className="px-4 section-padding max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Trophy size={14} />
          <span>Abaalmarinta Maalinlaha</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Tartanka Maanta</h1>
        <p className="text-slate-800 text-lg">
          Xali hal-xiraalahan adigoo isticmaalaya 3 isku-day si aad ugu guuleysato <span className="font-bold text-slate-900">$10 abaalmarin ah.</span>
        </p>
      </div>

      <PuzzlePlayer />

      <AdUnit slotId="daily-premium-banner" />

      {isSolved && (
        <div className="clean-card bg-emerald-50 border-emerald-200 text-center space-y-6">
          <div className="space-y-3">
            <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Nasiib Wacan!</h2>
            <p className="text-slate-800">
              Waxaad heshay 1 fursad oo aad kaga qaybgasho isku-aadka maanta. Natiijada dib u eeg <span className="font-bold text-slate-900">12 saac</span> kadib.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Fursadaha', value: '1', color: 'text-emerald-600' },
              { label: 'Dhibco Dheeri', value: '+15', color: 'text-blue-600' },
              { label: 'Kaalinta', value: '#42', color: 'text-orange-600' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-700 uppercase font-bold mb-1">{stat.label}</div>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleShare}
            className="btn-primary w-full sm:w-auto mx-auto px-8"
          >
            <Share2 size={20} />
            La Wadaag si aad u hesho +1 Fursad
          </button>
        </div>
      )}

      {/* Social proof bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-slate-200 text-slate-800">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users size={16} className="text-blue-500" />
          <span>1,240 ayaa hada ciyaaraya</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Zap size={16} className="text-orange-500" />
          <span>82% ayaa xaliyay</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Star size={16} className="text-brand-500" />
          <span>4.9/5 qiimeynta</span>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
