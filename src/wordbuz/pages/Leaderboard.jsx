import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Trophy, Flame, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const [dailyWinners, setDailyWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      const { data, error } = await supabase
        .from('puzzle_winners')
        .select('email, avatar')
        .eq('approved', true)
        .order('won_at', { ascending: false })
        .limit(10);
      if (error) {
        console.error('Error fetching winners:', error);
      } else {
        setDailyWinners(data);
      }
    };
    fetchWinners();
  }, []);

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
          const { count: totalUsersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
          const { count: higherPointsCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).gt('points', userProfile.points || 0);
          const { count: higherStreakCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).gt('streak', userProfile.streak || 0);

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

  const [activeTab, setActiveTab] = useState('points');
  const currentData = activeTab === 'points' ? leaderboardData.points : leaderboardData.streaks;
  const activeRank = activeTab === 'points' ? userRank.pointsRank : userRank.streaksRank;

  return (
    <PageCard className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header text-center mb-xl">
        <h1>Hogaanka Ciyaarta</h1>
        <p className="text-secondary text-lg">Ciyaartoyda ugu sareysa. Waa la cusbooneysiiyaa waqtiga dhabta ah.</p>
      </div>

      <div className="tabs mb-xl" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
          {['points', 'streaks'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'points' ? <Star size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> : <Flame size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />}
              {tab === 'points' ? 'Dhibcaha' : 'Joogtaynta'}
            </button>
          ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--card-border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : currentData.length === 0 ? (
        <div className="empty-state">
          <Trophy size={48} />
          <h3>Ciyaartoy ma jirto dhamaanin</h3>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          {currentData.map((player, i) => (
            <div 
              key={player.uid || player.id}
              className="list-item"
              style={{ border: 'none', borderRadius: '0', borderBottom: '1px solid var(--card-border)' }}
            >
              <div style={{ width: '30px', textAlign: 'center', fontWeight: 'bold', color: i < 3 ? 'var(--accent-amber)' : 'var(--text-muted)', fontSize: i < 3 ? '1.25rem' : '1rem' }}>
                #{i + 1}
              </div>
              
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: i < 3 ? '2px solid var(--accent-amber)' : '1px solid var(--card-border)' }}>
                {player.avatar || player.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.username || player.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={12} style={{ color: 'var(--accent-amber)' }} /> {player.streak} maalmood
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: activeTab === 'points' ? 'var(--accent-cyan)' : 'var(--accent-amber)', fontSize: '1.25rem' }}>
                  {activeTab === 'points' ? (player.points || 0).toLocaleString() : (player.streak || 0)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {activeTab === 'points' ? 'Dhibcood' : 'Maalmood'}
                </div>
              </div>
            </div>
          ))}

          {dailyWinners.length > 0 && (
          <div className="mt-6">
            <h3 className="text-center mb-2">Daily Puzzle Winners</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {dailyWinners.map((winner, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-glass p-2 rounded">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    {winner.email ? winner.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-sm">{winner.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

            <div style={{ padding: '1.5rem', background: 'rgba(0, 240, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
                {userProfile.username?.charAt(0).toUpperCase() || 'Y'}
              </div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 'bold', textTransform: 'uppercase' }}>Booskaaga</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  #{activeRank} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ee {userRank.total}</span>
                </div>
              </div>
              <div className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} /> Firfircoon
              </div>
            </div>
          )}
        </div>
      )}
    </PageCard>
  );
};

export default Leaderboard;
