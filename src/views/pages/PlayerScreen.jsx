import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Heart, SkipBack, Play, SkipForward, Download } from 'lucide-react';
import { MOCK_EPISODES } from '../../models/mockData';

export default function PlayerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = parseInt(location.pathname.split('/').pop());
  const episode = MOCK_EPISODES.find(e => e.id === id) || MOCK_EPISODES[0];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = 30; // Static for demo

  return (
    <div className="screen" style={{ background: 'var(--bg-main)' }}>
      <div className="top-nav">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Now Playing</div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{episode.category}</div>
        </div>
        <button className="btn-icon"><MoreVertical size={20} /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '280px', height: '280px', 
          borderRadius: '24px', 
          background: episode.color,
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '40px'
        }}></div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{episode.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{episode.author}</p>
          </div>
          <button className="btn-icon" style={{ background: 'transparent' }}><Heart size={24} color="var(--text-muted)" /></button>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', position: 'relative', marginBottom: '8px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--secondary-color)', borderRadius: '2px', position: 'absolute', top: 0, left: 0 }}></div>
            <div style={{ width: '12px', height: '12px', background: 'var(--secondary-color)', borderRadius: '50%', position: 'absolute', top: '-4px', left: `calc(${progress}% - 6px)`, boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>04:12</span>
            <span>{episode.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', width: '100%' }}>
          <button className="btn-icon" style={{ background: 'transparent' }}><span style={{ fontSize: '14px', fontWeight: 600 }}>1x</span></button>
          <button className="btn-icon" style={{ width: '56px', height: '56px', background: 'var(--bg-input)' }}><SkipBack size={24} fill="currentColor" /></button>
          <button className="btn-icon" style={{ width: '72px', height: '72px', background: 'var(--primary-color)', color: 'white', boxShadow: 'var(--shadow-glow)' }} onClick={() => setIsPlaying(!isPlaying)}>
            <Play size={32} fill="currentColor" style={{ display: isPlaying ? 'none' : 'block', marginLeft: '4px' }} />
            {isPlaying && <div style={{ width: '20px', height: '20px', display: 'flex', gap: '6px' }}>
                <div style={{ flex: 1, background: 'white', borderRadius: '2px' }}></div>
                <div style={{ flex: 1, background: 'white', borderRadius: '2px' }}></div>
              </div>}
          </button>
          <button className="btn-icon" style={{ width: '56px', height: '56px', background: 'var(--bg-input)' }}><SkipForward size={24} fill="currentColor" /></button>
          <button className="btn-icon" style={{ background: 'transparent' }}><Download size={20} color="var(--text-muted)" /></button>
        </div>
      </div>
    </div>
  );
}
