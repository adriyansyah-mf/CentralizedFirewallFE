import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AgentList from './components/AgentList';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings';
import SuspiciousIPs from './components/SuspiciousIPs';
import BlockedIPs from './components/BlockedIPs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<AgentList />} />
          <Route path="/suspicious-ips" element={<SuspiciousIPs />} />
          <Route path="/blocked-ips" element={<BlockedIPs/>} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;