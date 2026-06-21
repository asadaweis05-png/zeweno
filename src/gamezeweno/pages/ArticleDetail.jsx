// src/pages/ArticleDetail.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, ArrowLeft, Share2, MessageCircle, Link2, Tag, ChevronRight } from 'lucide-react';

const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import ReadingProgress from '../components/ReadingProgress';
import { useGame } from '../context/GameContext';

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function ShareButton({ icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold font-body transition-all duration-200"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}25`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}15`; }}
    >
      {icon} {label}
    </button>
  );
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { getArticleBySlug, articles, loading } = useGame();
  const navigate = useNavigate();
  const article = getArticleBySlug(slug);
  const related = articles.filter(a => a.slug !== slug && a.category === article?.category).slice(0, 3);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const share = (type) => {
    const url = window.location.href;
    const text = encodeURIComponent(article?.title || '');
    if (type === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    if (type === 'whatsapp') window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, '_blank');
    if (type === 'copy') { navigator.clipboard.writeText(url); }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 container-gaming">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-32 skeleton rounded" />
        <div className="h-12 skeleton rounded" />
        <div className="h-64 skeleton rounded-xl" />
        <div className="space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="h-4 skeleton rounded" style={{ width: `${85 + Math.random() * 15}%` }} />)}</div>
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-gaming font-bold text-text-secondary mb-4">Article Not Found</h2>
        <Link to="/gamezeweno/news" className="btn-secondary">← Back to News</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      <ReadingProgress />

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 container-gaming pb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white text-sm font-body mb-4 transition-colors">
            <ArrowLeft size={15} /> Back to News
          </button>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge-${article.category.includes('PUBG') ? 'purple' : article.category.includes('Leak') ? 'red' : 'blue'}`}>{article.category}</span>
            {article.featured && <span className="badge-green">Featured</span>}
          </div>
          <h1 className="text-2xl md:text-4xl font-gaming font-black text-white leading-tight max-w-3xl">{article.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container-gaming py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <img src={article.author_avatar} alt="" className="w-9 h-9 rounded-full border-2 border-neon-blue/30" />
                <div>
                  <p className="text-sm font-semibold font-body text-white">{article.author}</p>
                  <p className="text-xs text-text-muted font-body">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted font-body">
                <span className="flex items-center gap-1"><Clock size={12} />{article.read_time} min read</span>
                <span className="flex items-center gap-1"><Eye size={12} />{article.views.toLocaleString()} views</span>
                <span>{timeAgo(article.published_at)}</span>
              </div>
            </div>

            {/* Article Body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose-gaming mb-8"
              style={{ color: '#C0C0C0', fontFamily: 'Exo 2, Inter, sans-serif', lineHeight: '1.85' }}
            >
              {article.content.split('\n\n').map((block, i) => {
                if (block.startsWith('**') && block.endsWith('**')) {
                  return <h3 key={i} className="text-lg font-gaming font-bold text-white mt-6 mb-3" style={{ color: '#00CFFF' }}>{block.replace(/\*\*/g, '')}</h3>;
                }
                if (block.startsWith('-')) {
                  const items = block.split('\n').filter(l => l.startsWith('- '));
                  return (
                    <ul key={i} className="space-y-2 my-4 pl-4">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#A0A0A0' }}>
                          <span className="text-neon-blue mt-1 shrink-0">▸</span>
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="mb-4 text-sm leading-loose">{block}</p>;
              })}
            </motion.div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Tag size={14} className="text-text-muted mt-0.5" />
              {article.tags?.map(tag => (
                <span key={tag} className="badge-blue text-xs cursor-pointer hover:bg-neon-blue/20 transition-colors">#{tag}</span>
              ))}
            </div>

            {/* Share */}
            <div className="p-5 gaming-card mb-8">
              <p className="text-sm font-semibold font-body text-text-secondary mb-3 flex items-center gap-2">
                <Share2 size={15} /> Share this article
              </p>
              <div className="flex flex-wrap gap-2">
                <ShareButton icon={<TwitterIcon size={14} />} label="Twitter" onClick={() => share('twitter')} color="#1DA1F2" />
                <ShareButton icon={<MessageCircle size={14} />} label="WhatsApp" onClick={() => share('whatsapp')} color="#25D366" />
                <ShareButton icon={<Link2 size={14} />} label="Copy Link" onClick={() => share('copy')} color="#00CFFF" />
              </div>
            </div>

            {/* Comments Placeholder */}
            <div className="gaming-card p-6">
              <h3 className="font-gaming font-bold text-white mb-4">Comments</h3>
              <div className="input-gaming p-4 h-24 flex items-start text-text-muted text-sm cursor-text rounded-lg mb-3" style={{ background: '#111' }}>
                Share your thoughts on this article...
              </div>
              <button className="btn-primary text-sm"><span>Post Comment</span></button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="gaming-card p-5">
              <h4 className="font-gaming font-bold text-sm gradient-text mb-4">Related Articles</h4>
              <div className="space-y-4">
                {related.map(rel => (
                  <Link key={rel.id} to={`/gamezeweno/news/${rel.slug}`} className="group flex gap-3">
                    <img src={rel.thumbnail} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0" />
                    <div>
                      <p className="text-xs font-semibold font-body text-text-secondary group-hover:text-neon-blue transition-colors line-clamp-2">{rel.title}</p>
                      <p className="text-xs text-text-muted font-body mt-1 flex items-center gap-1"><Clock size={9} />{rel.read_time}m</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="gaming-card p-5" style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.06), rgba(122,92,255,0.06))' }}>
              <h4 className="font-gaming font-bold text-sm text-neon-green mb-2">🎁 Active Giveaways</h4>
              <p className="text-xs text-text-muted font-body mb-3">Don't miss your chance to win premium gaming accounts!</p>
              <Link to="/gamezeweno/giveaways" className="btn-green text-xs px-4 py-2 w-full justify-center">View Giveaways</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
