import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadData, saveData, getTodayKey, generateId } from '../utils/storage';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // --- Authentication ---
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(err => {
      console.error('Failed to get session:', err);
      setAuthLoading(false);
    });

    // Listen to changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // --- User Profile ---
  const [profile, setProfile] = useState(() => loadData('profile', {
    name: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    bloodType: '',
    goal: 'maintain',
    dietaryPreference: 'No Restrictions',
  }));

  // --- Calories ---
  const [meals, setMeals] = useState(() => loadData('meals', {}));

  // --- Gym ---
  const [workouts, setWorkouts] = useState(() => loadData('workouts', {}));
  const [workoutDates, setWorkoutDates] = useState(() => loadData('workoutDates', []));

  // --- Health ---
  const [bloodTests, setBloodTests] = useState(() => loadData('bloodTests', []));
  const [gutScores, setGutScores] = useState(() => loadData('gutScores', {}));
  const [steps, setSteps] = useState(() => loadData('steps', {}));
  const [vitaminLog, setVitaminLog] = useState(() => loadData('vitaminLog', {}));

  // --- Learning ---
  const [savedContent, setSavedContent] = useState(() => loadData('savedContent', []));

  // --- Notes ---
  const [notes, setNotes] = useState(() => loadData('notes', []));
  const [flashDecks, setFlashDecks] = useState(() => loadData('flashDecks', []));

  // --- Diet AI ---
  const [mealPlans, setMealPlans] = useState(() => loadData('mealPlans', []));


  // --- Community Posts, Buddies, CoStreaks ---
  const [posts, setPosts] = useState(() => loadData('community_posts', []));

  const [friends, setFriends] = useState(() => loadData('community_friends', []));
  const [coStreaks, setCoStreaks] = useState(() => loadData('community_costreaks', []));

  // --- Persist to localStorage ---
  useEffect(() => { saveData('profile', profile); }, [profile]);
  useEffect(() => { saveData('meals', meals); }, [meals]);
  useEffect(() => { saveData('workouts', workouts); }, [workouts]);
  useEffect(() => { saveData('workoutDates', workoutDates); }, [workoutDates]);
  useEffect(() => { saveData('bloodTests', bloodTests); }, [bloodTests]);
  useEffect(() => { saveData('gutScores', gutScores); }, [gutScores]);
  useEffect(() => { saveData('steps', steps); }, [steps]);
  useEffect(() => { saveData('vitaminLog', vitaminLog); }, [vitaminLog]);
  useEffect(() => { saveData('savedContent', savedContent); }, [savedContent]);
  useEffect(() => { saveData('notes', notes); }, [notes]);
  useEffect(() => { saveData('flashDecks', flashDecks); }, [flashDecks]);
  useEffect(() => { saveData('mealPlans', mealPlans); }, [mealPlans]);

  useEffect(() => { saveData('community_posts', posts); }, [posts]);
  useEffect(() => { saveData('community_friends', friends); }, [friends]);
  useEffect(() => { saveData('community_costreaks', coStreaks); }, [coStreaks]);

  // --- Helpers ---
  const today = getTodayKey();

  const addMeal = useCallback((meal) => {
    setMeals(prev => {
      const dayMeals = prev[today] || [];
      return { ...prev, [today]: [...dayMeals, { ...meal, id: generateId() }] };
    });
  }, [today]);

  const removeMeal = useCallback((mealId) => {
    setMeals(prev => {
      const dayMeals = (prev[today] || []).filter(m => m.id !== mealId);
      return { ...prev, [today]: dayMeals };
    });
  }, [today]);

  const todayMeals = meals[today] || [];
  const todayCalories = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);

  const logWorkout = useCallback((workout) => {
    const id = generateId();
    setWorkouts(prev => {
      const dayWorkouts = prev[today] || [];
      return { ...prev, [today]: [...dayWorkouts, { ...workout, id }] };
    });
    setWorkoutDates(prev => {
      if (!prev.includes(today)) return [...prev, today];
      return prev;
    });
  }, [today]);

  const todayWorkouts = workouts[today] || [];

  const logSteps = useCallback((count) => {
    setSteps(prev => ({ ...prev, [today]: count }));
  }, [today]);

  const todaySteps = steps[today] || 0;

  const toggleVitamin = useCallback((vitaminName) => {
    setVitaminLog(prev => {
      const dayLog = prev[today] || [];
      if (dayLog.includes(vitaminName)) {
        return { ...prev, [today]: dayLog.filter(v => v !== vitaminName) };
      }
      return { ...prev, [today]: [...dayLog, vitaminName] };
    });
  }, [today]);

  const todayVitamins = vitaminLog[today] || [];

  const updateGutScore = useCallback((factorId, score) => {
    setGutScores(prev => {
      const dayScores = prev[today] || {};
      return { ...prev, [today]: { ...dayScores, [factorId]: score } };
    });
  }, [today]);

  const todayGutScores = gutScores[today] || {};

  const addBloodTest = useCallback((test) => {
    setBloodTests(prev => [...prev, { ...test, id: generateId(), date: today }]);
  }, [today]);

  const addContent = useCallback((content) => {
    setSavedContent(prev => [{ ...content, id: generateId(), savedAt: new Date().toISOString() }, ...prev]);
  }, []);

  const removeContent = useCallback((id) => {
    setSavedContent(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateContent = useCallback((id, updates) => {
    setSavedContent(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const addNote = useCallback((note) => {
    setNotes(prev => [{ ...note, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev]);
  }, []);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const addFlashDeck = useCallback((deck) => {
    setFlashDecks(prev => [...prev, { ...deck, id: generateId(), cards: deck.cards || [], createdAt: new Date().toISOString() }]);
  }, []);

  const updateFlashDeck = useCallback((id, updates) => {
    setFlashDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const deleteFlashDeck = useCallback((id) => {
    setFlashDecks(prev => prev.filter(d => d.id !== id));
  }, []);

  const addMealPlan = useCallback((plan) => {
    setMealPlans(prev => [{ ...plan, id: generateId(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const value = {
    user, authLoading, signIn, signUp, signOut,
    profile, setProfile,
    meals, addMeal, removeMeal, todayMeals, todayCalories, today,
    workouts, logWorkout, todayWorkouts, workoutDates,
    bloodTests, addBloodTest,
    gutScores, updateGutScore, todayGutScores,
    steps, logSteps, todaySteps,
    vitaminLog, toggleVitamin, todayVitamins,
    savedContent, addContent, removeContent, updateContent,
    notes, addNote, updateNote, deleteNote,
    flashDecks, addFlashDeck, updateFlashDeck, deleteFlashDeck,
    mealPlans, addMealPlan,

    posts, setPosts,
    friends, setFriends,
    coStreaks, setCoStreaks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
