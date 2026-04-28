import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, Play, Search, Bell, Heart, Download, Settings, Bookmark, Clock, MoreVertical, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Education', icon: '📚' },
  { id: 2, name: 'History', icon: '🏛️' },
  { id: 3, name: 'Skills', icon: '💼' },
  { id: 4, name: 'Stories', icon: '🎧' },
  { id: 5, name: 'Life Advice', icon: '🧠' }
];

const MOCK_EPISODES = [
  { id: 101, title: 'How to start a business in Ethiopia', author: 'Abebe T.', duration: '15:20', category: 'Skills', color: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' },
  { id: 102, title: 'The story of Emperor Tewodros II', author: 'Dr. Tadesse', duration: '42:10', category: 'History', color: 'linear-gradient(135deg, #4834D4, #686DE0)' },
  { id: 103, title: 'Mastering Amharic Poetry', author: 'Hirut M.', duration: '28:45', category: 'Education', color: 'linear-gradient(135deg, #6AB04C, #BADC58)' },
  { id: 104, title: 'Tech Startups in Addis Ababa', author: 'Elias W.', duration: '35:00', category: 'Skills', color: 'linear-gradient(135deg, #130F40, #30336B)' },
  { id: 105, title: 'Traditional Folktales', author: 'Grandma Zenebech', duration: '12:05', category: 'Stories', color: 'linear-gradient(135deg, #F0932B, #FFBE76)' }
];

// === COMPONENTS ===

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  
  if (path === '/' || path === '/login' || path.startsWith('/player')) return null;

  return (
    <div className="bottom-nav">
      <Link to="/home" className={`nav-item ${path === '/home' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/category/Explore" className={`nav-item ${path.startsWith('/category') ? 'active' : ''}`}>
        <Compass size={24} />
        <span>Explore</span>
      </Link>
      <Link to="/upload" className={`nav-item ${path === '/upload' ? 'active' : ''}`}>
        <PlusSquare size={24} />
        <span>Upload</span>
      </Link>
      <Link to="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </Link>
    </div>
  );
}



function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-gradient)' }}>
      <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎤</div>
        <h1 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '8px' }}>HabeshaCast</h1>
        <p style={{ color: 'var(--accent-color)', fontSize: '16px', letterSpacing: '1px' }}>Learn. Listen. Grow.</p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen" style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎤</div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue learning</p>
      </div>
      
      <div className="input-group">
        <input type="email" className="input-field" placeholder="Email Address" style={{ marginBottom: '16px' }} />
        <input type="password" className="input-field" placeholder="Password" />
      </div>
      
      <button className="btn btn-primary" style={{ marginBottom: '16px' }} onClick={() => navigate('/home')}>
        Login
      </button>
      <button className="btn btn-secondary">
        Create Account
      </button>
    </div>
  );
}

function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <div>
          <p className="subtitle">Good Morning,</p>
          <h2 style={{ marginBottom: 0 }}>Lidia 👋</h2>
        </div>
        <div className="nav-actions">
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

      {MOCK_EPISODES.map(ep => (
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

function CategoryScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryName = location.pathname.split('/').pop() || 'Explore';
  
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

      {episodes.length > 0 ? episodes.map(ep => (
        <div key={ep.id} className="episode-card" onClick={() => navigate(`/player/${ep.id}`)}>
          <div className="episode-thumb" style={{ background: ep.color }}></div>
          <div className="episode-info">
            <div className="episode-title">{ep.title}</div>
            <div className="episode-author">{ep.author} • {ep.duration}</div>
          </div>
          <div className="episode-actions" style={{ flexDirection: 'column', gap: '8px' }}>
             <Download size={18} color="var(--text-muted)" />
          </div>
        </div>
      )) : (
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>
          No episodes found in this category yet.
        </div>
      )}
    </div>
  );
}

function PlayerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = parseInt(location.pathname.split('/').pop());
  const episode = MOCK_EPISODES.find(e => e.id === id) || MOCK_EPISODES[0];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <div className="screen" style={{ background: 'var(--bg-dark)' }}>
      <div className="top-nav">
        <button className="btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Now Playing</div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{episode.category}</div>
        </div>
        <button className="btn-icon"><MoreVertical size={20} /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          width: '280px', height: '280px', 
          borderRadius: '24px', 
          background: episode.color,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          marginBottom: '40px'
        }}></div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{episode.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{episode.author}</p>
          </div>
          <button className="btn-icon" style={{ background: 'transparent' }}><Heart size={24} color="var(--text-muted)" /></button>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginBottom: '32px' }}>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', marginBottom: '8px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--secondary-color)', borderRadius: '2px', position: 'absolute', top: 0, left: 0 }}></div>
            <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '-4px', left: `calc(${progress}% - 6px)`, boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>04:12</span>
            <span>{episode.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', width: '100%' }}>
          <button className="btn-icon" style={{ background: 'transparent' }}><span style={{ fontSize: '14px', fontWeight: 600 }}>1x</span></button>
          <button className="btn-icon" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.05)' }}><SkipBack size={24} fill="currentColor" /></button>
          <button className="btn-icon" style={{ width: '72px', height: '72px', background: 'var(--primary-color)', boxShadow: 'var(--shadow-glow)' }} onClick={() => setIsPlaying(!isPlaying)}>
            <Play size={32} fill="currentColor" style={{ display: isPlaying ? 'none' : 'block', marginLeft: '4px' }} />
            {isPlaying && <div style={{ width: '20px', height: '20px', display: 'flex', gap: '6px' }}>
                <div style={{ flex: 1, background: 'white', borderRadius: '2px' }}></div>
                <div style={{ flex: 1, background: 'white', borderRadius: '2px' }}></div>
              </div>}
          </button>
          <button className="btn-icon" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.05)' }}><SkipForward size={24} fill="currentColor" /></button>
          <button className="btn-icon" style={{ background: 'transparent' }}><Download size={20} color="var(--text-muted)" /></button>
        </div>
      </div>
    </div>
  );
}

function UploadScreen() {
  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>Create Episode</h2>
      </div>

      <div className="glass-panel" style={{ padding: '32px 20px', textAlign: 'center', marginBottom: '24px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.2)' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(108, 92, 231, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--secondary-color)' }}>
          <PlusSquare size={32} />
        </div>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Select Audio File</h3>
        <p className="subtitle" style={{ marginBottom: '16px' }}>Supports MP3, WAV up to 50MB</p>
        <button className="btn btn-secondary" style={{ width: 'auto' }}>Browse Files</button>
      </div>

      <div className="input-group">
        <input type="text" className="input-field" placeholder="Episode Title" style={{ marginBottom: '16px' }} />
        <textarea className="input-field" placeholder="Description..." rows="4" style={{ marginBottom: '16px', resize: 'none' }}></textarea>
        <select className="input-field" style={{ marginBottom: '16px', appearance: 'none' }}>
          <option value="" disabled selected>Select Category</option>
          <option value="Education">Education</option>
          <option value="History">History</option>
          <option value="Skills">Skills</option>
        </select>
      </div>

      <button className="btn btn-primary">Publish Episode</button>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>Profile</h2>
        <button className="btn-icon"><Settings size={20} /></button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))', marginBottom: '16px' }}></div>
        <h2 style={{ marginBottom: '4px' }}>Lidia Mekonnen</h2>
        <p style={{ color: 'var(--accent-color)', fontSize: '14px', fontWeight: 500 }}>Creator & Listener</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>42</h3>
          <p className="subtitle">Listened</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>15</h3>
          <p className="subtitle">Downloads</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>3</h3>
          <p className="subtitle">Uploaded</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Heart size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Liked Episodes</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Download size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Downloaded Content</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <div className="episode-card" style={{ alignItems: 'center' }}>
          <Clock size={20} color="var(--text-muted)" style={{ margin: '0 8px' }} />
          <div style={{ flex: 1, fontSize: '16px', fontWeight: 500 }}>Listening History</div>
          <ArrowLeft size={16} color="var(--text-muted)" style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
      
      <button className="btn btn-secondary" style={{ marginTop: '32px', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.3)' }}>Log Out</button>
    </div>
  );
}

// === MAIN APP ===

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/category/:name" element={<CategoryScreen />} />
          <Route path="/player/:id" element={<PlayerScreen />} />
          <Route path="/upload" element={<UploadScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
