import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

// Create a context for Community data
const CommunityContext = createContext();

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}

export function CommunityProvider({ children }) {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Communities
      const { data: commData, error: commError } = await supabase
        .from('communities')
        .select('*');
      if (commError) console.error('Supabase fetch communities error', commError);
      else setCommunities(commData);

      // Posts
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*');
      if (postError) console.error('Supabase fetch posts error', postError);
      else setPosts(postData);
    };
    fetchData();
  }, []);

  const value = {
    communities,
    posts,
    selectedCommunity,
    setSelectedCommunity,
    setPosts,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}
