// scripts/seedCommunityHub.js
// Run with: node scripts/seedCommunityHub.js

import { supabase } from '../src/supabaseClient.js';

async function seed() {
  // Sample users
  const users = [
    { email: 'alice@example.com', username: 'Alice', avatar_url: '' },
    { email: 'bob@example.com', username: 'Bob', avatar_url: '' },
    { email: 'charlie@example.com', username: 'Charlie', avatar_url: '' },
  ];

  // Insert users if they don't exist
  for (const u of users) {
    const { data: existing } = await supabase.from('users').select('id').eq('email', u.email).single();
    if (!existing) {
      await supabase.from('users').insert({ email: u.email, username: u.username, avatar_url: u.avatar_url });
    }
  }

  // Sample communities
  const communities = [
    { name: 'Tech Talk', description: 'Latest tech trends and discussions.', tag: 'tech' },
    { name: 'Gaming Guild', description: 'Game news, streams, and events.', tag: 'gaming' },
    { name: 'Fitness Zone', description: 'Workout tips and health advice.', tag: 'fitness' },
    { name: 'Business Hub', description: 'Entrepreneurship and finance.', tag: 'business' },
    { name: 'Education Corner', description: 'Learning resources and study groups.', tag: 'education' },
    { name: 'Crypto Circle', description: 'Blockchain and crypto talks.', tag: 'crypto' },
    { name: 'Health & Wellness', description: 'Mental and physical health.', tag: 'health' },
    { name: 'General Chat', description: 'Open discussion for anything.', tag: 'general' },
  ];

  for (const c of communities) {
    const { data: exists } = await supabase.from('communities').select('id').eq('name', c.name).single();
    if (!exists) {
      await supabase.from('communities').insert({ name: c.name, description: c.description, tag: c.tag });
    }
  }

  // Sample posts (3 per community)
// Fetch community IDs safely
  const { data: commListRaw, error: commErr } = await supabase.from('communities').select('id');
  if (commErr) {
    console.error('Error fetching communities:', commErr);
    return;
  }
  const commList = commListRaw || []; // ensure iterable

  const postContents = [
    'Welcome to the community! Share your thoughts.',
    'Check out the latest updates and let us know what you think.',
    'Looking for recommendations? Ask here!'
  ];

  for (const comm of commList) {
    for (let i = 0; i < 3; i++) {
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('community_id', comm.id)
        .eq('content', postContents[i])
        .single();
      if (!existing) {
        await supabase.from('posts').insert({
          community_id: comm.id,
          author: users[i % users.length].username,
          content: postContents[i],
          likes: Math.floor(Math.random() * 10),
        });
      }
    }
  }

  console.log('Seeding complete.');
}

seed().catch((e) => console.error('Seeding error:', e));
