import { useState, useRef } from 'react';
import { 
  Settings, Heart, Download, Clock, ArrowRight, BarChart2, 
  ShieldAlert, Globe, Camera, Edit2, Bell, Lock, Eye, 
  Award, Star, Zap, User, Mail, Phone, MapPin, LogOut, 
  Play, Trash2, Check, X, ArrowLeft
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';
import { useAuth } from '../../controllers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../controllers/LanguageContext';
import { useTheme } from '../../controllers/ThemeContext';

export default function ProfileScreen() {
  const { downloads, history, getTopCategory, likes, customEpisodes, pendingEpisodes, allEpisodes, toggleLike, toggleDownload, deleteEpisode } = useUserData();
  const { user, logout, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState('main'); // main, liked, history, downloads, uploads, settings
  const [profileData, setProfileData] = useState({
    bio: user?.bio || "Passionate storyteller and podcast enthusiast from Addis Ababa. 🎙️",
    phone: user?.phone || "+251 911 234 567",
    location: user?.location || "Addis Ababa, Ethiopia",
    interests: user?.interests || ["Education", "History", "Storytelling"]
  });

  const fileInputRef = useRef(null);
  const avatarUrl = user?.avatar ? `http://${window.location.hostname}:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name || 'Guest'}&background=6c5ce7&color=fff&size=200`;

  const listenedCount = new Set(history.map(h => h.id)).size;
  const topCategory = getTopCategory();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await updateProfile(formData);
    } catch (err) {
      alert(err.message);
    }
  };

  const getListViewData = () => {
    switch (activeView) {
      case 'liked': 
        return { 
          title: 'Liked Episodes', 
          items: allEpisodes.filter(ep => likes.includes(ep.id)) 
        };
      case 'history': 
        return { 
          title: 'Listening History', 
          items: history.map(h => allEpisodes.find(ep => ep.id === h.id)).filter(Boolean) 
        };
      case 'downloads': 
        return { 
          title: 'Downloaded Content', 
          items: allEpisodes.filter(ep => downloads.includes(ep.id)) 
        };
      case 'uploads': 
        return { 
          title: 'My Uploads', 
          items: customEpisodes 
        };
      default: return { title: '', items: [] };
    }
  };

  const listView = getListViewData();

  if (activeView !== 'main') {
    return (
      <div className="screen scrollable">
        <div className="top-nav">
          <button className="btn-icon" onClick={() => setActiveView('main')}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ marginBottom: 0 }}>{activeView === 'settings' ? 'Settings' : listView.title}</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        {activeView === 'settings' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="section-header">
              <h3 className="section-title">Preferences</h3>
            </div>
            <div className="preference-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Zap size={20} color="var(--secondary-color)" />
                <span>Dark Mode</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-row" onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Globe size={20} color="var(--accent-color)" />
                <span>Language: {language === 'en' ? 'English' : 'Amharic'}</span>
              </div>
              <Edit2 size={16} />
            </div>

            <div className="section-header">
              <h3 className="section-title">Security</h3>
            </div>
            <div className="glass-panel" style={{ padding: '0 16px' }}>
              <div className="editable-field">
                <span>Change Password</span>
                <ArrowRight size={16} />
              </div>
              <div className="editable-field">
                <span>Privacy Controls</span>
                <ArrowRight size={16} />
              </div>
              <div className="editable-field" style={{ borderBottom: 'none' }}>
                <span>Delete Account</span>
                <Trash2 size={16} color="#ff6b6b" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {listView.items.length > 0 ? listView.items.map(ep => (
              <div key={ep.id} className="episode-card" onClick={() => navigate(`/player/${ep.id}`)}>
                <div className="episode-thumb" style={{ background: ep.color }}></div>
                <div className="episode-info">
                  <div className="episode-title">{ep.title}</div>
                  <div className="episode-author">{ep.author} • {ep.category}</div>
                </div>
                <div className="episode-actions">
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/player/${ep.id}`); }}>
                    <Play size={18} fill="currentColor" />
                  </button>
                  {activeView === 'uploads' && (
                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); deleteEpisode(ep.id); }}>
                      <Trash2 size={18} color="#ff6b6b" />
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ background: 'var(--bg-input)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <X size={32} />
                </div>
                <p>No items found in this section.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="screen scrollable">
      {/* Premium Header */}
      <div className="profile-header">
        <div className="top-nav" style={{ marginBottom: 0, position: 'absolute', top: 20, left: 20, right: 20, zIndex: 10 }}>
          <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={() => navigate('/home')}>
            <ArrowLeft size={20} />
          </button>
          <div className="nav-actions">
            {isEditing ? (
              <button className="btn-icon" style={{ background: 'var(--accent-color)', color: 'black' }} onClick={handleSaveProfile}>
                <Check size={20} />
              </button>
            ) : (
              <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={() => setIsEditing(true)}>
                <Edit2 size={20} />
              </button>
            )}
            <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={() => setActiveView('settings')}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="profile-avatar"
          />
          <div className="avatar-edit-btn">
            <Camera size={16} />
          </div>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
        </div>

        <h2 style={{ marginBottom: '4px', fontSize: '26px' }}>{user?.name || 'Guest'}</h2>
        <p className="subtitle" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
          @{user?.name?.toLowerCase().replace(/\s/g, '') || 'guest'}
        </p>
        
        <div style={{ maxWidth: '280px', margin: '0 auto' }}>
          {isEditing ? (
            <textarea 
              className="input-field" 
              value={profileData.bio} 
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textAlign: 'center', fontSize: '13px' }}
            />
          ) : (
            <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.9 }}>{profileData.bio}</p>
          )}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="stat-grid">
        <div className="stat-card" onClick={() => setActiveView('history')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{listenedCount}</div>
          <div className="stat-label">Episodes</div>
        </div>
        <div className="stat-card" onClick={() => setActiveView('downloads')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{downloads.length}</div>
          <div className="stat-label">{t('downloads')}</div>
        </div>
        <div className="stat-card" onClick={() => setActiveView('uploads')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{customEpisodes.length}</div>
          <div className="stat-label">Uploads</div>
        </div>
        <div className="stat-card" onClick={() => setActiveView('liked')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{likes.length}</div>
          <div className="stat-label">Favorites</div>
        </div>
      </div>

      {/* Analytics Insight */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-input) 100%)' }}>
        <div style={{ background: 'var(--secondary-color)', padding: '12px', borderRadius: '16px', color: 'white' }}>
          <BarChart2 size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Listening Persona</h4>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{topCategory} Explorer</div>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-input)', borderRadius: '2px', marginTop: '8px' }}>
            <div style={{ width: '70%', height: '100%', background: 'var(--accent-color)', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>

      {/* Profile Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="episode-card" style={{ alignItems: 'center' }} onClick={() => setActiveView('liked')}>
          <Heart size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Liked Episodes ({likes.length})</div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }} onClick={() => setActiveView('downloads')}>
          <Download size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Downloaded Content</div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }} onClick={() => setActiveView('history')}>
          <Clock size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Listening History ({history.length})</div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>

        {user?.role === 'admin' && (
          <div className="episode-card" style={{ alignItems: 'center' }} onClick={() => navigate('/admin')}>
            <ShieldAlert size={20} color="#ff9f43" style={{ margin: '0 8px' }} />
            <div style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: '#ff9f43' }}>Admin Panel</div>
            {pendingEpisodes.length > 0 && (
              <div style={{ background: '#ff9f43', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                {pendingEpisodes.length}
              </div>
            )}
            <ArrowRight size={16} color="#ff9f43" />
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: '40px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}>
        <LogOut size={20} /> Log Out
      </button>
    </div>
  );
}
