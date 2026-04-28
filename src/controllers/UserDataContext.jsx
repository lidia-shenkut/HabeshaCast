import { createContext, useContext, useState, useEffect } from 'react';

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

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('hc_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('hc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('hc_playback', JSON.stringify(playbackProgress));
  }, [playbackProgress]);

  // SMART FEATURE: Offline downloads tracking
  const toggleDownload = (episodeId) => {
    setDownloads(prev => 
      prev.includes(episodeId) 
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  // SMART FEATURE: Resume playback & Analytics tracking
  const updatePlayback = (episode, progressPercentage) => {
    // Save progress
    setPlaybackProgress(prev => ({
      ...prev,
      [episode.id]: progressPercentage
    }));

    // Add to history for analytics if not already there recently
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== episode.id);
      return [{ id: episode.id, category: episode.category, timestamp: Date.now() }, ...filtered].slice(0, 20);
    });
  };

  // Calculate most listened category for Analytics
  const getTopCategory = () => {
    if (history.length === 0) return "None";
    const counts = history.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  return (
    <UserDataContext.Provider value={{ 
      downloads, 
      toggleDownload, 
      history, 
      playbackProgress, 
      updatePlayback,
      getTopCategory
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
