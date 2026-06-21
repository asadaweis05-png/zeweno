// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const socialLinks = [
  { icon: <TwitterIcon size={18} />, href: '#', label: 'Twitter/X', color: '#1DA1F2' },
  { icon: <YoutubeIcon size={18} />, href: '#', label: 'YouTube', color: '#FF0000' },
  { icon: <InstagramIcon size={18} />, href: '#', label: 'Instagram', color: '#E1306C' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'Discord', color: '#5865F2' },
];

const footerLinks = {
  'Quick Links': [
    { label: 'Home', href: '/gamezeweno' },
    { label: 'News', href: '/gamezeweno/news' },
    { label: 'Accounts', href: '/gamezeweno/accounts' },
    { label: 'Giveaways', href: '/gamezeweno/giveaways' },
  ],
  'Games': [
    { label: 'eFootball News', href: '/gamezeweno/news' },
    { label: 'PUBG News', href: '/gamezeweno/news' },
    { label: 'eFootball Accounts', href: '/gamezeweno/accounts' },
    { label: 'PUBG Accounts', href: '/gamezeweno/accounts' },
  ],
  'Support': [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
};

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(0,207,255,0.1)' }}>
      {/* Newsletter Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.06), rgba(122,92,255,0.06))', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-gaming py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-gaming font-bold gradient-text mb-1">Never Miss Gaming Updates</h3>
              <p className="text-text-secondary text-sm font-body">Join 28,500+ gamers getting the latest news, drops & giveaways.</p>
            </div>
            {subscribed ? (
              <div className="badge-green text-sm px-4 py-2">✓ You're subscribed! Welcome aboard.</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-gaming pl-9 text-sm h-11"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary px-5 h-11 shrink-0">
                  <span className="flex items-center gap-1">Subscribe <ArrowRight size={14} /></span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-gaming py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/gamezeweno" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(122,92,255,0.2))', border: '1px solid rgba(0,207,255,0.4)' }}>
                <Gamepad2 size={20} className="text-neon-blue" />
              </div>
              <span className="font-gaming font-bold text-lg">
                <span className="gradient-text">GAME</span>
                <span className="text-white">ZEWENO</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm font-body leading-relaxed mb-5 max-w-xs">
              Your ultimate gaming hub for eFootball & PUBG news, premium accounts, and exclusive giveaways. Join the community.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#606060' }}
                  onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.background = `${color}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#606060'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = '#111'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-gaming font-bold text-sm mb-4 tracking-wider">{title.toUpperCase()}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-text-muted text-sm font-body hover:text-neon-blue transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="neon-divider my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs font-body">
            © {new Date().getFullYear()} Gamezeweno. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-text-muted font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse inline-block" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
