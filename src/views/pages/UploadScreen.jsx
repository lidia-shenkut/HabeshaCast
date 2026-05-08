import { useState, useRef, useEffect } from 'react';
import { 
  PlusSquare, CheckCircle, Music, Upload, X, Play, 
  Pause, Info, Globe, Tag, Scissors, Mic, Shield,
  ArrowRight, Save, Trash2, Zap, AlertTriangle, Sparkles,
  Volume2, Check, Square
} from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import { useAuth } from '../../controllers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../controllers/LanguageContext';

export default function UploadScreen() {
  const { uploadEpisode } = useUserData();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('English');
  const [audioFile, setAudioFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [success, setSuccess] = useState(false);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState(Array.from({ length: 40 }, () => 10));

  // Mock waveform bars for preview
  const [waveformBars] = useState(Array.from({ length: 40 }, () => Math.random() * 100));

  // Handle Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      // Setup Audio Visualizer
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `recorded-episode-${Date.now()}.webm`, { type: 'audio/webm' });
        handleFileSelect(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start visualization loop
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray);
        // Map frequency data to our 40 bars
        const newWaveform = [];
        for (let i = 0; i < 40; i++) {
          const sampleIndex = Math.floor((i / 40) * bufferLength);
          const value = (dataArray[sampleIndex] / 255) * 100;
          newWaveform.push(Math.max(10, value));
        }
        setLiveWaveform(newWaveform);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    }
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.onloadedmetadata = () => setDuration(audio.duration);
    } else {
      alert('Please select a valid audio file.');
    }
  };

  const handleUpload = async () => {
    if (!title || !category || !audioFile) return alert('Please fill in all required fields!');

    setIsUploading(true);
    
    // Simulate real-time progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        setShowAnalysis(true);
        // Start AI Analysis simulation
        setTimeout(() => setIsAnalyzing(false), 3000);
      }
      setUploadProgress(progress);
    }, 300);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('author', user?.name || 'Anonymous Creator');
    formData.append('audio', audioFile);

    try {
      await uploadEpisode(formData);
    } catch (err) {
      clearInterval(interval);
      setIsUploading(false);
      alert('Upload failed. Please try again.');
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="screen scrollable" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ 
          width: '100px', height: '100px', 
          background: 'rgba(0, 210, 211, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
          border: '2px solid var(--accent-color)',
          animation: 'pulse 2s infinite'
        }}>
          <CheckCircle size={48} color="var(--accent-color)" />
        </div>
        <h1 style={{ color: 'var(--text-main)' }}>Upload Complete!</h1>
        <p className="subtitle">Your masterpiece is live and ready for the world.</p>
        <button className="btn btn-primary" style={{ marginTop: '32px' }} onClick={() => navigate('/profile')}>
          {t('profile')}
        </button>
      </div>
    );
  }

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>{t('upload')}</h2>
        <div className="nav-actions">
          <button className="btn-icon" onClick={() => navigate(-1)}><X size={20} /></button>
        </div>
      </div>

      {!audioFile ? (
        <div 
          className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${isRecording ? 'recording' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
        >
          {isRecording ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div className="recording-indicator">
                <div className="dot"></div>
                <span>RECORDING LIVE</span>
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0', fontFamily: 'monospace' }}>
                {formatTime(recordingTime)}
              </div>
              <div className="waveform-container" style={{ height: '80px', marginBottom: '32px' }}>
                {liveWaveform.map((height, i) => (
                  <div key={i} className="waveform-bar active" style={{ height: `${height}%`, width: '4px', margin: '0 2px' }}></div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ background: '#ff4757', border: 'none', width: 'auto', padding: '12px 32px' }} onClick={stopRecording}>
                <Square size={20} style={{ marginRight: '8px' }} fill="white" /> Stop Recording
              </button>
            </div>
          ) : (
            <>
              <div className="neon-glow" style={{ marginBottom: '24px' }}>
                <Upload size={64} color="var(--secondary-color)" />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Drag & drop audio files</h3>
              <p className="subtitle">Your files will be private until you publish them</p>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => fileInputRef.current.click()}>
                  <Music size={18} style={{ marginRight: '8px' }} /> Browse Files
                </button>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={startRecording}>
                  <Mic size={18} style={{ marginRight: '8px' }} /> Record Now
                </button>
              </div>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="audio/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="upload-preview-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'var(--secondary-color)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={24} color="white" />
              </div>
              <div style={{ maxWidth: '200px' }}>
                <div style={{ fontWeight: 600, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{audioFile.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {formatTime(duration)}</div>
              </div>
            </div>
            {!isUploading && !showAnalysis && (
              <button className="btn-icon" onClick={() => {setAudioFile(null); setUploadProgress(0);}}>
                <Trash2 size={18} color="#ff6b6b" />
              </button>
            )}
          </div>

          {!showAnalysis ? (
            <>
              <div className="waveform-container">
                {waveformBars.map((height, i) => (
                  <div key={i} className={`waveform-bar ${i < 15 ? 'active' : ''}`} style={{ height: `${height}%` }}></div>
                ))}
              </div>
              {isUploading && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="analysis-card" style={{ margin: 0, padding: 0, border: 'none', background: 'transparent' }}>
              <div className="analysis-header">
                {isAnalyzing ? (
                  <>
                    <div className="analysis-status-pulse"></div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)' }}>Analyzing Audio with AI...</span>
                  </>
                ) : (
                  <>
                    <div style={{ background: 'var(--accent-color)', borderRadius: '50%', padding: '4px' }}>
                      <Check size={14} color="black" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)' }}>AI Analysis Complete</span>
                  </>
                )}
              </div>

              {!isAnalyzing && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                  <div className="feedback-grid">
                    <div className="feedback-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="editable-label">Quality</span>
                        <div className="quality-badge quality-good">Good</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={16} color="var(--accent-color)" />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>High Fidelity</span>
                      </div>
                    </div>
                    <div className="feedback-item">
                      <span className="editable-label">Background Noise</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mic size={16} color="var(--accent-color)" />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Minimal Detected</span>
                      </div>
                    </div>
                    <div className="feedback-item">
                      <span className="editable-label">Clarity Score</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="radial-container">
                          <svg width="50" height="50" viewBox="0 0 50 50">
                            <circle className="radial-bg" cx="25" cy="25" r="20" />
                            <circle className="radial-progress" cx="25" cy="25" r="20" style={{ strokeDasharray: 126, strokeDashoffset: 126 * (1 - 0.92) }} />
                          </svg>
                          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', fontWeight: 700 }}>92%</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Crystal Clear</span>
                      </div>
                    </div>
                    <div className="feedback-item">
                      <span className="editable-label">Volume Level</span>
                      <div className="volume-meter" style={{ marginTop: '8px' }}>
                        <div className="volume-segment active"></div>
                        <div className="volume-segment active"></div>
                        <div className="volume-segment active"></div>
                        <div className="volume-segment active"></div>
                        <div className="volume-segment"></div>
                        <div className="volume-segment"></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Volume2 size={12} /> Balanced
                      </div>
                    </div>
                  </div>

                  <div className="suggestion-box">
                    <Sparkles size={18} color="var(--secondary-color)" />
                    <div>
                      <strong>Smart Tip:</strong> Audio is well-balanced. No further processing required for publication.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Metadata Fields */}
      <div style={{ marginTop: '32px', opacity: isUploading || showAnalysis || isRecording ? 0.5 : 1, pointerEvents: isUploading || showAnalysis || isRecording ? 'none' : 'auto' }}>
        <div className="section-header">
          <h3 className="section-title">Episode Details</h3>
        </div>
        
        <div className="input-group">
          <label className="editable-label" style={{ marginBottom: '8px', display: 'block' }}>Title</label>
          <input type="text" className="input-field" placeholder="Give your episode a catchy title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="input-group">
          <label className="editable-label" style={{ marginBottom: '8px', display: 'block' }}>Description</label>
          <textarea className="input-field" placeholder="Tell your listeners what this is about..." rows="4" style={{ resize: 'none' }} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label className="editable-label" style={{ marginBottom: '8px', display: 'block' }}>{t('categories')}</label>
            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>Select</option>
              <option value="Education">Education</option>
              <option value="History">History</option>
              <option value="Skills">Skills</option>
              <option value="Stories">Stories</option>
              <option value="Music">Music</option>
            </select>
          </div>
          <div className="input-group">
            <label className="editable-label" style={{ marginBottom: '8px', display: 'block' }}>{t('language')}</label>
            <select className="input-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English">{t('english')}</option>
              <option value="Amharic">{t('amharic')}</option>
              <option value="Oromiffa">{t('oromiffa')}</option>
              <option value="Tigrinya">{t('tigrinya')}</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', paddingBottom: '40px' }}>
        {showAnalysis ? (
          <>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAnalysis(false)}>
              Back
            </button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setSuccess(true)}>
              {t('upload')} <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleUpload} disabled={!audioFile || isUploading || isRecording}>
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
          </>
        )}
      </div>
    </div>

  );
}
