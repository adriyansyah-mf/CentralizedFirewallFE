import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

// Updated color scheme constants with darker blue background
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

// Updated DashboardContainer with darker blue background
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

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 1.2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.5rem;
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

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.online ? '#4fd1c5' : '#e53e3e'};
  margin-right: 8px;
  box-shadow: 0 0 10px ${props => props.online ? 'rgba(79, 209, 197, 0.8)' : 'rgba(229, 62, 62, 0.8)'};
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

const AddButton = styled.button`
  background: ${colors.accent};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 127, 42, 0.3);
  
  &:hover {
    background: ${colors.lightOrange};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 127, 42, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AgentCounter = styled.div`
  background: ${colors.navy};
  color: ${colors.white};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid ${colors.navy}90;
`;

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/admin/list-hosts');
        setAgents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load agent list');
        setLoading(false);
        console.error('Error fetching agents:', err);
      }
    };

    fetchAgents();
  }, []);

  if (loading) return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ padding: '0 1rem', marginBottom: '2rem', color: colors.white }}>Firewall Manager</h2>
        
        <MenuItem to="/">
          <MenuIcon>📊</MenuIcon>
          Dashboard
        </MenuItem>
        
        <MenuItem to="/agents" className="active">
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

      </Sidebar>
      
      <MainContent>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          flexDirection: 'column'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `3px solid ${colors.accent}`, 
            borderRadius: '50%', 
            borderBottomColor: 'transparent',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: colors.text, fontSize: '1.2rem', marginTop: '1rem' }}>Loading agents...</div>
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
      <Sidebar>
        <h2 style={{ padding: '0 1rem', marginBottom: '2rem', color: colors.white }}>Firewall Manager</h2>
        
        <MenuItem to="/">
          <MenuIcon>📊</MenuIcon>
          Dashboard
        </MenuItem>
        
        <MenuItem to="/agents" className="active">
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

      </Sidebar>
      
      <MainContent>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          background: colors.navy,
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ 
            color: '#e53e3e', 
            fontSize: '1.2rem', 
            fontWeight: 500,
            textAlign: 'center' 
          }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>⚠️</span>
            {error}
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );

  return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ 
          padding: '0 1rem', 
          marginBottom: '2rem', 
          color: colors.white,
          borderBottom: `1px solid ${colors.navy}`,
          paddingBottom: '1rem'
        }}>Firewall Manager</h2>
        
        <MenuItem to="/">
          <MenuIcon>📊</MenuIcon>
          Dashboard
        </MenuItem>
        
        <MenuItem to="/agents" className="active">
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

      </Sidebar>

      <MainContent>
        <HeaderContainer>
          <PageTitle>Agent List</PageTitle>
          <AgentCounter>{agents.length} Agents</AgentCounter>
        </HeaderContainer>
        
        <Table>
          <thead>
            <tr>
              <TableHeader>Status</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>IP Address</TableHeader>
              <TableHeader>Version</TableHeader>
              <TableHeader>OS</TableHeader>
              <TableHeader>Group</TableHeader>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <TableRow key={agent.id}>
                <TableCell>
                  <StatusIndicator online={true} />
                  <span style={{ fontWeight: 500 }}>Online</span>
                </TableCell>
                <TableCell style={{ fontWeight: 500, color: colors.white }}>{agent.name}</TableCell>
                <TableCell>{agent.ip}</TableCell>
                <TableCell>{agent.version_agent}</TableCell>
                <TableCell>{agent.os}</TableCell>
                <TableCell>
                  <span style={{ 
                    background: `${colors.accent}20`, 
                    color: colors.accent,
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    border: `1px solid ${colors.accent}40`
                  }}>
                    {agent.group_name}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </MainContent>
    </DashboardContainer>
  );
};

export default AgentList;