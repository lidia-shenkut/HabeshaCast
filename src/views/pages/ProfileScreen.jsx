import { useState } from 'react';
import { 
  Settings, Heart, Download, Clock, ArrowRight, BarChart2, 
  ShieldAlert, Globe, Camera, Edit2, Bell, Lock, Eye, 
  Award, Star, Zap, User, Mail, Phone, MapPin, LogOut
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';
import { useAuth } from '../../controllers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../controllers/LanguageContext';
import { useTheme } from '../../controllers/ThemeContext';

export default function ProfileScreen() {
  const { downloads, history, getTopCategory, likes, customEpisodes, pendingEpisodes, allEpisodes } = useUserData();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: "Passionate storyteller and podcast enthusiast from Addis Ababa. 🎙️",
    phone: "+251 911 234 567",
    location: "Addis Ababa, Ethiopia",
    interests: ["Education", "History", "Storytelling"]
  });

  const listenedCount = new Set(history.map(h => h.id)).size;
  const topCategory = getTopCategory();
  const recentEpisodes = allEpisodes.slice(0, 3); // For Saved Items

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  const badges = [
    { name: 'Early Bird', active: true, icon: <Zap size={20} /> },
    { name: 'Storyteller', active: true, icon: <Zap size={20} /> },
    { name: 'Top Listener', active: true, icon: <Star size={20} /> },
    { name: 'Educator', active: false, icon: <Award size={20} /> },
    { name: 'Creator', active: false, icon: <Award size={20} /> },
  ];

  return (
    <div className="screen scrollable">
      {/* Premium Header */}
      <div className="profile-header">
        <div className="top-nav" style={{ marginBottom: 0, position: 'absolute', top: 20, left: 20, right: 20, zIndex: 10 }}>
          <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={() => navigate(-1)}>
            <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="nav-actions">
            <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }} onClick={() => setIsEditing(!isEditing)}>
              <Edit2 size={20} />
            </button>
            <button className="btn-icon" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="profile-avatar-container">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'Guest'}&background=6c5ce7&color=fff&size=200`} 
            alt="Profile" 
            className="profile-avatar"
          />
          <div className="avatar-edit-btn">
            <Camera size={16} />
          </div>
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
        <div className="stat-card">
          <div className="stat-value">{listenedCount}</div>
          <div className="stat-label">Episodes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{downloads.length}</div>
          <div className="stat-label">{t('downloads')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{customEpisodes.length}</div>
          <div className="stat-label">Uploads</div>
        </div>
        <div className="stat-card">
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

      {/* Achievements Section */}
      <div className="section-header">
        <h3 className="section-title">Achievements</h3>
        <span style={{ fontSize: '12px', color: 'var(--secondary-color)', fontWeight: 600 }}>See All</span>
      </div>
      <div className="badge-scroll">
        {badges.map((badge, idx) => (
          <div key={idx} className={`badge-item ${badge.active ? 'active' : ''}`}>
            <div className="badge-icon">
              {badge.icon}
            </div>
            <div className="badge-name">{badge.name}</div>
          </div>
        ))}
      </div>

      {/* Personal Info Section */}
      <div className="section-header">
        <h3 className="section-title">Personal Information</h3>
      </div>
      <div className="glass-panel" style={{ padding: '0 16px' }}>
        <div className="editable-field">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} color="var(--text-muted)" />
            <span className="editable-label">Email</span>
          </div>
          <span className="editable-value">{user?.email || 'lidia@example.com'}</span>
        </div>
        <div className="editable-field">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={18} color="var(--text-muted)" />
            <span className="editable-label">Phone</span>
          </div>
          {isEditing ? (
            <input 
              className="input-field" 
              style={{ width: '150px', padding: '4px 8px', fontSize: '14px' }}
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            />
          ) : (
            <span className="editable-value">{profileData.phone}</span>
          )}
        </div>
        <div className="editable-field" style={{ borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={18} color="var(--text-muted)" />
            <span className="editable-label">Location</span>
          </div>
          <span className="editable-value">{profileData.location}</span>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="section-header">
        <h3 className="section-title">Preferences</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="preference-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--secondary-color)' }}>
              <Zap size={20} />
            </div>
            <div style={{ fontWeight: 600 }}>Dark Mode</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="preference-row" onClick={toggleLanguage} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(0, 210, 211, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <Globe size={20} />
            </div>
            <div style={{ fontWeight: 600 }}>{t('language')}</div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--secondary-color)', fontWeight: 600 }}>
            {language === 'en' ? 'English' : 'አማርኛ'}
          </div>
        </div>

        <div className="preference-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 159, 67, 0.1)', padding: '10px', borderRadius: '12px', color: '#ff9f43' }}>
              <Bell size={20} />
            </div>
            <div style={{ fontWeight: 600 }}>Notifications</div>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Security Section */}
      <div className="section-header">
        <h3 className="section-title">Security & Privacy</h3>
      </div>
      <div className="glass-panel" style={{ padding: '0 16px' }}>
        <div className="editable-field" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '14px' }}>Change Password</span>
          </div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>
        <div className="editable-field" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '14px' }}>Two-Factor Auth</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enabled</div>
        </div>
        <div className="editable-field" style={{ borderBottom: 'none', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Eye size={18} color="var(--text-muted)" />
            <span style={{ fontSize: '14px' }}>Privacy Settings</span>
          </div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Account Actions */}
      <div style={{ marginTop: '40px', paddingBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ border: '1px solid rgba(255, 107, 107, 0.3)', color: '#ff6b6b' }}>
          <LogOut size={20} /> Log Out
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
          HabeshaCast v1.2.0 • Made with ❤️ in Ethiopia
        </p>
      </div>
    </div>
  );
}
