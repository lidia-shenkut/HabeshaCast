import { useAudio } from '../../controllers/AudioContext';
import { Play, Pause, X, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import centralFigure from '../../assets/central_figure.png';


export default function MiniPlayer() {
  const { currentEpisode, isPlaying, setIsPlaying, stopEpisode, progress } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();

  const isPlayerPage = location.pathname.startsWith('/player');

  const isHiddenPage = ['/', '/login'].includes(location.pathname) || location.pathname.startsWith('/player');
  if (!currentEpisode || isHiddenPage) return null;


  return (
    <div 
      className="sticky-player glass-panel" 
      style={{ 
        bottom: '90px', 
        left: '12px', 
        right: '12px',
        borderRadius: '20px',
        height: '80px',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1100
      }}
      onClick={() => navigate(`/player/${currentEpisode.id}`)}
    >

      <div className="hologram-thumb" style={{ width: '48px', height: '48px', margin: 0, borderRadius: '12px' }}>
        <img src={centralFigure} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Episode" />
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <h4 style={{ fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentEpisode.title}
        </h4>
        <p className="subtitle" style={{ fontSize: '10px' }}>{currentEpisode.author}</p>
        
        {/* Real Dynamic Waveform/Progress */}
        <div style={{ display: 'flex', gap: '2px', height: '10px', alignItems: 'flex-end', marginTop: '4px' }}>
          {[...Array(20)].map((_, j) => {
            const isActive = (j / 20) * 100 <= progress;
            return (
              <div 
                key={j} 
                style={{ 
                  flex: 1, 
                  height: `${20 + Math.random() * 80}%`, 
                  background: isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', 
                  borderRadius: '1px',
                  transition: 'background 0.3s ease'
                }} 
              ></div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          className="btn-icon" 
          style={{ width: '40px', height: '40px', background: 'white', color: 'black' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
        </button>
        <button 
          className="btn-icon" 
          style={{ width: '32px', height: '32px', opacity: 0.6 }}
          onClick={(e) => {
            e.stopPropagation();
            stopEpisode();
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
