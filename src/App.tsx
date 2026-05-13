import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WalkPage from './pages/WalkPage';
import CollectionPage from './pages/CollectionPage';
import MapPage from './pages/MapPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-br from-soft-white to-soft-gray">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/walk" element={<WalkPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
