import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MoreVertical, Heart, SkipBack, Play, SkipForward, 
  Download, MessageSquare, Sparkles, Languages, Clock, Share2,
  Volume2, Music, Zap, Coffee, X
} from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import { useAudio } from '../../controllers/AudioContext';
import { useLanguage } from '../../controllers/LanguageContext';

export default function PlayerScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  
  const { downloads, toggleDownload, allEpisodes, likes, toggleLike } = useUserData();
  const { 
    currentEpisode, playEpisode, isPlaying, progress, 
    currentTime, formatTime, speed, setSpeed, seek 
  } = useAudio();

  const [activeTab, setActiveTab] = useState('player'); // player, transcript, community
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const canvasRef = useRef(null);
  
  const episode = allEpisodes.find(e => e.id.toString() === id.toString()) || allEpisodes[0];

  // Auto-play if not already playing this episode
  useEffect(() => {
    if (!currentEpisode || currentEpisode.id !== episode.id) {
      playEpisode(episode, true);
    }
  }, [id]);

  // Visualizer Animation
  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const spacing = 4;
      const barWidth = (canvas.width - (bars - 1) * spacing) / bars;
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * (canvas.height * 0.8) + 10;
        const x = i * (barWidth + spacing);
        const y = (canvas.height - height) / 2;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, 'var(--accent-color)');
        gradient.addColorStop(1, 'var(--secondary-color)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 10);
        ctx.fill();
      }
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, activeTab]);

  const isDownloaded = downloads.includes(episode.id);

  const handleDownload = async () => {
    if (!episode.audioUrl) return;
    try {
      const audioUrl = `http://${window.location.hostname}:5000${episode.audioUrl}`;
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${episode.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      if ('caches' in window) {
        const cache = await caches.open('habeshacast-audio');
        await cache.add(audioUrl);
      }
      toggleDownload(episode.id);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const transcripts = [
    { time: 0, text: "Welcome to this special episode of HabeshaCast." },
    { time: 5, text: "Today we're exploring the intersection of AI and tradition." },
    { time: 10, text: "How can modern technology preserve our ancient stories?" },
    { time: 15, text: "Let's dive into the history of Axum through a new lens." },
    { time: 20, text: "The obelisks still stand as a testament to our ingenuity." }
  ];

  const currentTranscript = transcripts.reduce((prev, curr) => {
    return (currentTime >= curr.time) ? curr : prev;
  }, transcripts[0]);

  return (
    <div className="screen scrollable" style={{ paddingBottom: '40px' }}>
      {/* Background Glow */}
      <div style={{ 
        position: 'fixed', inset: 0, 
        background: `radial-gradient(circle at center, ${episode.color}33 0%, var(--bg-main) 70%)`,
        zIndex: -1 
      }}></div>

      <div className="top-nav">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>{t('nowPlaying')}</div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>{episode.category}</div>
        </div>
        <button className="btn-icon" onClick={() => setShowSleepTimer(!showSleepTimer)}>
          <Clock size={20} color={showSleepTimer ? 'var(--accent-color)' : 'currentColor'} />
        </button>
      </div>

      {activeTab === 'player' && (
        <div className="player-main-view" style={{ animation: 'fadeIn 0.5s ease' }}>
          {/* Enhanced Artwork with Visualizer Overlay */}
          <div style={{ position: 'relative', width: '320px', height: '320px', margin: '20px auto 40px' }}>
            <div style={{ 
              position: 'absolute', inset: -20, 
              background: episode.color, opacity: 0.2, filter: 'blur(40px)',
              borderRadius: '50%', animation: 'pulse 4s infinite'
            }}></div>
            <div style={{ 
              width: '100%', height: '100%', 
              borderRadius: '32px', 
              background: episode.color,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div className="habesha-pattern" style={{ opacity: 0.1 }}></div>
              <canvas 
                ref={canvasRef} 
                width={320} 
                height={320} 
                style={{ position: 'absolute', inset: 0, opacity: 0.6 }}
              />
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ flex: 1, paddingRight: '16px' }}>
              <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>{episode.title}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music size={16} /> {episode.author}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-icon glass-panel" onClick={() => toggleLike(episode.id)}>
                <Heart size={22} color={likes.includes(episode.id) ? '#f43f5e' : 'var(--text-muted)'} fill={likes.includes(episode.id) ? '#f43f5e' : 'none'} />
              </button>
            </div>
          </div>

          {/* AI Transcript Preview */}
          <div className="glass-panel" style={{ padding: '12px 16px', marginBottom: '32px', borderLeft: '3px solid var(--accent-color)' }} onClick={() => setActiveTab('transcript')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={14} color="var(--accent-color)" />
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Live Transcription</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.4', fontStyle: 'italic', color: 'var(--text-main)' }}>
              "{currentTranscript.text}"
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', marginBottom: '40px' }}>
            <div 
              style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '3px', position: 'relative', marginBottom: '12px', cursor: 'pointer' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = (x / rect.width) * 100;
                seek(pct);
              }}
            >
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))', borderRadius: '3px', position: 'absolute', top: 0, left: 0 }}></div>
              <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '-5px', left: `calc(${progress}% - 8px)`, boxShadow: '0 0 15px var(--accent-color)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>{formatTime(currentTime)}</span>
              <span>{episode.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '40px' }}>
            <button className="btn-icon" onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-color)' }}>{speed}x</span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="btn-icon" style={{ width: '56px', height: '56px' }}><SkipBack size={28} fill="currentColor" /></button>
              <button className="btn-icon" style={{ width: '84px', height: '84px', background: 'var(--primary-color)', color: 'white', boxShadow: '0 0 30px var(--primary-color)' }} onClick={() => playEpisode(episode)}>
                <Play size={40} fill="currentColor" style={{ display: isPlaying ? 'none' : 'block', marginLeft: '6px' }} />
                {isPlaying && <div style={{ width: '24px', height: '24px', display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, background: 'white', borderRadius: '3px' }}></div>
                    <div style={{ flex: 1, background: 'white', borderRadius: '3px' }}></div>
                  </div>}
              </button>
              <button className="btn-icon" style={{ width: '56px', height: '56px' }}><SkipForward size={28} fill="currentColor" /></button>
            </div>

            <button className="btn-icon" onClick={handleDownload}>
              <Download size={22} color={isDownloaded ? 'var(--accent-color)' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div style={{ animation: 'slideUp 0.4s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>AI Live Transcription</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-icon glass-panel" style={{ width: '36px', height: '36px' }}><Languages size={18} /></button>
              <button className="btn-icon glass-panel" style={{ width: '36px', height: '36px' }} onClick={() => setActiveTab('player')}><X size={18} /></button>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            {transcripts.map((t, i) => (
              <p 
                key={i} 
                style={{ 
                  fontSize: '18px', 
                  lineHeight: '1.6', 
                  marginBottom: '16px',
                  opacity: currentTime >= t.time ? 1 : 0.3,
                  color: currentTime >= t.time && (i === transcripts.length - 1 || currentTime < transcripts[i+1].time) ? 'var(--accent-color)' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                {t.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Social & Tabs */}
      <div className="glass-panel" style={{ display: 'flex', padding: '6px', borderRadius: '20px', marginTop: '20px' }}>
        <button 
          className="btn" 
          style={{ flex: 1, borderRadius: '16px', background: activeTab === 'player' ? 'var(--bg-input)' : 'transparent', padding: '10px', fontSize: '13px' }}
          onClick={() => setActiveTab('player')}
        >
          <Music size={18} /> Player
        </button>
        <button 
          className="btn" 
          style={{ flex: 1, borderRadius: '16px', background: activeTab === 'transcript' ? 'var(--bg-input)' : 'transparent', padding: '10px', fontSize: '13px' }}
          onClick={() => setActiveTab('transcript')}
        >
          <Sparkles size={18} /> Transcript
        </button>
        <button 
          className="btn" 
          style={{ flex: 1, borderRadius: '16px', background: activeTab === 'community' ? 'var(--bg-input)' : 'transparent', padding: '10px', fontSize: '13px' }}
          onClick={() => setActiveTab('community')}
        >
          <MessageSquare size={18} /> Waves
        </button>
      </div>

      {activeTab === 'community' && (
        <div style={{ marginTop: '24px', animation: 'fadeIn 0.4s ease' }}>
          <div className="section-header">
            <h3>Community Waves</h3>
            <span style={{ fontSize: '11px', color: 'var(--accent-color)' }}>24 Listening Now</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { user: 'Lidia', text: 'This part about Axum is mind-blowing! 🤯', time: '2m' },
              { user: 'Kaleb', text: 'Love the background music here.', time: '5m' },
              { user: 'Selam', text: 'Is there a part 2 coming?', time: '10m' }
            ].map((msg, i) => (
              <div key={i} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                  {msg.user[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{msg.user}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-panel" style={{ marginTop: '16px', padding: '8px', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Add a wave..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '8px', fontSize: '14px', outline: 'none' }}
            />
            <button className="btn-icon" style={{ background: 'var(--accent-color)', color: 'black', width: '36px', height: '36px' }}>
              <Share2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
