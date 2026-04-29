import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/AuthContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="screen" style={{ justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--secondary-color), var(--accent-color))', borderRadius: '24px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
          <span style={{ fontSize: '32px', color: 'white', fontWeight: 'bold' }}>H</span>
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>HabeshaCast</h1>
        <p className="subtitle">Listen to the voices of Ethiopia</p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {error && <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <div className="input-group">
          {!isLogin && (
            <input 
              type="text" 
              className="input-field" 
              placeholder="Full Name" 
              style={{ marginBottom: '16px' }} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          )}
          <input 
            type="email" 
            className="input-field" 
            placeholder="Email Address" 
            style={{ marginBottom: '16px' }} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Password" 
            style={{ marginBottom: '24px' }} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginBottom: '16px' }}>
          {isLogin ? 'Log In' : 'Create Account'}
        </button>
        
        <button 
          type="button"
          className="btn btn-secondary" 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Create an Account' : 'Already have an account? Log In'}
        </button>
      </form>
    </div>
  );
}
