import { useState } from 'react';
import { PlusSquare, CheckCircle } from 'lucide-react';
import { useUserData } from '../../controllers/UserDataContext';
import { useNavigate } from 'react-router-dom';

export default function UploadScreen() {
  const { uploadEpisode } = useUserData();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpload = () => {
    if (!title || !category) return alert('Title and Category are required!');

    uploadEpisode({
      title,
      description,
      category,
      author: 'Lidia Mekonnen',
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setDescription('');
      setCategory('');
      navigate('/profile');
    }, 2000);
  };

  if (success) {
    return (
      <div className="screen scrollable" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CheckCircle size={64} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
        <h2>Upload Successful!</h2>
        <p className="subtitle" style={{ textAlign: 'center' }}>Your episode is pending admin approval.</p>
      </div>
    );
  }

  return (
    <div className="screen scrollable">
      <div className="top-nav">
        <h2 style={{ marginBottom: 0 }}>Create Episode</h2>
      </div>

      <div className="glass-panel" style={{ padding: '32px 20px', textAlign: 'center', marginBottom: '24px', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--border-color)' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(108, 92, 231, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--secondary-color)' }}>
          <PlusSquare size={32} />
        </div>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Select Audio File</h3>
        <p className="subtitle" style={{ marginBottom: '16px' }}>Supports MP3, WAV up to 50MB</p>
        <button className="btn btn-secondary" style={{ width: 'auto' }}>Browse Files</button>
      </div>

      <div className="input-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Episode Title" 
          style={{ marginBottom: '16px' }} 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          className="input-field" 
          placeholder="Description..." 
          rows="4" 
          style={{ marginBottom: '16px', resize: 'none' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <select 
          className="input-field" 
          style={{ marginBottom: '16px', appearance: 'none', color: 'var(--text-main)' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>Select Category</option>
          <option value="Education">Education</option>
          <option value="History">History</option>
          <option value="Skills">Skills</option>
          <option value="Stories">Stories</option>
          <option value="Life Advice">Life Advice</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>Publish Episode</button>
    </div>
  );
}
