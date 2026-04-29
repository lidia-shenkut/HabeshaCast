import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EPISODES } from '../models/mockData';

const UserDataContext = createContext();

const API_URL = 'http://localhost:5000/api/episodes';

export function UserDataProvider({ children }) {
  // Load data from local storage or set defaults
  const [downloads, setDownloads] = useState(() => {
    const saved = localStorage.getItem('hc_downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('hc_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [playbackProgress, setPlaybackProgress] = useState(() => {
    const saved = localStorage.getItem('hc_playback');
    return saved ? JSON.parse(saved) : {};
  });

  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem('hc_likes');
    return saved ? JSON.parse(saved) : [];
  });

  // DB States
  const [dbEpisodes, setDbEpisodes] = useState([]);
  const [pendingDbEpisodes, setPendingDbEpisodes] = useState([]);

  // Save to local storage whenever state changes
  useEffect(() => { localStorage.setItem('hc_downloads', JSON.stringify(downloads)); }, [downloads]);
  useEffect(() => { localStorage.setItem('hc_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('hc_playback', JSON.stringify(playbackProgress)); }, [playbackProgress]);
  useEffect(() => { localStorage.setItem('hc_likes', JSON.stringify(likes)); }, [likes]);

  // Fetch episodes from DB
  const fetchEpisodes = async () => {
    try {
      const res = await fetch(`${API_URL}/approved`);
      const data = await res.json();
      setDbEpisodes(data.map(ep => ({ ...ep, id: ep._id })));
      
      const pRes = await fetch(`${API_URL}/pending`);
      const pData = await pRes.json();
      setPendingDbEpisodes(pData.map(ep => ({ ...ep, id: ep._id })));
    } catch (err) {
      console.error("Failed to fetch episodes:", err);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  // SMART FEATURE: Offline downloads tracking
  const toggleDownload = (episodeId) => {
    setDownloads(prev => prev.includes(episodeId) ? prev.filter(id => id !== episodeId) : [...prev, episodeId]);
  };

  // SMART FEATURE: Likes & Follows
  const toggleLike = (episodeId) => {
    setLikes(prev => prev.includes(episodeId) ? prev.filter(id => id !== episodeId) : [...prev, episodeId]);
  };

  // SMART FEATURE: Resume playback & Analytics tracking
  const updatePlayback = (episode, progressPercentage) => {
    setPlaybackProgress(prev => ({ ...prev, [episode.id]: progressPercentage }));
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== episode.id);
      return [{ id: episode.id, category: episode.category, timestamp: Date.now() }, ...filtered].slice(0, 20);
    });
  };

  const getTopCategory = () => {
    if (history.length === 0) return "None";
    const counts = history.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // CREATOR FEATURES (Backend Integrated)
  const uploadEpisode = async (episodeData) => {
    try {
      const isFormData = episodeData instanceof FormData;
      
      await fetch(API_URL, {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? episodeData : JSON.stringify(episodeData)
      });
      fetchEpisodes();
    } catch (err) {
      console.error(err);
    }
  };

  // ADMIN FEATURES (Backend Integrated)
  const approveEpisode = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/approve`, { method: 'PATCH' });
      fetchEpisodes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEpisode = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchEpisodes();
    } catch (err) {
      console.error(err);
    }
  };

  const allEpisodes = [...MOCK_EPISODES, ...dbEpisodes];
  const pendingEpisodes = pendingDbEpisodes;
  const customEpisodes = [...dbEpisodes, ...pendingDbEpisodes]; // Used in profile for counting uploads

  return (
    <UserDataContext.Provider value={{ 
      downloads, toggleDownload, 
      likes, toggleLike,
      history, playbackProgress, updatePlayback, getTopCategory,
      customEpisodes, uploadEpisode, approveEpisode, deleteEpisode,
      allEpisodes, pendingEpisodes
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
