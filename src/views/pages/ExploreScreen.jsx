import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Mic, 
  Sparkles, 
  Play, 
  Music, 
  Headphones, 
  Globe, 
  TrendingUp, 
  Brain, 
  Moon, 
  Zap,
  Coffee,
  Heart,
  ChevronRight,
  Filter,
  Bell
} from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import centralFigure from '../../assets/central_figure.png';


export default function ExploreScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  const [activeMood, setActiveMood] = useState('Focus');

  const moods = [
    { name: 'Focus', icon: <Brain size={20} />, class: 'focus' },
    { name: 'Energy', icon: <Zap size={20} />, class: 'energy' },
    { name: 'Relax', icon: <Coffee size={20} />, class: 'relax' },
    { name: 'Night', icon: <Moon size={20} />, class: 'night' }
  ];

  const categories = [
    { name: 'Podcasts', icon: <Headphones size={20} /> },
    { name: 'Music', icon: <Music size={20} /> },
    { name: 'African Voices', icon: <Globe size={20} /> },
    { name: 'Trending', icon: <TrendingUp size={20} /> },
    { name: 'Creators', icon: <Filter size={20} /> },
    { name: 'Chill Space', icon: <Moon size={20} /> }
  ];

  return (
    <div className="screen scrollable explore-screen">
      <div className="geez-overlay"></div>
      
      {/* Top Header */}
      <div className="top-nav" style={{ marginBottom: '16px' }}>
        <div className="btn-icon glass-panel" style={{ borderRadius: '12px' }}>
          <Filter size={18} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Explore</h2>
          <p className="subtitle" style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>Discover. Listen. Connect.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="btn-icon glass-panel" style={{ borderRadius: '12px' }}>
            <Bell size={18} />
          </div>
          <div className="btn-icon glass-panel" style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
            <Sparkles size={18} color="var(--accent-color)" />
          </div>
        </div>
      </div>

      {/* AI Search Portal */}
      <div className="ai-search-orb-container" style={{ padding: '0 0 20px' }}>
        <div className="ai-search-orb" style={{ maxWidth: '100%' }}>
          <Search size={20} color="var(--accent-color)" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Search podcasts, music, creators..."
            style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
          />
          <div style={{ background: 'var(--secondary-color)', padding: '8px', borderRadius: '50%', display: 'flex' }}>
            <Mic size={18} color="white" />
          </div>
        </div>
      </div>

      {/* 🌟 CENTRAL FIGURE & MOOD ORBIT */}
      <div className="central-orb-section">
        <div className="mood-orbit-path"></div>
        
        <div className="main-avatar-container">
          <img 
            src={centralFigure} 
            alt="Central AI Guide" 
            className="avatar-image" 
          />
        </div>

        {moods.map((mood) => (
          <div 
            key={mood.name} 
            className={`mood-node ${mood.class} ${activeMood === mood.name ? 'active' : ''}`}
            onClick={() => setActiveMood(mood.name)}
          >
            {mood.icon}
            <span className="mood-label-floating">{mood.name}</span>
          </div>
        ))}
      </div>

      {/* Horizontal Categories */}
      <div className="horizontal-categories">
        {categories.map((cat, i) => (
          <div key={i} className="cat-pill">
            <div className="cat-icon-box">
              {cat.icon}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* AI Picks For You */}
      <div className="section-header" style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px' }}>AI Picks For You</h2>
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
          See all <ChevronRight size={14} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '10px 0', margin: '0 -20px', paddingLeft: '20px' }}>
        {allEpisodes.slice(0, 4).map((ep, i) => (
          <div key={ep.id} className="ai-pick-card" onClick={() => navigate(`/player/${ep.id}`)}>
            <div className="ai-pick-thumb" style={{ background: ep.color || 'var(--primary-color)' }}>
              <div className="habesha-pattern" style={{ opacity: 0.1 }}></div>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                <div className="btn-icon" style={{ background: 'rgba(255,255,255,0.2)', width: '28px', height: '28px' }}>
                  <Play size={14} fill="white" />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                 {/* Mini Waveform */}
                 <div style={{ display: 'flex', gap: '1px', alignItems: 'flex-end', height: '12px' }}>
                    {[...Array(8)].map((_, j) => (
                      <div key={j} style={{ width: '2px', height: `${20 + Math.random() * 80}%`, background: 'white', borderRadius: '1px' }}></div>
                    ))}
                 </div>
              </div>
            </div>
            <h4 style={{ fontSize: '14px', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ep.title}</h4>
            <p className="subtitle" style={{ fontSize: '11px' }}>{ep.category}</p>
            <div className="ai-badge" style={{ fontSize: '8px', padding: '2px 6px', marginTop: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
              {['🔥 Motivational', '🧠 Learn', '🌙 Calm', '⚡ Energy'][i % 4]}
            </div>
          </div>
        ))}
      </div>

      {/* Trending Around You */}
      <div className="section-header" style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '18px' }}>Trending Around You</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div className="pulse" style={{ width: '6px', height: '6px', background: '#ff4757', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '11px', color: '#ff4757', fontWeight: 600 }}>Live Now</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', margin: '0 -20px', paddingLeft: '20px' }}>
        {['Habesha Podcast', 'Addis Soundwaves', 'African Storytellers'].map((title, i) => (
          <div key={i} className="glass-panel" style={{ minWidth: '200px', padding: '16px', borderRadius: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>{title}</p>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: 'var(--accent-color)' }}></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

