import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

// Reuse the DashboardContainer and Sidebar styles from Dashboard.js
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

const Table = styled.table`
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

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.online ? '#4fd1c5' : '#e53e3e'};
  margin-right: 8px;
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

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
        <h1>Agent List</h1>
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
                  Online
                </TableCell>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.ip}</TableCell>
                <TableCell>{agent.version_agent}</TableCell>
                <TableCell>{agent.os}</TableCell>
                <TableCell>{agent.group_name}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </MainContent>
    </DashboardContainer>
  );
};

export default AgentList;