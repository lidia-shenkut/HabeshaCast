import { Settings, Heart, Download, Clock, ArrowLeft, BarChart2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';

export default function ProfileScreen() {
  const { downloads, history, getTopCategory, likes, customEpisodes } = useUserData();
  
  const listenedCount = new Set(history.map(h => h.id)).size;
  const topCategory = getTopCategory();

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>Profile</h2>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn-icon"><Settings size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))', marginBottom: '16px' }}></div>
        <h2 style={{ marginBottom: '4px' }}>Lidia Mekonnen</h2>
        <p style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 500 }}>Creator & Listener</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{listenedCount}</h3>
          <p className="subtitle">Listened</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{downloads.length}</h3>
          <p className="subtitle">Downloads</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{customEpisodes.length}</h3>
          <p className="subtitle">Uploaded</p>
        </div>
      </div>

      {/* Analytics Insight */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--secondary-color)' }}>
        <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '50%' }}>
          <BarChart2 size={24} color="var(--secondary-color)" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Top Category</h4>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>{topCategory}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Heart size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Liked Episodes ({likes.length})</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Download size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Downloaded Content</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Clock size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Listening History ({history.length})</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
      
      <button className="btn btn-secondary" style={{ marginTop: '32px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}>Log Out</button>
    </div>
  );
}
