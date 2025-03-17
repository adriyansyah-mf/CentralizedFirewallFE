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

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4fd1c5;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #38a89d;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    per_page: 5,
    total: 0
  });

  const fetchData = async () => {
    try {
      const [reportResponse, activityResponse] = await Promise.all([
        api.get('/admin/report'),
        api.get('/admin/log-activity', {
          params: {
            page: activityPagination.page,
            per_page: activityPagination.per_page
          }
        })
      ]);
      
      setCounters(reportResponse.data);
      setActivityLogs(activityResponse.data.data);
      setActivityPagination(prev => ({
        ...prev,
        total: activityResponse.data.pagination.total
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleActivityPageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(activityPagination.total / activityPagination.per_page)) {
      setActivityPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleActivityPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setActivityPagination(prev => ({
      ...prev,
      page: 1,
      per_page: newPerPage
    }));
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    fetchData();
    return () => clearInterval(interval);
  }, [activityPagination.page, activityPagination.per_page]);

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#2a3042', marginTop: '2rem', marginBottom: '1rem' }}>
            Activity Log
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Select
              value={activityPagination.per_page}
              onChange={handleActivityPerPageChange}
              style={{ width: '80px' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </Select>
          </div>
        </div>

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

        {activityPagination.total > 0 && (
          <PaginationContainer>
            <span>
              Page {activityPagination.page} of{' '}
              {Math.ceil(activityPagination.total / activityPagination.per_page)}
            </span>
            <div>
              <Button 
                onClick={() => handleActivityPageChange(activityPagination.page - 1)}
                disabled={activityPagination.page === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => handleActivityPageChange(activityPagination.page + 1)}
                disabled={activityPagination.page >= Math.ceil(activityPagination.total / activityPagination.per_page)}
                style={{ marginLeft: '0.5rem' }}
              >
                Next
              </Button>
            </div>
          </PaginationContainer>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;