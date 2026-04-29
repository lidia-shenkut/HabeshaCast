import { Settings, Heart, Download, Clock, ArrowLeft, BarChart2, ShieldAlert, Globe } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';
import { useAuth } from '../../controllers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../controllers/LanguageContext';

export default function ProfileScreen() {
  const { downloads, history, getTopCategory, likes, customEpisodes, pendingEpisodes } = useUserData();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  const listenedCount = new Set(history.map(h => h.id)).size;
  const topCategory = getTopCategory();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>{t('profile')}</h2>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn-icon"><Settings size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '36px', color: 'white', fontWeight: 'bold' }}>{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <h2 style={{ marginBottom: '4px' }}>{user?.name || 'Guest'}</h2>
        <p style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 500 }}>{user?.role === 'admin' ? 'Administrator' : 'Creator & Listener'}</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{listenedCount}</h3>
          <p className="subtitle">Listened</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{downloads.length}</h3>
          <p className="subtitle">{t('downloads')}</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{customEpisodes.length}</h3>
          <p className="subtitle">Uploaded</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Language Toggle */}
        <div className="episode-card" style={{ alignItems: 'center' }} onClick={toggleLanguage}>
          <Globe size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>{t('language')}: {language === 'en' ? t('english') : t('amharic')}</div>
          <div style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--secondary-color)' }}>
            Switch
          </div>
        </div>

        {/* Analytics Insight */}
        <div className="glass-panel" style={{ padding: '16px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--secondary-color)' }}>
          <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '50%' }}>
            <BarChart2 size={24} color="var(--secondary-color)" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Top Category</h4>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>{topCategory}</div>
          </div>
        </div>

        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Heart size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Liked Episodes ({likes.length})</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Download size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>{t('downloads')}</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Clock size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>{t('history')} ({history.length})</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        
        {user?.role === 'admin' && (
          <div className="episode-card" style={{ alignItems: 'center' }} onClick={() => navigate('/admin')}>
            <ShieldAlert size={20} color="#ff9f43" style={{ margin: '0 8px' }} />
            <div style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: '#ff9f43' }}>{t('admin')} Panel</div>
            {pendingEpisodes.length > 0 && (
              <div style={{ background: '#ff9f43', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                {pendingEpisodes.length}
              </div>
            )}
          </div>
        )}
      </div>
      
      <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: '32px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}>Log Out</button>
    </div>
  );
}
