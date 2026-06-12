import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Bridge: get the authenticated user from the main zeweno.com context
  const { user, authLoading, signIn: mainSignIn, signUp: mainSignUp, signOut: mainSignOut } = useApp();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch / create wordbuz profile whenever main user changes
  useEffect(() => {
    if (authLoading) return; // Wait for main auth to settle

    if (user) {
      fetchUserProfile(user.id);
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          uid,
          email: user?.email,
          balance: 0,
          username: user?.user_metadata?.full_name || 'PuzzleMaster',
          points: 0,
          streak: 0,
          total_attempts: 0,
          referrals: 0,
          daily_entries: 0,
          accuracy: 0,
          last_active: new Date().toISOString(),
          referral_code: Math.random().toString(36).substring(7).toUpperCase()
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          setUserProfile(insertedData);
          
          // Reward referrer if a referral code exists in local storage
          const referralCode = localStorage.getItem('referrer_code');
          if (referralCode) {
            try {
              const { error: rpcError } = await supabase.rpc('increment_referral', {
                referrer_code_param: referralCode
              });
              if (rpcError) {
                console.error('Error rewarding referrer:', rpcError);
              } else {
                console.log('Successfully rewarded referrer:', referralCode);
              }
            } catch (rpcErr) {
              console.error('Exception rewarding referrer:', rpcErr);
            } finally {
              localStorage.removeItem('referrer_code');
            }
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delegate auth actions to the main AppContext
  const login = useCallback(async (email, password) => {
    try {
      const data = await mainSignIn(email, password);
      return { data, error: null };
    } catch (error) {
      console.error("Login Error:", error);
      return { data: null, error };
    }
  }, [mainSignIn]);

  const signup = useCallback(async (email, password, fullName) => {
    try {
      const data = await mainSignUp(email, password);
      return { data, error: null };
    } catch (error) {
      console.error("Signup Error:", error);
      return { data: null, error };
    }
  }, [mainSignUp]);

  const logout = useCallback(async () => {
    try {
      await mainSignOut();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, [mainSignOut]);

  const recordPuzzleResult = useCallback(async ({ pointsEarned = 0, isSolved = false, isDaily = false, attemptsUsed = 1 }) => {
    if (!user || !userProfile) return;
    
    const newTotalAttempts = (userProfile.total_attempts || 0) + 1;
    const currentCorrect = Math.round(((userProfile.total_attempts || 0) * (userProfile.accuracy || 0)) / 100);
    const newAccuracy = Math.round(((currentCorrect + (isSolved ? 1 : 0)) / newTotalAttempts) * 100);

    const updates = {
      points: (userProfile.points || 0) + pointsEarned,
      total_attempts: newTotalAttempts,
      accuracy: newAccuracy,
      last_active: new Date().toISOString()
    };

    if (isDaily) {
      updates.daily_entries = (userProfile.daily_entries || 0) + 1;
      if (isSolved) {
        updates.streak = (userProfile.streak || 0) + 1;
      }
    }

    // Optimistic UI update
    setUserProfile(prev => ({ ...prev, ...updates }));

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', user.id);
      
    if (error) {
      console.error('Error updating puzzle stats:', error);
      fetchUserProfile(user.id);
    }
  }, [user, userProfile]);

  // New helper to award daily cash prize (balance) if user is first winner
  const awardDailyPrize = async (puzzleId) => {
    if (!user || !userProfile) return false;
    try {
      // Attempt to insert winner record; will fail if already exists due to unique constraint
      const { data: winner, error: insertErr } = await supabase
        .from('puzzle_winners')
        .insert([{ puzzle_id: puzzleId, user_id: user.id, email: user.email, approved: false }])
        .single();
      if (insertErr) {
        // Probably already a winner
        console.log('Daily prize already claimed');
        return false;
      }
      // Add $2 to balance
      const { error: balErr } = await supabase
        .from('users')
        .update({ balance: (userProfile.balance || 0) + 2 })
        .eq('uid', user.id);
      if (balErr) {
        console.error('Error updating balance:', balErr);
      }
      // Optimistic UI update for balance
      setUserProfile(prev => ({ ...prev, balance: (prev.balance || 0) + 2 }));
      return true;
    } catch (e) {
      console.error('Award prize error:', e);
      return false;
    }
  };
    user,
    userProfile,
    loading: loading || authLoading,
    login,
    signup,
    logout,
    recordPuzzleResult,
    awardDailyPrize
  };

  return (
    <AuthContext.Provider value={value}>
      {!(loading || authLoading) && children}
    </AuthContext.Provider>
  );
};
