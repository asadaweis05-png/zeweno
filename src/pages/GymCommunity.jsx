import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AdUnit from '../components/common/AdUnit';
import { calculateStreak } from '../utils/calculations';
import {
  Flame, Heart, MessageCircle, Share2, Camera, Send, Users,
  Trophy, Image, Plus, X, ChevronRight, Dumbbell, Zap,
  Hash, Globe, Lock, UserPlus, Search, MoreHorizontal, Bookmark,
  UserCheck, Link2
} from 'lucide-react';

/* ─── Demo seed data ─── */
const SEED_POSTS = [
  {
    id: 'p1',
    user: { name: 'Alex Rivera', handle: '@alexfitness', avatar: '💪', badge: 'Elite' },
    time: '2m ago',
    content: 'PR today! 🏋️ Benched 120kg for the first time. Never stop pushing. The grind doesn\'t lie.',
    image: null,
    workout: { type: 'Bench Press', weight: '120kg', sets: 5, reps: 3 },
    streak: 47,
    likes: 234,
    comments: 18,
    liked: false,
    saved: false,
    sharedPartner: null,
  },
  {
    id: 'p2',
    user: { name: 'Mia Chen', handle: '@miafitlife', avatar: '🔥', badge: 'Warrior' },
    time: '15m ago',
    content: 'Morning gym session done before 6am ☀️ Starting the week strong! Who else is grinding early?',
    image: 'gym-selfie',
    workout: null,
    streak: 23,
    likes: 189,
    comments: 42,
    liked: true,
    saved: true,
    sharedPartner: { name: 'Alex Rivera', handle: '@alexfitness', avatar: '💪', streak: 47 },
  },
  {
    id: 'p3',
    user: { name: 'Jordan Blake', handle: '@jordanlifts', avatar: '🦁', badge: 'Beast' },
    time: '1h ago',
    content: '5am club checking in 🌅 Leg day is the worst but skipping is not an option. Pain is temporary, gains are forever!',
    image: null,
    workout: { type: 'Squat', weight: '140kg', sets: 4, reps: 8 },
    streak: 92,
    likes: 412,
    comments: 67,
    liked: false,
    saved: false,
    sharedPartner: null,
  },
  {
    id: 'p4',
    user: { name: 'Priya Sharma', handle: '@priyastrong', avatar: '⚡', badge: 'Champion' },
    time: '3h ago',
    content: 'Recovery day but still hit the foam roller and mobility work. Progress is a marathon, not a sprint 🧘‍♀️',
    image: null,
    workout: null,
    streak: 61,
    likes: 156,
    comments: 23,
    liked: false,
    saved: false,
    sharedPartner: null,
  },
];

const GROUPS = [
  { id: 'g1', name: 'Powerlifting Club', members: 1240, icon: '🏋️', active: true },
  { id: 'g2', name: 'Morning Warriors', members: 876, icon: '🌅', active: false },
  { id: 'g3', name: 'Calisthenics Crew', members: 543, icon: '🤸', active: false },
  { id: 'g4', name: 'Nutrition Nerds', members: 2100, icon: '🥗', active: false },
];

const CHAT_MSGS = [
  { id: 1, user: 'Alex', text: 'Anyone else doing 5/3/1 program?', time: '10:02' },
  { id: 2, user: 'Mia', text: 'Yes! Week 3 right now. Love it 🔥', time: '10:04' },
  { id: 3, user: 'Jordan', text: 'I prefer PHUL but both are great', time: '10:07' },
  { id: 4, user: 'Priya', text: 'What\'s everyone\'s calorie target today?', time: '10:12' },
  { id: 5, user: 'Alex', text: '3500 for me, bulk season 💪', time: '10:13' },
];

const BADGE_COLORS = {
  Elite: 'var(--accent-cyan)',
  Warrior: 'var(--accent-purple)',
  Beast: 'var(--accent-amber)',
  Champion: 'var(--neon-green)',
};

const GYM_IMAGES = [
  { emoji: '🏋️', bg: 'linear-gradient(135deg, #1a0533 0%, #2d1054 50%, #0d0d1a 100%)', label: 'Heavy Session' },
  { emoji: '🌅', bg: 'linear-gradient(135deg, #1a0033 0%, #ff6b35 50%, #1a0033 100%)', label: 'Morning Grind' },
  { emoji: '💪', bg: 'linear-gradient(135deg, #001a33 0%, #00b4ff 50%, #001a33 100%)', label: 'Arm Day' },
];

export default function GymCommunity() {
  const {
    workoutDates,
    profile,
    posts,
    setPosts,
    friends,
    setFriends,
    coStreaks,
    setCoStreaks,
    todayWorkouts,
    workouts
  } = useApp();
  const streak = calculateStreak(workoutDates);

  const [activeTab, setActiveTab] = useState('feed'); // feed | groups | chat
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState(CHAT_MSGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedPartner, setSelectedPartner] = useState('');

  const [attachedWorkout, setAttachedWorkout] = useState(null);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [selectorMode, setSelectorMode] = useState('workout'); // workout | pr

  const [toastMessage, setToastMessage] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // Compute Personal Records (PRs) from workouts history
  const allWorkoutsList = Object.values(workouts || {}).flat();
  const prsMap = {};
  allWorkoutsList.forEach(w => {
    if (w.weight && (!prsMap[w.exercise] || w.weight > prsMap[w.exercise].weight)) {
      prsMap[w.exercise] = w;
    }
  });
  const prsList = Object.values(prsMap);

  const currentHandle = `@${(profile.name || 'you').toLowerCase().replace(/\s/g, '')}`;

  function triggerToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  }

  function handleDeletePost(postId) {
    if (window.confirm('Miyaad xaqiijinaysaa inaad tirtirto qoraalkan?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      triggerToast('Qoraalka waa la tirtiray! 🗑️');
    }
  }

  function handleSharePost(post) {
    const postLink = `https://zeweno.com/post/${post.id}`;
    navigator.clipboard.writeText(postLink).then(() => {
      triggerToast('Link-ga qoraalka waa la koobiyeeyay! 🔗');
    }).catch(() => {
      triggerToast('Lala koobiyeeyay! 🔗');
    });
  }

  function handleAddComment(postId) {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const existingComments = Array.isArray(p.comments) ? p.comments : [];
        const newComment = {
          id: `c${Date.now()}`,
          user: {
            name: profile.name || 'You',
            handle: currentHandle,
            avatar: '🏃'
          },
          time: 'Just now',
          text: text
        };
        return {
          ...p,
          comments: [...existingComments, newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    triggerToast('Faalladaada waa la daray! 💬');
  }

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  function handleLike(id) {
    setPosts(p => p.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  }

  function handleSave(id) {
    setPosts(p => p.map(post =>
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
  }

  function toggleFriend(handle, name, avatar, partnerStreak) {
    if (friends.includes(handle)) {
      setFriends(prev => prev.filter(f => f !== handle));
      setCoStreaks(prev => prev.filter(c => c.handle !== handle));
    } else {
      setFriends(prev => [...prev, handle]);
      setCoStreaks(prev => [...prev, { handle, name, avatar, streak: partnerStreak }]);
    }
  }

  function handlePost() {
    if (!postText.trim()) return;

    let partnerInfo = null;
    if (selectedPartner) {
      // Find buddy from posts or coStreaks
      const match = posts.find(p => p.user.handle === selectedPartner) || 
                    coStreaks.find(c => c.handle === selectedPartner);
      if (match) {
        partnerInfo = {
          name: match.user?.name || match.name,
          handle: match.user?.handle || match.handle,
          avatar: match.user?.avatar || match.avatar,
          streak: match.streak || match.user?.streak || 1
        };
      }
    }

    const newPost = {
      id: `p${Date.now()}`,
      user: {
        name: profile.name || 'You',
        handle: `@${(profile.name || 'you').toLowerCase().replace(/\s/g, '')}`,
        avatar: '🏃',
        badge: streak >= 30 ? 'Elite' : streak >= 14 ? 'Warrior' : 'Member'
      },
      time: 'Just now',
      content: postText,
      image: postImage,
      workout: attachedWorkout,
      streak,
      likes: 0,
      comments: [],
      liked: false,
      saved: false,
      sharedPartner: partnerInfo
    };
    setPosts(p => [newPost, ...p]);
    setPostText('');
    setPostImage(null);
    setSelectedPartner('');
    setAttachedWorkout(null);
    setShowPostModal(false);
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPostImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSendChat() {
    if (!chatInput.trim()) return;
    setChatMessages(m => [...m, {
      id: Date.now(),
      user: profile.name || 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatInput('');
  }

  const filteredPosts = posts.filter(p =>
    !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-slide-up gym-community">
      {/* Header */}
      <div className="community-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Gym Community
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            Connect · Share · Motivate
          </p>
        </div>
        <div className="community-header-actions">
          <button className="btn btn-primary community-post-btn" onClick={() => setShowPostModal(true)}>
            <Camera size={18} /> Share Moment
          </button>
        </div>
      </div>

      {/* My Streak Card */}
      <div className="streak-showcase-card glass-card glow-purple">
        <div className="streak-showcase-left">
          <div className="streak-fire-mega">🔥</div>
          <div>
            <div className="streak-big-num">{streak}</div>
            <div className="streak-big-label">Day Streak</div>
          </div>
        </div>
        <div className="streak-showcase-mid">
          <div className="streak-progress-track">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`streak-pip ${i < Math.min(streak % 7 || 7, 7) ? 'filled' : ''}`}
              ></div>
            ))}
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {streak > 0 ? `${7 - (streak % 7 || 7)} days to next milestone` : 'Start your streak today!'}
          </div>
        </div>
        <div className="streak-showcase-right">
          {streak >= 7 && <span className="streak-badge streak-badge-gold">🏅 Week Warrior</span>}
          {streak >= 30 && <span className="streak-badge streak-badge-diamond">💎 Month Master</span>}
          {streak >= 100 && <span className="streak-badge streak-badge-legend">🌟 Legend</span>}
          {streak === 0 && <span className="streak-badge streak-badge-start">🚀 Just Start!</span>}
        </div>
      </div>

      <AdUnit format="horizontal" className="ad-dashboard" />

      {/* Tabs */}
      <div className="community-tabs">
        {[
          { id: 'feed', icon: Globe, label: 'Feed' },
          { id: 'groups', icon: Users, label: 'Groups' },
          { id: 'chat', icon: MessageCircle, label: 'Chat' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`community-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── FEED ── */}
      {activeTab === 'feed' && (
        <div className="community-grid-layout">
          {/* Left Column: Post Feed */}
          <div className="posts-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Search */}
            <div className="community-search-bar" style={{ marginBottom: '0.5rem' }}>
              <Search size={16} className="search-icon-abs" />
              <input
                className="form-input community-search-input"
                placeholder="Search posts, athletes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredPosts.length === 0 ? (
              <div className="glass-card empty-state animate-slide-up" style={{ padding: '3.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', border: '1px dashed var(--card-border)', background: 'rgba(3, 10, 22, 0.4)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 240, 255, 0.15)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.05)' }}>
                  <Users size={32} className="text-accent-cyan" style={{ filter: 'drop-shadow(0 0 4px var(--accent-cyan))' }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>Feed-ka waa maran yahay</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
                  Miyayna jirin wax daqiiqad ah oo la wadaagay wali? Noqo qofka ugu horreeya ee wadaaga tababarkiisa iyo guulihiisa!
                </p>
                <button className="btn btn-primary" onClick={() => setShowPostModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, padding: '0.65rem 1.25rem' }}>
                  <Camera size={16} /> Wadaag Moment-kaagii
                </button>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="community-post glass-card">
                  {/* Post header */}
                  <div className="post-header">
                    <div className="post-avatar">{post.user.avatar}</div>
                    <div className="post-user-info">
                      <div className="post-username">
                        {post.user.name}
                        <span
                          className="post-badge"
                          style={{ background: BADGE_COLORS[post.user.badge] || 'var(--accent-cyan)' }}
                        >
                          {post.user.badge}
                        </span>
                      </div>
                      <div className="post-meta">
                        {post.user.handle} · {post.time}
                        {post.streak > 0 && (
                          <span className="post-streak">
                            <Flame size={12} /> {post.streak}d
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add Buddy / Friends Button */}
                    {post.user.handle !== `@${(profile.name || 'you').toLowerCase().replace(/\s/g, '')}` && (
                      <button
                        onClick={() => toggleFriend(post.user.handle, post.user.name, post.user.avatar, post.streak || 1)}
                        className={`btn btn-sm ${friends.includes(post.user.handle) ? 'btn-secondary' : 'btn-primary'}`}
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginRight: '0.5rem',
                          background: friends.includes(post.user.handle) ? 'rgba(0, 240, 255, 0.1)' : '',
                          borderColor: friends.includes(post.user.handle) ? 'var(--accent-cyan)' : '',
                          color: friends.includes(post.user.handle) ? 'var(--accent-cyan)' : ''
                        }}
                      >
                        {friends.includes(post.user.handle) ? (
                          <>
                            <UserCheck size={13} />
                            <span>Buddy</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}

                    {post.user.handle === currentHandle ? (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="icon-btn" 
                        style={{ color: 'var(--accent-red)', padding: '0.375rem', borderRadius: 'var(--radius-md)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button className="icon-btn post-more-btn">
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                  </div>

                {/* Shared Streak Partner Banner */}
                {post.sharedPartner && (
                  <div
                    className="glass-card co-streak-banner"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(168, 85, 247, 0.08))',
                      border: '1px dashed rgba(0, 240, 255, 0.3)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '0.875rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="post-avatar" style={{ width: '28px', height: '28px', minWidth: '28px', fontSize: '0.85rem', zIndex: 2, margin: 0 }}>{post.user.avatar}</div>
                      <div className="post-avatar" style={{ width: '28px', height: '28px', minWidth: '28px', fontSize: '0.85rem', marginLeft: '-0.4rem', zIndex: 1, margin: 0, boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)' }}>{post.sharedPartner.avatar}</div>
                    </div>
                    <div style={{ flex: 1, fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        Co-Streak: {post.user.name.split(' ')[0]} & {post.sharedPartner.name.split(' ')[0]}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Link2 size={11} className="text-accent" /> Shared workout partners • Combined {post.streak + post.sharedPartner.streak} days active!
                      </div>
                    </div>
                    <div className="post-streak" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      <Flame size={14} /> {post.streak + post.sharedPartner.streak}d
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="post-content">{post.content}</div>

                {/* Workout badge */}
                {post.workout && (
                  post.workout.isPR ? (
                    <div className="post-workout-tag pr-tag" style={{
                      background: 'rgba(255, 179, 0, 0.08)',
                      border: '1px solid rgba(255, 179, 0, 0.25)',
                      color: 'var(--accent-amber)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.875rem',
                      marginBottom: '0.875rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}>
                      <Trophy size={14} className="text-accent-amber" />
                      <span>PR Set: {post.workout.type}</span>
                      <span className="badge badge-amber" style={{ background: 'rgba(255, 179, 0, 0.15)', color: 'var(--accent-amber)', borderColor: 'rgba(255, 179, 0, 0.3)' }}>{post.workout.weight}</span>
                      <span className="badge badge-cyan" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>{post.workout.sets}×{post.workout.reps}</span>
                    </div>
                  ) : (
                    <div className="post-workout-tag">
                      <Dumbbell size={14} />
                      <span>{post.workout.type}</span>
                      <span className="badge badge-purple">{post.workout.weight}</span>
                      <span className="badge badge-cyan">{post.workout.sets}×{post.workout.reps}</span>
                    </div>
                  )
                )}

                {/* Image placeholder */}
                {post.image === 'gym-selfie' && (
                  <div className="post-image-placeholder">
                    <div
                      className="post-image-placeholder-inner"
                      style={{ background: GYM_IMAGES[1].bg }}
                    >
                      <span style={{ fontSize: '3rem' }}>{GYM_IMAGES[1].emoji}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>{GYM_IMAGES[1].label}</span>
                    </div>
                  </div>
                )}

                {post.image && post.image !== 'gym-selfie' && (
                  <div className="post-image-wrapper">
                    <img src={post.image} alt="gym" className="post-image" />
                  </div>
                )}

                {/* Actions */}
                <div className="post-actions">
                  <button
                    className={`post-action-btn ${post.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} fillOpacity={post.liked ? 1 : 0} />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    className={`post-action-btn ${activeCommentsPostId === post.id ? 'active' : ''}`}
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    style={{ color: activeCommentsPostId === post.id ? 'var(--accent-cyan)' : '' }}
                  >
                    <MessageCircle size={18} />
                    <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                  </button>
                  <button className="post-action-btn" onClick={() => handleSharePost(post)}>
                    <Share2 size={18} />
                  </button>
                  <button
                    className={`post-action-btn ml-auto ${post.saved ? 'saved' : ''}`}
                    onClick={() => handleSave(post.id)}
                  >
                    <Bookmark size={18} fill={post.saved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentsPostId === post.id && (
                  <div className="comments-section glass-card animate-slide-up" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageCircle size={14} className="text-accent-cyan" />
                      Faallooyinka ({Array.isArray(post.comments) ? post.comments.length : 0})
                    </h4>

                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                      {(Array.isArray(post.comments) ? post.comments : []).length === 0 ? (
                        <p className="text-secondary" style={{ fontSize: '0.8rem', margin: 0, textAlign: 'center', padding: '1rem 0' }}>
                          Miyayna jirin wax faallo ah? Noqo qofka ugu horreeya!
                        </p>
                      ) : (
                        (post.comments || []).map((comment, cIdx) => (
                          <div key={comment.id || cIdx} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                            <div className="post-avatar" style={{ width: '26px', height: '26px', minWidth: '26px', fontSize: '0.75rem', margin: 0 }}>
                              {comment.user.avatar}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{comment.user.name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{comment.user.handle}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>{comment.time}</span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.4, wordBreak: 'break-word' }}>
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Input */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        className="form-input"
                        placeholder="Qor faallo..."
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem', flex: 1, background: 'var(--bg-deep)' }}
                      />
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!(commentInputs[post.id]?.trim())}
                        style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )))}
          </div>

          {/* Right Column: Gym Buddies & Streaks Widget */}
          <div className="buddies-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Buddies Card */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} className="text-accent" /> Gym Buddies ({friends.length})
              </h3>
              {friends.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.825rem', margin: 0, lineHieght: 1.4 }}>
                  Click "Add" on any athlete's post to add them as your gym buddy!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {coStreaks.map(buddy => (
                    <div key={buddy.handle} className="buddy-item animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="buddy-avatar-wrap">
                        <div className="post-avatar" style={{ width: '34px', height: '34px', minWidth: '34px', fontSize: '0.95rem', margin: 0 }}>{buddy.avatar}</div>
                        <span className="online-status-dot"></span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{buddy.name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{buddy.handle}</div>
                      </div>
                      <div className="post-streak" style={{ fontSize: '0.8rem' }}>
                        <Flame size={12} /> {buddy.streak}d
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Co-Streaks Card */}
            <div className="glass-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(168, 85, 247, 0.05))', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={18} style={{ color: 'var(--accent-amber)' }} /> Shared Co-Streaks
              </h3>
              {coStreaks.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.825rem', margin: 0 }}>
                  Share streaks by tagging buddies in your next post!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {coStreaks.map(streakItem => (
                    <div key={streakItem.handle} className="animate-slide-up" style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        <span>You & {streakItem.name.split(' ')[0]}</span>
                        <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '2px' }}>🔗 Linked</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="text-secondary" style={{ fontSize: '0.65rem' }}>Combined Streak</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                          <Flame size={12} /> {streak + streakItem.streak} Days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── GROUPS ── */}
      {activeTab === 'groups' && (
        <div className="community-groups">
          <div className="groups-header">
            <h3 style={{ margin: 0 }}>Gym Groups</h3>
            <button className="btn btn-primary btn-sm">
              <Plus size={16} /> Create Group
            </button>
          </div>

          {GROUPS.map(group => (
            <div
              key={group.id}
              className={`group-card glass-card ${activeGroup.id === group.id ? 'group-card-active' : ''}`}
              onClick={() => setActiveGroup(group)}
            >
              <div className="group-icon">{group.icon}</div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-members">
                  <Users size={12} /> {group.members.toLocaleString()} members
                </div>
              </div>
              <div className="group-actions">
                {activeGroup.id === group.id ? (
                  <span className="badge badge-cyan">Joined</span>
                ) : (
                  <button className="btn btn-secondary btn-sm">
                    <UserPlus size={14} /> Join
                  </button>
                )}
                <ChevronRight size={18} className="text-muted" />
              </div>
            </div>
          ))}

          {/* Active group feed preview */}
          <div className="group-feed-preview glass-card mt-lg">
            <div className="flex-between mb-md">
              <h4 style={{ margin: 0 }}>
                {activeGroup.icon} {activeGroup.name}
              </h4>
              <span className="badge badge-green">
                <Zap size={10} /> Active Now
              </span>
            </div>
            <div className="group-post-list">
              {posts.slice(0, 2).map(post => (
                <div key={post.id} className="group-post-item">
                  <span className="group-post-avatar">{post.user.avatar}</span>
                  <div>
                    <span className="group-post-username">{post.user.name}</span>
                    <p className="text-secondary" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                      {post.content.slice(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdUnit format="auto" className="ad-page-bottom" />
        </div>
      )}

      {/* ── CHAT ── */}
      {activeTab === 'chat' && (
        <div className="community-chat">
          <div className="chat-group-list">
            {GROUPS.map(g => (
              <button
                key={g.id}
                className={`chat-group-pill ${activeGroup.id === g.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(g)}
              >
                {g.icon} {g.name}
              </button>
            ))}
          </div>

          <div className="chat-window glass-card">
            <div className="chat-header">
              <div className="chat-header-left">
                <span className="chat-group-emoji">{activeGroup.icon}</span>
                <div>
                  <div className="chat-group-title">{activeGroup.name}</div>
                  <div className="chat-group-online">
                    <span className="online-dot"></span>
                    {activeGroup.members.toLocaleString()} members • 42 online
                  </div>
                </div>
              </div>
              <Hash size={18} className="text-muted" />
            </div>

            <div className="chat-messages">
              {chatMessages.map(msg => {
                const isMe = msg.user === (profile.name || 'You');
                return (
                  <div key={msg.id} className={`chat-message ${isMe ? 'chat-message-me' : ''}`}>
                    {!isMe && <div className="chat-avatar">{msg.user[0]}</div>}
                    <div className="chat-bubble-wrap">
                      {!isMe && <div className="chat-sender">{msg.user}</div>}
                      <div className={`chat-bubble ${isMe ? 'chat-bubble-me' : ''}`}>
                        {msg.text}
                      </div>
                      <div className="chat-time">{msg.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-row">
              <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
                <Image size={20} />
              </button>
              <input
                className="form-input chat-input"
                placeholder={`Message ${activeGroup.name}...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              />
              <button className="btn btn-primary chat-send-btn" onClick={handleSendChat}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Modal ── */}
      {showPostModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPostModal(false)}>
          <div className="post-modal glass-card animate-slide-up">
            <div className="post-modal-header">
              <h3 style={{ margin: 0 }}>Share Your Moment 💪</h3>
              <button className="icon-btn" onClick={() => setShowPostModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="post-modal-user">
              <div className="post-avatar">🏃</div>
              <div>
                <div style={{ fontWeight: 600 }}>{profile.name || 'You'}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="badge badge-cyan"><Globe size={10} /> Public</span>
                  {streak > 0 && <span className="badge badge-purple"><Flame size={10} /> {streak}d streak</span>}
                </div>
              </div>
            </div>

            <textarea
              className="post-text-area"
              placeholder="How was your workout? Share your energy! 🔥"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              rows={4}
            />

            {postImage && (
              <div className="post-image-preview">
                <img src={postImage} alt="preview" />
                <button className="remove-image-btn" onClick={() => setPostImage(null)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Streak auto-share */}
            {streak > 0 && (
              <div className="streak-share-badge" style={{ marginBottom: '0.75rem' }}>
                <Flame size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Auto-attaching your <strong>{streak}-day streak</strong> badge 🏆</span>
              </div>
            )}

             {/* Buddy Partner Selector */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Workout Partner (Co-Streak)
              </label>
              <select
                className="form-input"
                style={{ width: '100%', padding: '0.65rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                value={selectedPartner}
                onChange={e => setSelectedPartner(e.target.value)}
              >
                <option value="">None (Train alone)</option>
                {coStreaks.map(buddy => (
                  <option key={buddy.handle} value={buddy.handle}>
                    {buddy.avatar} {buddy.name} ({buddy.streak}d streak)
                  </option>
                ))}
              </select>
            </div>

            {/* Attached Workout Preview */}
            {attachedWorkout && (
              <div className="glass-card animate-slide-up" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1rem',
                marginBottom: '1.25rem',
                border: attachedWorkout.isPR ? '1px dashed var(--accent-amber)' : '1px dashed var(--accent-cyan)',
                background: attachedWorkout.isPR ? 'rgba(255, 179, 0, 0.05)' : 'rgba(0, 240, 255, 0.05)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {attachedWorkout.isPR ? (
                    <Trophy size={16} className="text-accent-amber" />
                  ) : (
                    <Dumbbell size={16} className="text-accent-cyan" />
                  )}
                  <div style={{ fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {attachedWorkout.isPR ? 'PR Attached' : 'Workout Attached'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span>{attachedWorkout.type}</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>{attachedWorkout.sets} sets</span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>{attachedWorkout.reps} reps</span>
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>{attachedWorkout.weight}</span>
                    </div>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => setAttachedWorkout(null)} style={{ padding: '4px' }}>
                  <X size={14} style={{ color: 'var(--accent-red)' }} />
                </button>
              </div>
            )}

            {/* Workout Selector Overlay */}
            {showWorkoutSelector && (
              <div className="workout-selector-overlay glass-card animate-fade-in" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--bg-deep)',
                zIndex: 10,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selectorMode === 'workout' ? (
                      <><Dumbbell size={18} className="text-accent-cyan" /> Select Today's Workout</>
                    ) : (
                      <><Trophy size={18} className="text-accent-amber" /> Select Personal Record</>
                    )}
                  </h3>
                  <button className="icon-btn" onClick={() => setShowWorkoutSelector(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '4px' }}>
                  {selectorMode === 'workout' ? (
                    todayWorkouts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <Dumbbell size={32} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-cyan)' }} />
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No exercises logged today yet</p>
                        <p style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>Go to the <strong>Training & Streaks</strong> section to log workouts, then come back here to share them!</p>
                      </div>
                    ) : (
                      todayWorkouts.map((w, idx) => (
                        <div
                          key={w.id || idx}
                          className="list-item"
                          style={{ cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                          onClick={() => {
                            setAttachedWorkout({
                              type: w.exercise,
                              weight: `${w.weight}kg`,
                              sets: w.sets,
                              reps: w.reps,
                              muscleGroup: w.muscleGroup,
                              isPR: false
                            });
                            setShowWorkoutSelector(false);
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{w.exercise}</div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {w.sets > 0 && <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{w.sets} sets</span>}
                              {w.reps > 0 && <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{w.reps} reps</span>}
                              {w.weight > 0 && <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{w.weight} kg</span>}
                            </div>
                          </div>
                          <span className="badge badge-green" style={{ fontSize: '0.65rem', alignSelf: 'center' }}>{w.muscleGroup}</span>
                        </div>
                      ))
                    )
                  ) : (
                    prsList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <Trophy size={32} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-amber)' }} />
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No Personal Records yet</p>
                        <p style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>Log exercises with weights in the <strong>Training</strong> page to build your record board!</p>
                      </div>
                    ) : (
                      prsList.map((w, idx) => (
                        <div
                          key={w.id || idx}
                          className="list-item"
                          style={{ cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                          onClick={() => {
                            setAttachedWorkout({
                              type: w.exercise,
                              weight: `${w.weight}kg`,
                              sets: w.sets || 1,
                              reps: w.reps || 1,
                              muscleGroup: w.muscleGroup,
                              isPR: true
                            });
                            setShowWorkoutSelector(false);
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Trophy size={14} /> {w.exercise}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                              {w.weight > 0 && <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Record: {w.weight} kg</span>}
                            </div>
                          </div>
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem', alignSelf: 'center' }}>{w.muscleGroup}</span>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            )}

            <div className="post-modal-actions">
              <div className="post-modal-media">
                <button className="media-btn" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={18} /> Photo
                </button>
                <button className="media-btn" onClick={() => { setSelectorMode('workout'); setShowWorkoutSelector(true); }}>
                  <Dumbbell size={18} /> Workout
                </button>
                <button className="media-btn" onClick={() => { setSelectorMode('pr'); setShowWorkoutSelector(true); }}>
                  <Trophy size={18} /> PR
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={handlePost}
                disabled={!postText.trim()}
              >
                Post <Zap size={16} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="glass-card animate-slide-up" style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(3, 10, 22, 0.95)',
          border: '1px solid var(--accent-cyan)',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)',
          zIndex: 99999,
          color: 'var(--text-main)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'none'
        }}>
          <Zap size={16} className="text-accent-cyan" style={{ filter: 'drop-shadow(0 0 4px var(--accent-cyan))' }} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
