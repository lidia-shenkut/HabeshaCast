import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
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
