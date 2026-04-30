import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './controllers/ThemeContext';
import { UserDataProvider } from './controllers/UserDataContext';
import { AuthProvider } from './controllers/AuthContext';

// Components
import BottomNav from './views/components/BottomNav';

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

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UserDataProvider>
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
                <BottomNav />
              </div>
            </Router>
            </AudioProvider>
          </UserDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
