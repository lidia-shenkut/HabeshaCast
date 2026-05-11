import { useState, useRef } from 'react';
import { 
  ArrowLeft, User, Shield, Zap, Bell, Database, Info, 
  ChevronRight, Globe, Moon, Sun, Volume2, FastForward, 
  Wifi, Trash2, LogOut, Lock, Key, CreditCard, HelpCircle, 
  FileText, ShieldCheck, Check, X, Camera, MapPin, Phone
} from 'lucide-react';
import { useLanguage } from '../../controllers/LanguageContext';
import { useTheme } from '../../controllers/ThemeContext';
import { useAuth } from '../../controllers/AuthContext';
import { useSettings } from '../../controllers/SettingsContext';
import { useAudio } from '../../controllers/AudioContext';

export default function SettingsView({ onClose }) {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { speed, setSpeed } = useAudio();
  
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'security', null
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(profileForm);
      setActiveModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsSaving(true);
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      alert("Password updated successfully!");
      setActiveModal(null);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
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

  const languages = [
    { code: 'en', label: 'english' },
    { code: 'am', label: 'amharic' },
    { code: 'om', label: 'oromiffa' },
    { code: 'ti', label: 'tigrinya' }
  ];

  const handleLanguageChange = () => {
    const currentIdx = languages.findIndex(l => l.code === language);
    const nextIdx = (currentIdx + 1) % languages.length;
    setLanguage(languages[nextIdx].code);
  };

  const SettingRow = ({ icon: Icon, label, value, onClick, children, color = "var(--text-muted)" }) => (
    <div className="setting-item" onClick={onClick}>
      <div className="setting-icon" style={{ color }}>
        <Icon size={20} />
      </div>
      <div className="setting-content">
        <span className="setting-label">{label}</span>
        {value && <span className="setting-value">{value}</span>}
      </div>
      {children || <ChevronRight size={18} className="setting-chevron" />}
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div className="settings-section-header">
      <h3>{title}</h3>
    </div>
  );

  const Modal = ({ title, children, onCancel, onConfirm, confirmLabel }) => (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onCancel}><X size={20}/></button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-overlay">
      <div className="settings-header">
        <button className="btn-icon" onClick={onClose}>
          <ArrowLeft size={24} />
        </button>
        <h2>{t('settings')}</h2>
        <div style={{ width: 44 }}></div>
      </div>

      <div className="settings-content-scrollable">
        {/* Account Section */}
        <SectionHeader title={t('account')} />
        <div className="glass-panel settings-group">
          <SettingRow 
            icon={User} 
            label={t('editProfile')} 
            value={user?.name}
            color="var(--primary-color)"
            onClick={() => setActiveModal('profile')}
          />
          <SettingRow 
            icon={Lock} 
            label={t('security')} 
            color="var(--accent-color)"
            onClick={() => setActiveModal('security')}
          />
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: 'var(--secondary-color)' }}>
              <ShieldCheck size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('twoFactor')}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.twoFactorEnabled} onChange={(e) => updateSetting('twoFactorEnabled', e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Experience Section */}
        <SectionHeader title={t('experience')} />
        <div className="glass-panel settings-group">
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: 'var(--neon-purple)' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div className="setting-content">
              <span className="setting-label">Dark Mode</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={isDark} onChange={toggleTheme} />
              <span className="slider"></span>
            </label>
          </div>
          
          <SettingRow 
            icon={Globe} 
            label={t('language')} 
            value={t(languages.find(l => l.code === language).label)}
            onClick={handleLanguageChange}
            color="var(--accent-color)"
          />

          <SettingRow 
            icon={Volume2} 
            label={t('audioQuality')} 
            value={t(settings.audioQuality)}
            onClick={() => {
              const qualities = ['dataSaver', 'normal', 'high'];
              const next = qualities[(qualities.indexOf(settings.audioQuality) + 1) % qualities.length];
              updateSetting('audioQuality', next);
            }}
            color="var(--neon-blue)"
          />

          <SettingRow 
            icon={FastForward} 
            label={t('playbackSpeed')} 
            value={`${speed}x`}
            onClick={() => {
              const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
              const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
              setSpeed(next);
            }}
            color="#ff9f43"
          />
        </div>

        {/* Notifications Section */}
        <SectionHeader title={t('notifications')} />
        <div className="glass-panel settings-group">
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: '#f43f5e' }}>
              <Bell size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('pushNotifications')}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.pushNotifications} onChange={(e) => updateSetting('pushNotifications', e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: '#10b981' }}>
              <Zap size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('newEpisodeAlerts')}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.newEpisodeAlerts} onChange={(e) => updateSetting('newEpisodeAlerts', e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Storage Section */}
        <SectionHeader title={t('storage')} />
        <div className="glass-panel settings-group">
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: 'var(--accent-color)' }}>
              <Wifi size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('downloadWifi')}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={settings.downloadWifiOnly} onChange={(e) => updateSetting('downloadWifiOnly', e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
          <SettingRow 
            icon={Database} 
            label={t('clearCache')} 
            value="124 MB"
            color="#ff6b6b"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear cache?")) {
                alert('Cache cleared!');
              }
            }}
          />
        </div>

        {/* About Section */}
        <SectionHeader title={t('about')} />
        <div className="glass-panel settings-group">
          <SettingRow icon={HelpCircle} label={t('helpSupport')} />
          <SettingRow icon={FileText} label={t('privacyPolicy')} />
          <div className="setting-item no-hover">
            <div className="setting-icon">
              <Info size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('version')}</span>
            </div>
            <span className="setting-value">2.4.0-premium</span>
          </div>
        </div>

        <button className="btn btn-secondary logout-btn" onClick={logout}>
          <LogOut size={20} /> {t('logout')}
        </button>

        <div className="settings-footer">
          <div className="habesha-divider"></div>
          <p>© 2026 HabeshaCast AI. Made with ❤️ in Ethiopia.</p>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'profile' && (
        <Modal 
          title={t('editProfile')} 
          confirmLabel="Save Changes"
          onCancel={() => setActiveModal(null)}
          onConfirm={handleProfileUpdate}
        >
          <div className="avatar-section">
            <div className="modal-avatar-container" onClick={() => fileInputRef.current.click()}>
              <img 
                src={user?.avatar ? `http://${window.location.hostname}:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name}&background=6c5ce7&color=fff`} 
                alt="Avatar" 
              />
              <div className="avatar-overlay"><Camera size={16}/></div>
            </div>
            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleAvatarChange} />
          </div>
          <div className="form-group">
            <label>Display Name</label>
            <input className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea className="input-field" rows="3" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input className="input-field" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="input-field" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} />
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'security' && (
        <Modal 
          title="Security & Password" 
          confirmLabel="Update Password"
          onCancel={() => setActiveModal(null)}
          onConfirm={handlePasswordUpdate}
        >
          <div className="form-group">
            <label>Current Password</label>
            <input className="input-field" type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input className="input-field" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input className="input-field" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
          </div>
        </Modal>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .settings-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg-main);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border-bottom: var(--border-glass);
        }

        .settings-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(90deg, var(--text-main), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .settings-content-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          padding-bottom: 40px;
        }

        .settings-content-scrollable::-webkit-scrollbar { display: none; }

        .settings-section-header {
          margin: 24px 0 12px 4px;
        }

        .settings-section-header h3 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          font-weight: 800;
        }

        .settings-group {
          padding: 4px;
          overflow: hidden;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .setting-item:not(.no-hover):hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .setting-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .setting-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .setting-label {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-main);
        }

        .setting-value {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .setting-chevron {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .logout-btn {
          margin-top: 40px;
          background: rgba(244, 63, 94, 0.1) !important;
          color: #f43f5e !important;
          border: 1px solid rgba(244, 63, 94, 0.2) !important;
        }

        .logout-btn:hover {
          background: rgba(244, 63, 94, 0.2) !important;
          transform: translateY(-2px);
        }

        .settings-footer {
          margin-top: 40px;
          text-align: center;
          padding-bottom: 20px;
        }

        .settings-footer p {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 16px;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 400px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: scaleIn 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .modal-avatar-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          border: 3px solid var(--accent-color);
        }

        .modal-avatar-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .modal-avatar-container:hover .avatar-overlay {
          opacity: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
