import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import KidsArea from './pages/KidsArea/KidsArea';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kids/*" element={<KidsArea />} />
      </Routes>
    </Router>
  );
}