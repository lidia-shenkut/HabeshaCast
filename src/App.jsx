import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './controllers/ThemeContext';
import { UserDataProvider } from './controllers/UserDataContext';
import { AuthProvider } from './controllers/AuthContext';

// Components
import BottomNav from './views/components/BottomNav';
import MiniPlayer from './views/components/MiniPlayer';


// Pages
import SplashScreen from './views/pages/SplashScreen';
import LoginScreen from './views/pages/LoginScreen';
import HomeScreen from './views/pages/HomeScreen';
import CategoryScreen from './views/pages/CategoryScreen';
import PlayerScreen from './views/pages/PlayerScreen';
import UploadScreen from './views/pages/UploadScreen';
import ProfileScreen from './views/pages/ProfileScreen';
import AdminScreen from './views/pages/AdminScreen';
import ExploreScreen from './views/pages/ExploreScreen';


import { LanguageProvider } from './controllers/LanguageContext';
import { AudioProvider } from './controllers/AudioContext';
import { SettingsProvider } from './controllers/SettingsContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UserDataProvider>
            <SettingsProvider>
              <AudioProvider>
              <Router>
              <div className="app-container">
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/category/:name" element={<CategoryScreen />} />
                  <Route path="/player/:id" element={<PlayerScreen />} />
                  <Route path="/upload" element={<UploadScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/admin" element={<AdminScreen />} />
                  <Route path="/explore" element={<ExploreScreen />} />
                </Routes>
                <MiniPlayer />
                <BottomNav />
              </div>
            </Router>
            </AudioProvider>
          </SettingsProvider>
        </UserDataProvider>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
