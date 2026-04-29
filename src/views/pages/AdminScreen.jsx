import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Trash2, ShieldAlert } from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';

export default function AdminScreen() {
  const navigate = useNavigate();
  const { pendingEpisodes, approveEpisode, deleteEpisode } = useUserData();

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ marginBottom: 0 }}>Admin Dashboard</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #ff9f43' }}>
        <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '50%' }}>
          <ShieldAlert size={24} color="#ff9f43" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Approvals</h4>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>{pendingEpisodes.length} Episodes</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Needs Review</h3>
      
      {pendingEpisodes.length > 0 ? pendingEpisodes.map(ep => (
        <div key={ep.id} className="episode-card" style={{ padding: '16px', flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="episode-thumb" style={{ background: ep.color }}></div>
            <div className="episode-info">
              <div className="episode-title">{ep.title}</div>
              <div className="episode-author">{ep.author} • {ep.category}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ep.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '10px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}
              onClick={() => deleteEpisode(ep.id)}
            >
              <Trash2 size={16} style={{ marginRight: '8px' }} /> Reject
            </button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '10px' }}
              onClick={() => approveEpisode(ep.id)}
            >
              <Check size={16} style={{ marginRight: '8px' }} /> Approve
            </button>
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
