import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Star, Crown, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('points');
  const { userProfile } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState({ points: [], streaks: [] });
  const [userRank, setUserRank] = useState({ pointsRank: 1, streaksRank: 1, total: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const { data: pointsData, error: pointsError } = await supabase
          .from('users')
          .select('uid, username, points, streak')
          .order('points', { ascending: false })
          .limit(10);

        if (pointsError) throw pointsError;

        const { data: streaksData, error: streaksError } = await supabase
          .from('users')
          .select('uid, username, points, streak')
          .order('streak', { ascending: false })
          .limit(10);

        if (streaksError) throw streaksError;

        setLeaderboardData({
          points: pointsData || [],
          streaks: streaksData || []
        });

        if (userProfile) {
          const { count: totalUsersCount, error: countErr } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

          if (countErr) throw countErr;

          const { count: higherPointsCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gt('points', userProfile.points || 0);

          const { count: higherStreakCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gt('streak', userProfile.streak || 0);

          setUserRank({
            pointsRank: (higherPointsCount || 0) + 1,
            streaksRank: (higherStreakCount || 0) + 1,
            total: totalUsersCount || 1
          });
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userProfile]);

  const currentData = leaderboardData[activeTab];
  const activeRank = activeTab === 'points' ? userRank.pointsRank : userRank.streaksRank;

  return (
    <div className="px-4 section-padding max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Hogaanka Ciyaarta</h1>
        <p className="text-slate-800">Ciyaartoyda ugu sareysa. Waa la cusbooneysiiyaa waqtiga dhabta ah.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        {[
          { id: 'points', label: 'Dhibcaha', icon: <Star size={16} /> },
          { id: 'streaks', label: 'Joogtaynta', icon: <Flame size={16} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-800 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="clean-card p-0 overflow-hidden bg-white text-slate-800">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-600/20 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="py-12 text-center text-slate-500">Ciyaartoy ma jirto dhamaanin</div>
        ) : (
          currentData.map((player, i) => (
            <div 
              key={player.uid || player.id}
              className={`flex items-center gap-4 p-4 sm:p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                i === 0 ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className={`font-bold text-lg w-8 text-center ${
                i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-600' : i === 2 ? 'text-orange-700' : 'text-slate-600'
              }`}>
                #{i + 1}
              </div>
              
              <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center font-bold text-sm">
                {player.avatar || player.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                  {player.username || player.name}
                  {i === 0 && <Crown size={14} className="text-amber-500" />}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Flame size={12} className="text-orange-500" /> {player.streak} maalmood
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-brand-600 text-lg">
                  {activeTab === 'points' ? (player.points || 0).toLocaleString() : (player.streak || 0)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  {activeTab === 'points' ? 'Dhibcood' : 'Maalmood'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Your Rank */}
      {userProfile && (
        <div className="clean-card bg-brand-50 border-brand-200 flex items-center gap-4 p-5">
          <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
            {userProfile.username?.charAt(0).toUpperCase() || 'Y'}
          </div>
          <div className="flex-1">
            <div className="text-xs text-brand-700 font-semibold uppercase">Booskaaga</div>
            <div className="text-lg font-bold text-slate-900">
              #{activeRank} ee {userRank.total}
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-sm bg-emerald-100 px-3 py-1 rounded-md">
            <TrendingUp size={14} /> Firfircoon
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
