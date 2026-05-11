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
  Bell,
  X
} from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import { useLanguage } from '../../controllers/LanguageContext';
import centralFigure from '../../assets/central_figure.png';


export default function ExploreScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  const { t } = useLanguage();
  const [activeMood, setActiveMood] = useState('Focus');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiStep, setAiStep] = useState(0); // 0: listening, 1: thinking, 2: responding

  const moods = [
    { name: 'Focus', icon: <Brain size={20} />, class: 'focus' },
    { name: 'Energy', icon: <Zap size={20} />, class: 'energy' },
    { name: 'Relax', icon: <Coffee size={20} />, class: 'relax' },
    { name: 'Night', icon: <Moon size={20} />, class: 'night' }
  ];

  const handleAIClick = () => {
    setShowAIAssistant(true);
    setAiStep(0);
    setTimeout(() => setAiStep(1), 3000);
    setTimeout(() => setAiStep(2), 5000);
  };

  const categories = [
    { id: 'Podcasts', name: 'Podcasts', icon: <Headphones size={20} /> },
    { id: 'Music', name: 'Music', icon: <Music size={20} /> },
    { id: 'African Voices', name: 'African Voices', icon: <Globe size={20} /> },
    { id: 'Trending', name: 'Trending', icon: <TrendingUp size={20} /> },
    { id: 'Creators', name: 'Creators', icon: <Filter size={20} /> },
    { id: 'Chill Space', name: 'Chill Space', icon: <Moon size={20} /> }
  ];

  return (
    <div className="screen scrollable explore-screen">
      <div className="geez-overlay"></div>
      
      {/* AI Assistant Overlay */}
      {showAIAssistant && (
        <div className="ai-assistant-overlay" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="glass-panel ai-card" style={{ width: '85%', padding: '30px', textAlign: 'center', position: 'relative' }}>
            <button className="btn-icon" style={{ position: 'absolute', top: 15, right: 15 }} onClick={() => setShowAIAssistant(false)}>
              <X size={20} />
            </button>
            
            <div className={`ai-orb-large ${aiStep === 0 ? 'listening' : aiStep === 1 ? 'thinking' : ''}`}>
              <img src={centralFigure} alt="AI" />
            </div>
            
            <h3 style={{ marginTop: '20px', fontSize: '20px' }}>
              {aiStep === 0 ? "Listening..." : aiStep === 1 ? "Thinking..." : "Habesha AI Guide"}
            </h3>
            
            <p style={{ color: 'var(--text-muted)', minHeight: '60px', marginTop: '10px' }}>
              {aiStep === 0 && "Try: 'Play some Ethio-Jazz' or 'Tell me about Axum'"}
              {aiStep === 1 && "Searching the Habesha Universe..."}
              {aiStep === 2 && "I've found a special collection of Axumite history and traditional jazz for you. Ready to explore?"}
            </p>
            
            {aiStep === 2 && (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => navigate('/category/African Voices')}>
                Start Exploring
              </button>
            )}
            
            <div className="voice-waves" style={{ display: aiStep === 0 ? 'flex' : 'none' }}>
              {[...Array(5)].map((_, i) => <div key={i} className="wave-bar"></div>)}
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="top-nav" style={{ marginBottom: '16px' }}>
        <div className="btn-icon glass-panel" style={{ borderRadius: '12px' }}>
          <Filter size={18} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{t('explore')}</h2>
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
            placeholder={t('search')}
            style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
          />
          <div style={{ background: 'var(--secondary-color)', padding: '8px', borderRadius: '50%', display: 'flex', cursor: 'pointer' }} onClick={handleAIClick}>
            <Mic size={18} color="white" />
          </div>
        </div>
      </div>

      {/* 🌟 CENTRAL FIGURE & MOOD ORBIT */}
      <div className="central-orb-section">
        <div className="mood-orbit-path"></div>
        
        <div className="main-avatar-container" onClick={handleAIClick} style={{ cursor: 'pointer' }}>
          <img 
            src={centralFigure} 
            alt="Central AI Guide" 
            className="avatar-image" 
          />
          <div className="ai-glow-ring"></div>
        </div>

        {moods.map((mood) => (
          <div 
            key={mood.name} 
            className={`mood-node ${mood.class} ${activeMood === mood.name ? 'active' : ''}`}
            onClick={() => {
              setActiveMood(mood.name);
              // Filter by mood could also navigate or filter content here
            }}
          >
            {mood.icon}
            <span className="mood-label-floating">{mood.name}</span>
          </div>
        ))}
      </div>

      {/* Horizontal Categories */}
      <div className="horizontal-categories">
        {categories.map((cat, i) => (
          <div key={i} className="cat-pill" onClick={() => navigate(`/category/${cat.id}`)}>
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
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }} onClick={() => navigate('/category/Explore')}>
          {t('seeAll')} <ChevronRight size={14} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '10px 0', margin: '0 -20px', paddingLeft: '20px' }}>
        {allEpisodes.slice(0, 6).map((ep, i) => (
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
              {t('aiRecommended')}
            </div>
          </div>
        ))}
      </div>

      {/* Trending Around You */}
      <div className="section-header" style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '18px' }}>{t('trending')}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div className="pulse" style={{ width: '6px', height: '6px', background: '#ff4757', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '11px', color: '#ff4757', fontWeight: 600 }}>Live Now</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '20px', margin: '0 -20px', paddingLeft: '20px' }}>
        {allEpisodes.filter(ep => ep.category === 'Trending').map((ep, i) => (
          <div key={ep.id} className="glass-panel" style={{ minWidth: '220px', padding: '16px', borderRadius: '24px', cursor: 'pointer' }} onClick={() => navigate(`/player/${ep.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="ai-badge" style={{ margin: 0, fontSize: '9px' }}>HOT NOW</div>
              <TrendingUp size={14} color="var(--accent-color)" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ep.title}</p>
            <p className="subtitle" style={{ fontSize: '11px', marginBottom: '12px' }}>{ep.author}</p>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${60 + Math.random() * 30}%`, height: '100%', background: 'var(--accent-color)' }}></div>
            </div>
          </div>
        ))}
        {allEpisodes.filter(ep => ep.category === 'Trending').length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '10px' }}>No trending episodes right now.</p>
        )}
      </div>

    </div>
  );
}
