import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

// Reuse the DashboardContainer and Sidebar styles
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
`;

const Sidebar = styled.div`
  width: 260px;
  background: #2a3042;
  padding: 1.5rem;
  color: white;
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 8px;
  color: #a0aec0;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #343a4d;
    color: white;
  }
  
  &.active {
    background: #434a5d;
    color: white;
  }
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const StatsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
`;

const ActivityLogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #2a3042;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const Dashboard = () => {
  const [counters, setCounters] = useState({
    connected_agents: 0,
    blocked_ips: 0,
    active_alerts: 0
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [reportResponse, activityResponse] = await Promise.all([
        api.get('/admin/report'),
        api.get('/admin/log-activity') // Corrected URL
      ]);
      setCounters(reportResponse.data);
      setActivityLogs(activityResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err); // Log the error for debugging
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchData();

    // Set up polling to fetch data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ padding: '0 1rem', marginBottom: '2rem' }}>Firewall Manager</h2>
        <MenuItem to="/">
          <MenuIcon>📊</MenuIcon>
          Dashboard
        </MenuItem>
        <MenuItem to="/agents">
          <MenuIcon>🖥️</MenuIcon>
          Agent List
        </MenuItem>
        <MenuItem to="/suspicious-ips">
          <MenuIcon>⚠️</MenuIcon>
          Suspicious IPs
        </MenuItem>
        <MenuItem to="/blocked-ips">
          <MenuIcon>🔒</MenuIcon>
          Blocked IPs
        </MenuItem>
        <MenuItem to="/settings">
          <MenuIcon>⚙️</MenuIcon>
          Settings
        </MenuItem>
        <div style={{ marginTop: '2rem', padding: '1rem' }}>
          <button style={{
            background: '#4fd1c5',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}>
            Add New Agent
          </button>
        </div>
      </Sidebar>

      <MainContent>
        <h1 style={{ color: '#2a3042', marginBottom: '2rem' }}>Dashboard Overview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <StatsCard>
            <h3 style={{ color: '#718096' }}>Connected Agents</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2a3042' }}>
              {counters.connected_agents}
            </p>
          </StatsCard>
          <StatsCard>
            <h3 style={{ color: '#718096' }}>Blocked IPs</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2a3042' }}>
              {counters.blocked_ips}
            </p>
          </StatsCard>
          <StatsCard>
            <h3 style={{ color: '#718096' }}>Active Alerts</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#e53e3e' }}>
              {counters.active_alerts}
            </p>
          </StatsCard>
        </div>

        <h2 style={{ color: '#2a3042', marginTop: '2rem', marginBottom: '1rem' }}>Activity Log</h2>
        <ActivityLogTable>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Activity</TableHeader>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.activity}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </ActivityLogTable>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;