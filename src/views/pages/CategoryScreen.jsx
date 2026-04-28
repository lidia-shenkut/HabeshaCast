import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download } from 'lucide-react';
import { MOCK_EPISODES } from '../../models/mockData';
import { useUserData } from '../../controllers/UserDataContext';

export default function CategoryScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.pathname.split('/').pop() || 'Explore';
  
  const { downloads, toggleDownload } = useUserData();

  const episodes = categoryName === 'Explore' 
    ? MOCK_EPISODES 
    : MOCK_EPISODES.filter(e => e.category === decodeURIComponent(categoryName));

  return (
    <div className="screen scrollable">
      <div className="top-nav" style={{ marginBottom: '16px' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h2 style={{ marginBottom: 0 }}>{decodeURIComponent(categoryName)}</h2>
        <button className="btn-icon"><Search size={20} /></button>
      </div>

      <div className="horizontal-scroll" style={{ marginBottom: '16px' }}>
        <div className="category-pill active">Most Popular</div>
        <div className="category-pill">New Releases</div>
        <div className="category-pill">Offline Available</div>
      </div>

      {episodes.length > 0 ? episodes.map(ep => {
        const isDownloaded = downloads.includes(ep.id);
        
        return (
          <div key={ep.id} className="episode-card" onClick={() => navigate(`/player/${ep.id}`)}>
            <div className="episode-thumb" style={{ background: ep.color }}></div>
            <div className="episode-info">
              <div className="episode-title">{ep.title}</div>
              <div className="episode-author">{ep.author} • {ep.duration}</div>
            </div>
            <div className="episode-actions" style={{ flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn-icon" 
                style={{ width: '36px', height: '36px', background: 'transparent' }} 
                onClick={(e) => { e.stopPropagation(); toggleDownload(ep.id); }}
              >
                <Download size={18} color={isDownloaded ? 'var(--secondary-color)' : 'var(--text-muted)'} />
              </button>
            </div>
          </div>
        );
      }) : (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
          No episodes found in this category yet.
        </div>
      )}
    </div>
  );
}
