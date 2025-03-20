import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Color scheme constants
const colors = {
  darkBlue: '#0f172a',   // Darker blue for background
  mediumBlue: '#1e293b', // Medium blue for sidebar
  lightBlue: '#3559a5',  // Light blue for accents
  navy: '#0f3460',       // Navy for table headers
  accent: '#ff7f2a',     // Orange accent
  lightOrange: '#ffa366',
  white: '#ffffff',
  lightGray: '#e2e8f0',
  text: '#f8fafc'        // Light text color for dark background
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.darkBlue};
  color: ${colors.text};
`;

const Sidebar = styled.div`
  width: 260px;
  background: ${colors.mediumBlue};
  padding: 1.5rem;
  color: ${colors.white};
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, ${colors.lightBlue}40, transparent);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-image: radial-gradient(circle at 50% 50%, ${colors.navy}10 0%, transparent 70%);
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 10px 0;
  border-radius: 8px;
  color: ${colors.lightGray};
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: ${colors.navy};
    color: ${colors.white};
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &.active {
    background: ${colors.navy};
    color: ${colors.white};
    border-left: 4px solid ${colors.accent};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: ${colors.lightGray};
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;

  &:hover {
    background: ${colors.navy};
    color: ${colors.white};
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const PageTitle = styled.h1`
  color: ${colors.white};
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(to right, ${colors.accent}, transparent);
    border-radius: 3px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled.div`
  background: ${colors.mediumBlue};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled.h3`
  color: ${colors.lightGray};
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const CardValue = styled.p`
  font-size: 2.2rem;
  margin: 0;
  color: ${colors.accent};
  font-weight: 600;
`;

const ActivityLogTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: ${colors.mediumBlue};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const TableHeader = styled.th`
  padding: 1.2rem 1rem;
  text-align: left;
  background-color: ${colors.navy};
  color: ${colors.white};
  font-weight: 600;
  letter-spacing: 0.5px;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.darkBlue}80;
  }

  &:hover {
    background-color: ${colors.navy}70;
  }
`;

const TableCell = styled.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid ${colors.navy}90;
  color: ${colors.text};
  transition: all 0.2s ease;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: ${colors.mediumBlue};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${colors.accent};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background-color: ${colors.lightOrange};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 127, 42, 0.4);
  }

  &:disabled {
    background-color: #475569;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  height: 1px;
  background: linear-gradient(to right, transparent, ${colors.lightBlue}40, transparent);
`;

const Spacer = styled.div`
  flex: 1;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [counters, setCounters] = useState({
    connected_agents: 0,
    blocked_ips: 0,
    active_alerts: 0,
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    per_page: 5,
    total: 0,
  });

  const fetchData = async () => {
    try {
      const [reportResponse, activityResponse] = await Promise.all([
        api.get('/admin/report'),
        api.get('/admin/log-activity', {
          params: {
            page: activityPagination.page,
            per_page: activityPagination.per_page,
          },
        }),
      ]);

      setCounters(reportResponse.data);
      setActivityLogs(activityResponse.data.data);
      setActivityPagination((prev) => ({
        ...prev,
        total: activityResponse.data.pagination.total,
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
      setActivityPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleActivityPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setActivityPagination((prev) => ({
      ...prev,
      page: 1,
      per_page: newPerPage,
    }));
  };

  const handleLogout = () => {
    // Delete JWT access token from localStorage
    localStorage.removeItem('access_token');
    
    // You might also want to clear any other user-related data
    localStorage.removeItem('user_data');
    
    // Redirect to login page
    navigate('/login');
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    fetchData();
    return () => clearInterval(interval);
  }, [activityPagination.page, activityPagination.per_page]);

  const renderSidebar = () => (
    <Sidebar>
      <div>
        <h2 style={{ padding: '0 1rem', marginBottom: '2rem', color: colors.white }}>Firewall Manager</h2>
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
      </div>
      
      <Spacer />
      
      <div>
        <Divider />
        <LogoutButton onClick={handleLogout}>
          <MenuIcon>🚪</MenuIcon>
          Logout
        </LogoutButton>
      </div>
    </Sidebar>
  );

  if (loading) return (
    <DashboardContainer>
      {renderSidebar()}
      <MainContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${colors.accent}`, borderRadius: '50%', borderBottomColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          <div style={{ color: colors.text, fontSize: '1.2rem', marginTop: '1rem' }}>Loading dashboard...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </MainContent>
    </DashboardContainer>
  );

  if (error) return (
    <DashboardContainer>
      {renderSidebar()}
      <MainContent>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: colors.navy, borderRadius: '12px', padding: '2rem', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}>
          <div style={{ color: '#e53e3e', fontSize: '1.2rem', fontWeight: 500, textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>⚠️</span>
            {error}
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );

  return (
    <DashboardContainer>
      {renderSidebar()}
      <MainContent>
        <PageTitle>Dashboard Overview</PageTitle>
        <StatsGrid>
          <StatsCard>
            <CardTitle>Connected Agents</CardTitle>
            <CardValue>{counters.connected_agents}</CardValue>
          </StatsCard>
          <StatsCard>
            <CardTitle>Blocked IPs</CardTitle>
            <CardValue>{counters.blocked_ips}</CardValue>
          </StatsCard>
          <StatsCard>
            <CardTitle>Active Alerts</CardTitle>
            <CardValue style={{ color: '#ef4444' }}>{counters.active_alerts}</CardValue>
          </StatsCard>
        </StatsGrid>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: colors.white, fontSize: '1.5rem', fontWeight: 600 }}>Activity Log</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={activityPagination.per_page}
              onChange={handleActivityPerPageChange}
              style={{ padding: '8px 12px', border: `1px solid ${colors.navy}`, borderRadius: '4px', background: colors.mediumBlue, color: colors.text }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
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
            <span style={{ color: colors.lightGray }}>
              Page {activityPagination.page} of {Math.ceil(activityPagination.total / activityPagination.per_page)}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => handleActivityPageChange(activityPagination.page - 1)}
                disabled={activityPagination.page === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => handleActivityPageChange(activityPagination.page + 1)}
                disabled={activityPagination.page >= Math.ceil(activityPagination.total / activityPagination.per_page)}
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