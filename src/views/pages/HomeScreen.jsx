import { useNavigate } from 'react-router-dom';
import { Search, Bell, Play } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../models/mockData';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <div>
          <p className="subtitle">Good Morning,</p>
          <h2 style={{ marginBottom: 0 }}>Lidia 👋</h2>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn-icon"><Search size={20} /></button>
          <button className="btn-icon"><Bell size={20} /></button>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Categories</h3>
      <div className="horizontal-scroll">
        {MOCK_CATEGORIES.map(cat => (
          <div key={cat.id} className="category-pill" onClick={() => navigate(`/category/${cat.name}`)}>
            <span style={{ marginRight: '6px' }}>{cat.icon}</span> {cat.name}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ marginBottom: 0 }}>Trending Now 🔥</h3>
        <span style={{ color: 'var(--secondary-color)', fontSize: '14px', fontWeight: 500 }}>See all</span>
      </div>

      {allEpisodes.map(ep => (
        <div key={ep.id} className="episode-card" onClick={() => navigate(`/player/${ep.id}`)}>
          <div className="episode-thumb" style={{ background: ep.color }}></div>
          <div className="episode-info">
            <div className="episode-title">{ep.title}</div>
            <div className="episode-author">{ep.author} • {ep.category}</div>
          </div>
          <div className="episode-actions">
            <button className="btn-icon" style={{ width: '36px', height: '36px' }} onClick={(e) => { e.stopPropagation(); navigate(`/player/${ep.id}`); }}>
              <Play size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
