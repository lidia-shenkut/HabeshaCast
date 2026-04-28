import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './controllers/ThemeContext';
import { UserDataProvider } from './controllers/UserDataContext';

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

function App() {
  return (
    <ThemeProvider>
      <UserDataProvider>
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
            </Routes>
            <BottomNav />
          </div>
        </Router>
      </UserDataProvider>
    </ThemeProvider>
  );
}

export default App;
