import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
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

// Spinner Animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.darkBlue};
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

const PageTitle = styled.h1`
  color: ${colors.white};
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
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

const PageDescription = styled.p`
  color: ${colors.lightGray};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${colors.mediumBlue};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.h2`
  font-size: 2rem;
  color: ${colors.accent};
  margin: 0.5rem 0;
`;

const StatLabel = styled.p`
  color: ${colors.lightGray};
  margin: 0;
`;

const Table = styled.table`
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

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: ${colors.mediumBlue};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  padding: 10px 16px;
  border: 1px solid ${colors.navy};
  border-radius: 8px;
  background-color: ${colors.darkBlue};
  color: ${colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px ${colors.accent}20;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${colors.accent};
  color: ${colors.white};
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
  color: ${colors.lightGray};
  font-style: italic;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
  background-color: ${colors.darkBlue};
  color: ${colors.white};
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid ${colors.accent};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: ${colors.white};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: ${colors.mediumBlue};
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const PaginationButton = styled.button`
  background: ${props => props.active ? colors.accent : colors.navy};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.disabled ? colors.navy : colors.lightOrange};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const PageInfo = styled.span`
  color: ${colors.lightGray};
  font-weight: 500;
`;

const PerPageSelect = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  background: ${colors.navy};
  color: ${colors.white};
  border: none;
  cursor: pointer;
`;

// Utility function to convert epoch time to a human-readable format
const formatEpochTime = (epochTime) => {
  if (!epochTime) return 'N/A';
  const date = new Date(epochTime * 1000);
  return date.toLocaleString();
};

const BlockedIPs = () => {
  const [blockedIPsData, setBlockedIPsData] = useState({
    page: 1,
    per_page: 5,
    total: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrichmentData, setEnrichmentData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const fetchBlockedIPs = async (page = 1, itemsPerPage = 5) => {
    setLoading(true);
    try {
      // Assuming API supports pagination parameters
      const response = await api.get(`/admin/list-mal-ip?page=${page}&per_page=${itemsPerPage}`);
      setBlockedIPsData(response.data);
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
    fetchBlockedIPs(currentPage, perPage);
  }, [currentPage, perPage]);

  useEffect(() => {
    if (blockedIPsData.data.length > 0) {
      blockedIPsData.data.forEach((ip) => fetchEnrichmentData(ip.ip_address));
    }
  }, [blockedIPsData.data]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    fetchBlockedIPs(1, perPage);
    // Note: This would need to be updated to send the search query to the API
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchBlockedIPs(1, perPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // This will trigger the useEffect that calls fetchBlockedIPs
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const totalPages = Math.ceil(blockedIPsData.total / blockedIPsData.per_page);

  if (loading && !blockedIPsData.data.length) {
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
        <MenuItem to="/blocked-ips" activeClassName="active">
          <MenuIcon>🚫</MenuIcon>
          Blocked IPs
        </MenuItem>
        <MenuItem to="/settings">
          <MenuIcon>⚙️</MenuIcon>
          Settings
        </MenuItem>
      </Sidebar>

      <MainContent>
        <PageTitle>Blocked IPs</PageTitle>
        <PageDescription>Monitor and manage blocked IP addresses</PageDescription>

        <StatsContainer>
          <StatCard>
            <StatLabel>Total Blocked IPs</StatLabel>
            <StatValue>{blockedIPsData.total}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Current Page</StatLabel>
            <StatValue>{blockedIPsData.page}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Enriched IPs</StatLabel>
            <StatValue>
              {blockedIPsData.data.filter((ip) => enrichmentData[ip.ip_address]).length}
            </StatValue>
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
          <div style={{ marginLeft: 'auto' }}>
            <PerPageSelect value={perPage} onChange={handlePerPageChange}>
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </PerPageSelect>
          </div>
        </FiltersContainer>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

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
            {loading ? (
              <TableRow>
                <TableCell colSpan="4" style={{ textAlign: 'center' }}>
                  <Spinner style={{ margin: '0 auto' }} />
                </TableCell>
              </TableRow>
            ) : (
              blockedIPsData.data.map((ip) => (
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
              ))
            )}
          </tbody>
        </Table>

        <PaginationContainer>
          <div>
            <PaginationButton 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            >
              First
            </PaginationButton>
            <PaginationButton 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
          </div>
          <PageInfo>
            Page {blockedIPsData.page} of {totalPages} ({blockedIPsData.total} total items)
          </PageInfo>
          <div>
            <PaginationButton 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage >= totalPages}
            >
              Next
            </PaginationButton>
            <PaginationButton 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage >= totalPages}
            >
              Last
            </PaginationButton>
          </div>
        </PaginationContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default BlockedIPs;