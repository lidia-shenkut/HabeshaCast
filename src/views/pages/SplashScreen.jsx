import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎤</div>
        <h1 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '8px' }}>HabeshaCast</h1>
        <p style={{ color: 'var(--accent-color)', fontSize: '16px', letterSpacing: '1px' }}>Learn. Listen. Grow.</p>
      </div>
    </div>
  );
}
