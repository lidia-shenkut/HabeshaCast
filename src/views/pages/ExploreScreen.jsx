import { useState, useEffect } from 'react';
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
  CloudLightning,
  ChevronRight
} from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';

export default function ExploreScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [rotation, setRotation] = useState(0);

  const categories = [
    { name: 'Podcasts', icon: <Headphones size={24} />, color: '#6366f1' },
    { name: 'Music Nebula', icon: <Music size={24} />, color: '#a855f7' },
    { name: 'African Voices', icon: <Globe size={24} />, color: '#f59e0b' },
    { name: 'Trending Now', icon: <TrendingUp size={24} />, color: '#f43f5e' },
    { name: 'Learn & Grow', icon: <Brain size={24} />, color: '#10b981' },
    { name: 'Chill Space', icon: <Moon size={24} />, color: '#3b82f6' },
    { name: 'Creators', icon: <CloudLightning size={24} />, color: '#22d3ee' }
  ];

  const rotateGalaxy = (index) => {
    const diff = index - activeCategory;
    setRotation(prev => prev - (diff * (360 / categories.length)));
    setActiveCategory(index);
  };

  // Holographic Suggestions
  const suggestions = [
    "Find motivational Amharic podcasts",
    "Discover trending African tech talks",
    "Show me relaxing night music"
  ];

  return (
    <div className="screen scrollable explore-screen">
      <div className="geez-overlay"></div>
      
      {/* 🧠 TOP SECTION — AI SEARCH PORTAL */}
      <div className="ai-search-orb-container">
        <h1 className="glow-text" style={{ fontSize: '28px', marginBottom: '24px', textAlign: 'center' }}>
          Discovery <span style={{ color: 'var(--accent-color)' }}>Universe</span>
        </h1>
        
        <div className="ai-search-orb">
          <div className="ai-glow-ring"></div>
          <Search size={20} color="var(--accent-color)" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Explore the Sound Universe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              flex: 1, 
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <Mic size={20} color="var(--text-secondary)" />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', overflowX: 'auto', width: '100%', padding: '4px' }}>
          {suggestions.map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="habesha-divider"></div>

      {/* 🌌 CATEGORY GALAXY */}
      <div className="section-header">
        <h2 style={{ fontSize: '18px', margin: 0 }}>Category Galaxy</h2>
        <Sparkles size={16} color="var(--accent-color)" />
      </div>

      <div className="galaxy-viewport">
        <div className="galaxy-wheel" style={{ transform: `rotateY(${rotation}deg)` }}>
          {categories.map((cat, i) => {
            const angle = (i * 360) / categories.length;
            const radius = 150;
            return (
              <div 
                key={i}
                className={`planet-card ${activeCategory === i ? 'active' : ''}`}
                onClick={() => rotateGalaxy(i)}
                style={{ 
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle}deg)`,
                }}
              >
                <div className="planet-icon-container" style={{ border: `1px solid ${cat.color}` }}>
                  {cat.icon}
                </div>
                <span className="planet-label" style={{ color: activeCategory === i ? 'white' : 'rgba(255,255,255,0.6)' }}>
                  {cat.name}
                </span>
                {activeCategory === i && (
                   <div style={{ position: 'absolute', bottom: '-10px', width: '4px', height: '4px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 TRENDING AUDIO STREAM */}
      <div className="section-header" style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Live Energy Wall</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div className="pulse" style={{ width: '8px', height: '8px', background: '#ff4757', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ff4757' }}>TRENDING</span>
        </div>
      </div>

      <div className="energy-wall">
        {allEpisodes.slice(0, 5).map((ep, i) => (
          <div key={ep.id} className="hologram-card" onClick={() => navigate(`/player/${ep.id}`)}>
            <div className="hologram-thumb">
              <div style={{ position: 'absolute', inset: 0, background: ep.color || 'var(--primary-color)', opacity: 0.4 }}></div>
              <div className="habesha-pattern"></div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={24} color="white" fill="white" />
              </div>
              <div className="pulse-ring"></div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="ai-badge" style={{ fontSize: '9px', padding: '2px 6px' }}>AI TRENDING</div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{1.2 + i * 0.4}k listeners</span>
              </div>
              <h3 style={{ fontSize: '16px', margin: '8px 0 4px', fontWeight: 700 }}>{ep.title}</h3>
              <p className="subtitle" style={{ fontSize: '12px' }}>{ep.author}</p>
              
              <div style={{ display: 'flex', gap: '2px', height: '12px', alignItems: 'center', marginTop: '8px' }}>
                {[...Array(12)].map((_, j) => (
                  <div 
                    key={j} 
                    style={{ 
                      flex: 1, 
                      height: `${30 + Math.random() * 70}%`, 
                      background: 'var(--accent-color)', 
                      opacity: 0.5,
                      borderRadius: '1px'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action for AI Assistance */}
      <div 
        className="glass-panel" 
        style={{ 
          position: 'fixed', 
          bottom: '100px', 
          right: '20px', 
          padding: '12px 20px', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          border: '1px solid var(--accent-color)',
          background: 'rgba(34, 211, 238, 0.1)',
          zIndex: 100,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <Sparkles size={18} color="var(--accent-color)" />
        <span style={{ fontSize: '14px', fontWeight: 600 }}>AI Explorer</span>
      </div>
    </div>
  );
}
