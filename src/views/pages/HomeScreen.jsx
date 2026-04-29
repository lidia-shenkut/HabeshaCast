import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Play, X } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../models/mockData';
import ThemeToggle from '../components/ThemeToggle';
import { useUserData } from '../../controllers/UserDataContext';
import { useLanguage } from '../../controllers/LanguageContext';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { allEpisodes } = useUserData();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredEpisodes = allEpisodes.filter(ep => 
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        {!isSearching ? (
          <>
            <div>
              <p className="subtitle">{t('welcome')}</p>
              <h2 style={{ marginBottom: 0 }}>Lidia 👋</h2>
            </div>
            <div className="nav-actions">
              <ThemeToggle />
              <button className="btn-icon" onClick={() => setIsSearching(true)}><Search size={20} /></button>
              <button className="btn-icon"><Bell size={20} /></button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                autoFocus
                type="text" 
                placeholder={t('search')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px 12px 44px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '14px'
                }} 
              />
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button className="btn-icon" onClick={() => { setIsSearching(false); setSearchQuery(''); }}><X size={20} /></button>
          </div>
        )}
      </div>

      {!isSearching && (
        <>
          <h3 style={{ marginBottom: '16px' }}>{t('categories')}</h3>
          <div className="horizontal-scroll">
            {MOCK_CATEGORIES.map(cat => (
              <div key={cat.id} className="category-pill" onClick={() => navigate(`/category/${cat.name}`)}>
                <span style={{ marginRight: '6px' }}>{cat.icon}</span> {cat.name}
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px' }}>
        <h3 style={{ marginBottom: 0 }}>{isSearching ? `${t('search')} Results` : t('trending')}</h3>
        {!isSearching && <span style={{ color: 'var(--secondary-color)', fontSize: '14px', fontWeight: 500 }}>{t('seeAll')}</span>}
      </div>

      {filteredEpisodes.length > 0 ? (
        filteredEpisodes.map(ep => (
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
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No episodes found
        </div>
      )}
    </div>
  );
}
