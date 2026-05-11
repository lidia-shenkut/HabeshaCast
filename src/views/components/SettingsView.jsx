import { useState } from 'react';
import { 
  ArrowLeft, User, Shield, Zap, Bell, Database, Info, 
  ChevronRight, Globe, Moon, Sun, Volume2, FastForward, 
  Wifi, Trash2, LogOut, Lock, Key, CreditCard, HelpCircle, 
  FileText, ShieldCheck, Check
} from 'lucide-react';
import { useLanguage } from '../../controllers/LanguageContext';
import { useTheme } from '../../controllers/ThemeContext';
import { useAuth } from '../../controllers/AuthContext';

export default function SettingsView({ onClose }) {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [playbackQuality, setPlaybackQuality] = useState('high');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');
  const [skipInterval, setSkipInterval] = useState('15');
  const [notifications, setNotifications] = useState({
    push: true,
    episodes: true,
    marketing: false
  });
  const [wifiOnly, setWifiOnly] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

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
          />
          <SettingRow 
            icon={Lock} 
            label={t('security')} 
            color="var(--accent-color)"
          />
          <div className="setting-item no-hover">
            <div className="setting-icon" style={{ color: 'var(--secondary-color)' }}>
              <ShieldCheck size={20} />
            </div>
            <div className="setting-content">
              <span className="setting-label">{t('twoFactor')}</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
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
            value={t(playbackQuality)}
            onClick={() => {
              const qualities = ['dataSaver', 'normal', 'high'];
              const next = qualities[(qualities.indexOf(playbackQuality) + 1) % qualities.length];
              setPlaybackQuality(next);
            }}
            color="var(--neon-blue)"
          />

          <SettingRow 
            icon={FastForward} 
            label={t('playbackSpeed')} 
            value={`${playbackSpeed}x`}
            onClick={() => {
              const speeds = ['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'];
              const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
              setPlaybackSpeed(next);
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
              <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} />
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
              <input type="checkbox" checked={notifications.episodes} onChange={() => setNotifications({...notifications, episodes: !notifications.episodes})} />
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
              <input type="checkbox" checked={wifiOnly} onChange={() => setWifiOnly(!wifiOnly)} />
              <span className="slider"></span>
            </label>
          </div>
          <SettingRow 
            icon={Database} 
            label={t('clearCache')} 
            value="124 MB"
            color="#ff6b6b"
            onClick={() => alert('Cache cleared!')}
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

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
