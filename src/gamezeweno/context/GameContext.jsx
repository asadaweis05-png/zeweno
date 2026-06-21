// src/context/GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ARTICLES, MOCK_ACCOUNTS, MOCK_GIVEAWAYS, GAMING_STATS } from '../services/gameData';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [stats, setStats] = useState(GAMING_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data load
    const timer = setTimeout(() => {
      setArticles(MOCK_ARTICLES);
      setAccounts(MOCK_ACCOUNTS);
      setGiveaways(MOCK_GIVEAWAYS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const getArticleBySlug = (slug) => articles.find(a => a.slug === slug);
  const getAccountById = (id) => accounts.find(a => a.id === id);
  const getArticlesByCategory = (category) =>
    category === 'All' ? articles : articles.filter(a => a.category === category);
  const getFeaturedArticles = () => articles.filter(a => a.featured);
  const getFeaturedAccounts = () => accounts.filter(a => a.featured);
  const getActiveGiveaways = () => giveaways.filter(g => g.status === 'active');

  return (
    <GameContext.Provider value={{
      articles, accounts, giveaways, stats, loading,
      getArticleBySlug, getAccountById, getArticlesByCategory,
      getFeaturedArticles, getFeaturedAccounts, getActiveGiveaways,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
