import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Play, 
  Mic, 
  Plus, 
  Heart, 
  SkipForward, 
  Zap, 
  Moon, 
  Sun, 
  Coffee,
  Brain,
  Globe,
  Waves,
  Sparkles
} from 'lucide-react';
import { MOCK_EPISODES } from '../../models/mockData';
import { useUserData } from '../../controllers/UserDataContext';
import { useLanguage } from '../../controllers/LanguageContext';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  const { t } = useLanguage();
  
  const [activeMood, setActiveMood] = useState('Energy');
  const [searchQuery, setSearchQuery] = useState('');
  
  const moods = [
    { name: 'Focus', icon: <Brain size={14} />, color: '#6366f1', glow: 'rgba(99, 102, 241, 0.6)' },
    { name: 'Energy', icon: <Zap size={14} />, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.6)' },
    { name: 'Relax', icon: <Coffee size={14} />, color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },
    { name: 'Night', icon: <Moon size={14} />, color: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' }
  ];

  const currentMood = moods.find(m => m.name === activeMood);

  // AI-curated neural picks
  const neuralPicks = allEpisodes.slice(0, 4).map((ep, i) => ({
    ...ep,
    emotion: ['🔥 motivational', '🌙 calm', '⚡ energy', '🧠 focus'][i % 4]
  }));

  return (
    <div className="screen scrollable" style={{ paddingBottom: '120px' }}>
      <div className="habesha-pattern"></div>
      
      {/* Top Header */}
      <div className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>HABESHACAST <span style={{ color: 'var(--accent-color)' }}>AI</span></h2>
        </div>
        <div className="btn-icon glass-panel" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
          <Globe size={18} />
        </div>
      </div>

      {/* 🌟 AI Mood Sphere Section */}
      <div className="mood-sphere-container">
        <div 
          className="mood-orb" 
          style={{ 
            background: `radial-gradient(circle at 30% 30%, ${currentMood.color}, var(--bg-cosmos))`,
            boxShadow: `0 0 60px ${currentMood.glow}, inset 0 0 20px rgba(255, 255, 255, 0.2)`
          }}
        >
          <div className="ripple-effect" style={{ animationDelay: '0s', borderColor: currentMood.color }}></div>
          <div className="ripple-effect" style={{ animationDelay: '1s', borderColor: currentMood.color }}></div>
        </div>
        
        <div className="mood-labels glass-panel" style={{ padding: '6px', borderRadius: '30px' }}>
          {moods.map(mood => (
            <div 
              key={mood.name} 
              className={`mood-tag ${activeMood === mood.name ? 'active' : ''}`}
              onClick={() => setActiveMood(mood.name)}
              style={activeMood === mood.name ? { background: mood.color } : {}}
            >
              {mood.icon} <span style={{ marginLeft: '4px' }}>{mood.name}</span>
            </div>
          ))}
        </div>
        <p className="subtitle" style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Syncing with your {activeMood.toLowerCase()} neural patterns...</p>
      </div>

      {/* 🪐 Hero Universe Section */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '-20px', height: '150px', background: `radial-gradient(ellipse at top, ${currentMood.glow}, transparent)`, opacity: 0.2, zIndex: -1 }}></div>
        <h1 className="glow-text" style={{ fontSize: '36px', marginBottom: '8px', lineHeight: 1.1 }}>Good Evening,<br/>Creator</h1>
        <p className="subtitle" style={{ fontSize: '16px' }}>Your audio universe is evolving with you</p>
      </div>

      {/* 🔍 AI Smart Search */}
      <div className="ai-search-container">
        <div className="glass-panel" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden' }}>
          <Search 
            size={20} 
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-color)' }} 
          />
          <input 
            type="text" 
            className="ai-search-input" 
            style={{ border: 'none', background: 'transparent' }}
            placeholder="Ask HabeshaCast anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div 
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'var(--bg-glass-bright)', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
          >
            <Mic size={18} color="var(--text-primary)" />
          </div>
        </div>
      </div>

      {/* 🎧 Trending Universe Carousel */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ marginBottom: 0, fontSize: '20px' }}>Trending Universe</h2>
        <span style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 600 }}>DISCOVER ALL</span>
      </div>
      
      <div className="trending-carousel">
        {allEpisodes.map((ep, i) => (
          <div key={ep.id} className="trending-card" onClick={() => navigate(`/player/${ep.id}`)}>
            <div 
              className="card-image" 
              style={{ background: ep.color || `linear-gradient(135deg, var(--primary-color), var(--secondary-color))` }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}></div>
            </div>
            <div className="card-content">
              <div className="ai-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={10} /> AI RECOMMENDED
              </div>
              <h3 style={{ fontSize: '22px', marginBottom: '8px', fontWeight: 800 }}>{ep.title}</h3>
              <p className="subtitle" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{ep.author} • {ep.category}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '16px' }}>
                <div className="btn-icon" style={{ background: 'white', color: 'black', width: '44px', height: '44px', boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}>
                  <Play size={20} fill="black" />
                </div>
                {/* Circular Waveform Preview */}
                <div style={{ position: 'relative', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[...Array(12)].map((_, j) => (
                    <div 
                      key={j} 
                      style={{ 
                        position: 'absolute',
                        width: '2px',
                        height: '10px',
                        background: 'var(--accent-color)',
                        borderRadius: '2px',
                        transform: `rotate(${j * 30}deg) translateY(-14px)`,
                        animation: `waveform ${0.8 + Math.random()}s ease-in-out infinite`,
                        opacity: 0.6
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Neural Picks Grid */}
      <div className="section-header" style={{ marginTop: '32px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px' }}>For You – Neural Picks</h2>
      </div>
      
      <div className="neural-grid">
        {neuralPicks.map(ep => (
          <div key={ep.id} className="neural-card" onClick={() => navigate(`/player/${ep.id}`)}>
            <div 
              style={{ 
                height: '100px', 
                borderRadius: '20px', 
                background: ep.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '12px'
              }}
            >
              <Play size={24} color="white" style={{ zIndex: 1 }} />
              <div className="habesha-pattern" style={{ opacity: 0.15 }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }}></div>
            </div>
            <div>
              <div className="emotion-tag" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{ep.emotion}</div>
              <h4 style={{ fontSize: '15px', margin: '6px 0', lineHeight: 1.3 }}>{ep.title}</h4>
              <p className="subtitle" style={{ fontSize: '12px' }}>{ep.duration}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🎙️ Upload Studio Button */}
      <div style={{ textAlign: 'center', margin: '48px 0' }}>
        <div className="upload-studio-btn" onClick={() => navigate('/upload')} style={{ boxShadow: `0 0 40px ${currentMood.glow}` }}>
          <Plus size={36} strokeWidth={3} />
          <div className="ripple-effect"></div>
          <div className="ripple-effect" style={{ animationDelay: '1s' }}></div>
        </div>
        <h3 style={{ marginTop: '24px', fontSize: '20px', fontWeight: 800 }}>Create & Upload Audio</h3>
        <p className="subtitle" style={{ fontSize: '14px', marginTop: '4px' }}>AI-powered voice enhancement</p>
      </div>

      {/* 🌍 Community Wave Section */}
      <div className="community-wave-section glass-panel" style={{ border: 'none', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4757' }}></div>
          <h3 style={{ margin: 0, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Sound Ocean</h3>
        </div>
        <p className="subtitle" style={{ fontSize: '12px' }}>Visualizing global creator resonance</p>
        
        <div className="wave-ocean">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="wave-bar" 
              style={{ 
                height: `${20 + Math.random() * 80}%`, 
                width: '3px',
                animation: `waveform ${0.8 + Math.random()}s ease-in-out infinite`,
                background: `linear-gradient(to top, var(--primary-color), var(--accent-color))`,
                opacity: 0.4 + (Math.random() * 0.4)
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 🎵 Sticky Mini Player */}
      <div className="sticky-player glass-panel">
        <div 
          style={{ 
            width: '52px', 
            height: '52px', 
            borderRadius: '14px', 
            background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Waves size={20} color="white" />
          <div className="habesha-pattern" style={{ opacity: 0.2 }}></div>
        </div>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <h4 style={{ fontSize: '15px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>The story of Emperor Tewodros II</h4>
          <p className="subtitle" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }}></span>
            Playing from History universe
          </p>
        </div>

        <div className="player-wave" style={{ width: '50px', display: 'flex', gap: '2px' }}>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="wave-bar" 
              style={{ 
                height: `${40 + Math.random() * 60}%`, 
                animationDelay: `${i * 0.1}s`,
                width: '2px'
              }}
            ></div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart size={22} className="pulse" style={{ color: '#ff4757', filter: 'drop-shadow(0 0 5px rgba(255,71,87,0.5))' }} />
          <div 
            className="btn-icon" 
            style={{ 
              background: 'white', 
              color: 'black', 
              width: '44px', 
              height: '44px',
              boxShadow: '0 0 20px rgba(255,255,255,0.4)'
            }}
          >
            <Play size={20} fill="black" />
          </div>
        </div>
      </div>

      {/* Floating Voice Assistant */}
      <div 
        className="btn-icon glass-panel" 
        style={{ 
          position: 'fixed', 
          bottom: '120px', 
          right: '20px', 
          width: '56px', 
          height: '56px',
          borderRadius: '50%',
          border: '1px solid var(--accent-color)',
          boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
          zIndex: 100,
          background: 'rgba(34, 211, 238, 0.1)'
        }}
      >
        <Mic size={24} color="var(--accent-color)" />
        <div className="ripple-effect" style={{ animationDuration: '3s', borderColor: 'var(--accent-color)' }}></div>
      </div>
    </div>
  );
}
