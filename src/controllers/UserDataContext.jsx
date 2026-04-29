import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EPISODES } from '../models/mockData';

const UserDataContext = createContext();

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

  const [customEpisodes, setCustomEpisodes] = useState(() => {
    const saved = localStorage.getItem('hc_custom_episodes');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever state changes
  useEffect(() => { localStorage.setItem('hc_downloads', JSON.stringify(downloads)); }, [downloads]);
  useEffect(() => { localStorage.setItem('hc_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('hc_playback', JSON.stringify(playbackProgress)); }, [playbackProgress]);
  useEffect(() => { localStorage.setItem('hc_likes', JSON.stringify(likes)); }, [likes]);
  useEffect(() => { localStorage.setItem('hc_custom_episodes', JSON.stringify(customEpisodes)); }, [customEpisodes]);

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

  // CREATOR FEATURES
  const uploadEpisode = (episodeData) => {
    const newEpisode = {
      ...episodeData,
      id: Date.now(),
      duration: '0:00', // Mock duration for uploads
      color: 'linear-gradient(135deg, #10ac84, #1dd1a1)',
      approved: false, // Needs admin approval
    };
    setCustomEpisodes(prev => [...prev, newEpisode]);
  };

  // ADMIN FEATURES
  const approveEpisode = (id) => {
    setCustomEpisodes(prev => prev.map(ep => ep.id === id ? { ...ep, approved: true } : ep));
  };

  const deleteEpisode = (id) => {
    setCustomEpisodes(prev => prev.filter(ep => ep.id !== id));
    setLikes(prev => prev.filter(l => l !== id));
    setDownloads(prev => prev.filter(d => d !== id));
  };

  const allEpisodes = [...MOCK_EPISODES, ...customEpisodes.filter(e => e.approved)];
  const pendingEpisodes = customEpisodes.filter(e => !e.approved);

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
