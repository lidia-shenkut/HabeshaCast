import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, User } from 'lucide-react';

export default function BottomNav() {
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
