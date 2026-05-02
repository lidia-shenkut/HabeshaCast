import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (currentEpisode && currentEpisode.audioUrl) {
      const url = `http://${window.location.hostname}:5000${currentEpisode.audioUrl}`;
      if (audioRef.current.src !== url) {
        audioRef.current.src = url;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [currentEpisode]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.playbackRate = speed;
  }, [speed]);

  const playEpisode = (episode, forcePlay = false) => {
    if (currentEpisode?.id === episode.id) {
      if (forcePlay) {
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (percentage) => {
    const time = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(percentage);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const stopEpisode = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.src = "";
    setCurrentEpisode(null);
    setProgress(0);
    setCurrentTime(0);
  };

  return (
    <AudioContext.Provider value={{
      currentEpisode,
      isPlaying,
      setIsPlaying,
      progress,
      duration,
      currentTime,
      speed,
      setSpeed,
      playEpisode,
      stopEpisode,
      seek,
      formatTime
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
