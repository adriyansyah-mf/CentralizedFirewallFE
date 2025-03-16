import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

// Spinner Animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled Components
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

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  flex: 1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: center;
`;

const StatValue = styled.h2`
  font-size: 2rem;
  color: #2a3042;
  margin: 0.5rem 0;
`;

const StatLabel = styled.p`
  color: #718096;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  background: white;
  border-radius: 12px;
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #4fd1c5;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #38a89d;
  }
`;

const EnrichmentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.color || '#667eea'};
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NoDataMessage = styled.span`
  color: #718096;
  font-style: italic;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4fd1c5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #2a3042;
`;

// Utility function to convert epoch time to a human-readable format
const formatEpochTime = (epochTime) => {
  if (!epochTime) return 'N/A'; // Handle null or undefined values
  const date = new Date(epochTime * 1000); // Convert to milliseconds
  return date.toLocaleString(); // Format as a readable string
};

const BlockedIPs = () => {
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrichmentData, setEnrichmentData] = useState({});

  const fetchBlockedIPs = async () => {
    try {
      const response = await api.get('/admin/list-mal-ip');
      setBlockedIPs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch blocked IPs');
      setLoading(false);
    }
  };

  const fetchEnrichmentData = async (ip) => {
    try {
      const response = await api.get(`/admin/enrich/${ip}`);
      setEnrichmentData((prev) => ({ ...prev, [ip]: response.data }));
    } catch (err) {
      setEnrichmentData((prev) => ({ ...prev, [ip]: null }));
    }
  };

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  useEffect(() => {
    if (blockedIPs.length > 0) {
      // Fetch enrichment data for all blocked IPs
      blockedIPs.forEach((ip) => fetchEnrichmentData(ip.ip_address));
    }
  }, [blockedIPs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredIPs = blockedIPs.filter(
      (ip) =>
        ip.ip_address.includes(searchQuery) ||
        ip.hostname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setBlockedIPs(filteredIPs);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    fetchBlockedIPs();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading blocked IPs...</LoadingText>
      </LoadingContainer>
    );
  }

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
          <MenuIcon>🚫</MenuIcon>
          Blocked IPs
        </MenuItem>
        
        <MenuItem to="/settings">
          <MenuIcon>⚙️</MenuIcon>
          Settings
        </MenuItem>
      </Sidebar>

      <MainContent>
        <h1>Blocked IPs</h1>
        
        <StatsContainer>
          <StatCard>
            <StatValue>{blockedIPs.length}</StatValue>
            <StatLabel>Total Blocked IPs</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>
              {blockedIPs.filter((ip) => enrichmentData[ip.ip_address]).length}
            </StatValue>
            <StatLabel>Enriched IPs</StatLabel>
          </StatCard>
        </StatsContainer>

        <FiltersContainer>
          <Input
            type="text"
            placeholder="Search by IP or hostname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={handleResetSearch}>Reset</Button>
        </FiltersContainer>

        {error && <div style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</div>}

        <Table>
          <thead>
            <tr>
              <TableHeader>IP Address</TableHeader>
              <TableHeader>Hostname</TableHeader>
              <TableHeader>Executed Time</TableHeader>
              <TableHeader>Enrichment</TableHeader>
            </tr>
          </thead>
          <tbody>
            {blockedIPs.map((ip) => (
              <TableRow key={ip.id}>
                <TableCell>{ip.ip_address}</TableCell>
                <TableCell>{ip.hostname}</TableCell>
                <TableCell>{formatEpochTime(ip.executed_time)}</TableCell>
                <TableCell>
                  {enrichmentData[ip.ip_address] ? (
                    <EnrichmentTags>
                      {enrichmentData[ip.ip_address].map((tag) => (
                        <Tag key={tag.id} color={tag.color}>
                          {tag.value}
                        </Tag>
                      ))}
                    </EnrichmentTags>
                  ) : (
                    <NoDataMessage>No enrichment data found</NoDataMessage>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </MainContent>
    </DashboardContainer>
  );
};

export default BlockedIPs;