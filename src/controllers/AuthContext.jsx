import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = `http://${window.location.hostname}:5000/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hc_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hc_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    const isFormData = profileData instanceof FormData;
    const res = await fetch(`${API_URL}/profile/${user.id}`, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? profileData : JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
