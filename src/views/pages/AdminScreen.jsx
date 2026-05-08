import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Trash2, ShieldAlert, Play, Pause, UserX, AlertTriangle } from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import { useAudio } from '../../controllers/AudioContext';
import { useLanguage } from '../../controllers/LanguageContext';

export default function AdminScreen() {
  const navigate = useNavigate();
  const { pendingEpisodes, approveEpisode, deleteEpisode, blockUser } = useUserData();
  const { playEpisode, currentEpisode, isPlaying } = useAudio();
  const { t } = useLanguage();

  const handleBlock = async (userId, name) => {
    if (window.confirm(`Are you sure you want to BLOCK ${name}? They will no longer be able to log in.`)) {
      await blockUser(userId);
      alert(`${name} has been blocked.`);
    }
  };

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ marginBottom: 0 }}>{t('adminDashboard')}</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #ff9f43' }}>
        <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '50%' }}>
          <ShieldAlert size={24} color="#ff9f43" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>{t('needsReview')}</h4>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>{pendingEpisodes.length} Episodes</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>{t('needsReview')}</h3>
      
      {pendingEpisodes.length > 0 ? pendingEpisodes.map(ep => (
        <div key={ep.id} className="episode-card" style={{ padding: '16px', flexDirection: 'column', alignItems: 'stretch', position: 'relative' }}>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="episode-thumb" style={{ background: ep.color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button 
                className="btn-icon" 
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', width: '40px', height: '40px' }}
                onClick={() => playEpisode(ep)}
              >
                {currentEpisode?.id === ep.id && isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
              </button>
            </div>
            <div className="episode-info">
              <div className="episode-title">{ep.title}</div>
              <div className="episode-author">By: {ep.author} ({ep.creator?.email || 'Unknown User'})</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-color)', fontWeight: 600, marginTop: '2px' }}>Category: {ep.category}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ep.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          {ep.creator?.isBlocked && (
            <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', border: '1px solid rgba(255, 107, 107, 0.2)' }}>
              <AlertTriangle size={14} color="#ff6b6b" />
              <span style={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 600 }}>Uploader is already BLOCKED</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '8px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)', fontSize: '13px' }}
              onClick={() => deleteEpisode(ep.id)}
            >
              <Trash2 size={14} style={{ marginRight: '6px' }} /> {t('reject')}
            </button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '8px', fontSize: '13px' }}
              onClick={() => approveEpisode(ep.id)}
            >
              <Check size={14} style={{ marginRight: '6px' }} /> {t('approve')}
            </button>
            {ep.creator && !ep.creator.isBlocked && (
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', color: '#ff4757', borderColor: 'rgba(255, 71, 87, 0.3)', fontSize: '13px' }}
                onClick={() => handleBlock(ep.creator._id, ep.creator.name)}
              >
                <UserX size={14} style={{ marginRight: '6px' }} /> {t('blockUser')}
              </button>
            )}
          </div>
        </div>
      )) : (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
          <Check size={48} color="var(--accent-color)" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>All caught up! No pending episodes.</p>
        </div>
      )}
    </div>
  );
}
