import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

// Color scheme constants
const colors = {
  darkBlue: '#0f172a',
  mediumBlue: '#1e293b',
  lightBlue: '#3559a5',
  navy: '#0f3460',
  accent: '#ff7f2a',
  lightOrange: '#ffa366',
  white: '#ffffff',
  lightGray: '#e2e8f0',
  text: '#f8fafc'
};

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
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

const Select = styled.select`
  padding: 10px 16px;
  border: 1px solid ${colors.navy};
  border-radius: 8px;
  background-color: ${colors.darkBlue};
  color: ${colors.text};
  cursor: pointer;
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

const CountryCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;

  &.blocked {
    background-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  &.allowed {
    background-color: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;

  &.blocked {
    background-color: #ef4444;
  }

  &.allowed {
    background-color: #10b981;
  }
`;

const CounterBadge = styled.span`
  padding: 4px 10px;
  background-color: ${colors.accent};
  color: ${colors.white};
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

const PageInfo = styled.span`
  margin-right: 1rem;
  color: ${colors.lightGray};
  font-weight: 500;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(Button)`
  min-width: auto;
  padding: 8px 16px;
  background-color: ${props => props.secondary ? '#334155' : colors.accent};
  color: ${props => props.secondary ? colors.text : colors.white};
  border: ${props => props.secondary ? '1px solid #475569' : 'none'};

  &:hover {
    background-color: ${props => props.secondary ? '#475569' : colors.lightOrange};
  }

  &:disabled {
    background-color: ${props => props.secondary ? '#334155' : '#475569'};
    color: ${props => props.secondary ? '#64748b' : '#94a3b8'};
    border-color: ${props => props.secondary ? '#475569' : 'transparent'};
  }
`;

const AutoReloadIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: ${colors.lightGray};
  font-size: 0.9rem;

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${colors.accent};
    margin-right: 8px;
    animation: ${pulse} 2s infinite ease-in-out;
  }

  &.paused .indicator-dot {
    background-color: #64748b;
    animation: none;
  }
`;

const AutoReloadControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 16px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  width: 600px;
  max-width: 90%;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${colors.text};
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.lightGray};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.white};
    transform: scale(1.1);
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
  border-left: 3px solid ${colors.accent};
`;

const InfoLabel = styled.span`
  width: 120px;
  font-weight: 600;
  color: ${colors.lightGray};
`;

const InfoValue = styled.span`
  flex: 1;
  color: ${colors.white};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: ${colors.accent};
  animation: ${spin} 1s ease-in-out infinite;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 8px;
  margin: 1rem 0 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.9);
  }
`;

const SectionTitle = styled.h3`
  color: ${colors.white};
  margin: 0;
  font-size: 1rem;
`;

const SectionContent = styled.div`
  padding: 0.5rem 0;
  display: ${props => props.expanded ? 'block' : 'none'};
`;

const CompactInfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const CompactInfoLabel = styled.span`
  font-weight: 600;
  color: ${colors.lightGray};
`;

const CompactInfoValue = styled.span`
  color: ${colors.white};
`;

const SuspiciousIPs = () => {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostname, setHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [isProcess, setIsProcess] = useState('');
  const [enrichmentData, setEnrichmentData] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [currentIp, setCurrentIp] = useState(null);
  const [reputationLoading, setReputationLoading] = useState(false);
  const [reputationExpanded, setReputationExpanded] = useState(false);
  const [networkExpanded, setNetworkExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  
  const [autoReload, setAutoReload] = useState(true);
  const [reloadInterval, setReloadInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(reloadInterval);
  const autoReloadRef = useRef(null);
  const timerRef = useRef(null);

  const fetchIps = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      
      const params = new URLSearchParams({
        page: pagination.page,
        per_page: pagination.per_page
      });

      if (hostname) params.append('hostname', hostname);
      if (ipAddress) params.append('ip', ipAddress);
      if (isProcess !== '') params.append('is_process', isProcess);

      const response = await api.get('/admin/list-ioc', { params });
      const ipsWithCountries = await Promise.all(
        response.data.map(async (ip) => ({
          ...ip,
          country: await fetchCountryData(ip.ip_address)
        }))
      );

      setIps(ipsWithCountries);
      setPagination(prev => ({
        ...prev,
        total: response.data[0]?.pagination?.total || 0
      }));
      
      setLastUpdated(new Date());
      setTimeRemaining(reloadInterval);
    } catch (err) {
      setError('Failed to fetch suspicious IPs');
      console.error('Error fetching IPs:', err);
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  };

  const startAutoReloadTimer = () => {
    if (autoReloadRef.current) {
      clearInterval(autoReloadRef.current);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return reloadInterval;
        }
        return prev - 1;
      });
    }, 1000);
    
    autoReloadRef.current = setInterval(() => {
      if (autoReload) {
        fetchIps(false);
      }
    }, reloadInterval * 1000);
  };

  useEffect(() => {
    if (autoReload) {
      startAutoReloadTimer();
    }
    
    return () => {
      if (autoReloadRef.current) {
        clearInterval(autoReloadRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [reloadInterval, autoReload]);

  const toggleAutoReload = () => {
    setAutoReload(prev => !prev);
  };

  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value);
    setReloadInterval(newInterval);
    setTimeRemaining(newInterval);
    
    if (autoReload) {
      startAutoReloadTimer();
    }
  };

  const handleBlockIP = async (ip, hostname) => {
    try {
      const response = await api.post(`/admin/block-ip?ip=${ip}&hostname=${hostname}`);
      if (response.data) {
        alert(`IP ${ip} blocked successfully!`);
        fetchIps();
      }
    } catch (err) {
      setError('Failed to block IP');
    }
  };

  const handleShowDetails = async (ip) => {
    setCurrentIp(ip);
    setShowModal(true);
    setReputationExpanded(false);
    setNetworkExpanded(false);
    setReportsExpanded(false);
  };

  const handleCheckReputation = async () => {
    if (!currentIp) return;
    
    setReputationLoading(true);
    try {
      const response = await api.get(`/admin/check-reputation/${currentIp}`);
      setEnrichmentData(prev => ({ 
        ...prev, 
        [currentIp]: response.data.data 
      }));
      setReputationExpanded(true);
    } catch (err) {
      setError('Failed to fetch reputation data');
    } finally {
      setReputationLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentIp(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.total / pagination.per_page)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination(prev => ({
      ...prev,
      page: 1,
      per_page: newPerPage
    }));
  };

  useEffect(() => {
    fetchIps();
    if (autoReload) {
      startAutoReloadTimer();
    }
    
    return () => {
      if (autoReloadRef.current) {
        clearInterval(autoReloadRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchIps();
  }, [pagination.page, pagination.per_page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchIps();
  };

  const handleClearSearch = () => {
    setHostname('');
    setIpAddress('');
    setIsProcess('');
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(fetchIps, 0);
  };

  const handleRefresh = () => {
    fetchIps();
    setTimeRemaining(reloadInterval);
  };

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const currentIpDetails = ips.find(ip => ip.ip_address === currentIp) || {};

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
        <MenuItem to="/suspicious-ips" activeClassName="active">
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
        <PageTitle>Suspicious IPs</PageTitle>
        <PageDescription>Monitor and manage potentially malicious IP addresses</PageDescription>

        <FiltersContainer>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Input
                type="text"
                placeholder="Search by IP address"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Search by hostname"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
              />
              <Select
                value={isProcess}
                onChange={(e) => setIsProcess(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="true">Blocked</option>
                <option value="false">Not Blocked</option>
              </Select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button type="submit">Search</Button>
                <IconButton 
                  type="button" 
                  onClick={handleClearSearch} 
                  secondary
                >
                  Clear
                </IconButton>
              </div>
            </div>
          </form>
        </FiltersContainer>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1rem', 
          background: colors.mediumBlue,
          padding: '0.75rem 1rem',
          borderRadius: '8px'
        }}>
          <AutoReloadIndicator className={autoReload ? '' : 'paused'}>
            <span className="indicator-dot"></span>
            {autoReload ? `Auto-refreshing in ${timeRemaining}s` : 'Auto-refresh paused'}
          </AutoReloadIndicator>
          
          <AutoReloadControls>
            <div>
              <span style={{ color: colors.lightGray, marginRight: '8px' }}>Last updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: colors.lightGray, marginRight: '8px' }}>Refresh every:</span>
              <Select
                value={reloadInterval}
                onChange={handleIntervalChange}
                style={{ width: '120px' }}
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </Select>
            </div>
            
            <IconButton 
              onClick={toggleAutoReload} 
              secondary
            >
              {autoReload ? 'Pause' : 'Resume'}
            </IconButton>
            
            <IconButton 
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh Now
            </IconButton>
          </AutoReloadControls>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            <p style={{ color: colors.lightGray, marginTop: '1rem' }}>Loading IP data...</p>
          </div>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <TableHeader>IP Address</TableHeader>
                  <TableHeader>Hostname</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Country</TableHeader>
                  <TableHeader>Detection Count</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {ips.length > 0 ? (
                  ips.map(ip => (
                    <TableRow key={ip.id}>
                      <TableCell>{ip.ip_address}</TableCell>
                      <TableCell>{ip.hostname}</TableCell>
                      <TableCell>
                        {ip.is_process ? (
                          <StatusBadge className="blocked">
                            <StatusDot className="blocked" />
                            Blocked
                          </StatusBadge>
                        ) : (
                          <StatusBadge className="allowed">
                            <StatusDot className="allowed" />
                            Allowed
                          </StatusBadge>
                        )}
                      </TableCell>
                      <CountryCell>
                        {ip.country}
                      </CountryCell>
                      <TableCell>
                        <CounterBadge>{ip.counter || 0}</CounterBadge>
                      </TableCell>
                      <TableCell>
                        {!ip.is_process && (
                          <Button onClick={() => handleBlockIP(ip.ip_address, ip.hostname)}>
                            Block
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleShowDetails(ip.ip_address)}
                          style={{ marginLeft: '8px' }}
                        >
                          Show Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" style={{ textAlign: 'center' }}>
                      No IP addresses found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>

            {pagination.total > 0 && (
              <PaginationContainer>
                <div>
                  <PageInfo>
                    Showing page {pagination.page} of {Math.ceil(pagination.total / pagination.per_page)}
                  </PageInfo>
                  <Select
                    value={pagination.per_page}
                    onChange={handlePerPageChange}
                    style={{ width: '80px' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </Select>
                </div>
                <PaginationButtons>
                  <IconButton
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    secondary
                  >
                    Previous
                  </IconButton>
                  <IconButton
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.per_page)}
                  >
                    Next
                  </IconButton>
                </PaginationButtons>
              </PaginationContainer>
            )}
          </>
        )}
      </MainContent>

      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>IP Details: {currentIp}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <div>
              <InfoRow>
                <InfoLabel>IP Address:</InfoLabel>
                <InfoValue>{currentIp}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Hostname:</InfoLabel>
                <InfoValue>{currentIpDetails.hostname || 'N/A'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Country:</InfoLabel>
                <InfoValue>{currentIpDetails.country || 'Unknown'}</InfoValue>
              </InfoRow>

              <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                <Button 
                  onClick={handleCheckReputation}
                  disabled={reputationLoading}
                  style={{ width: '100%' }}
                >
                  {reputationLoading ? (
                    <>
                      <LoadingSpinner style={{ 
                        width: '16px', 
                        height: '16px', 
                        display: 'inline-block',
                        marginRight: '8px',
                        borderWidth: '2px'
                      }} />
                      Checking Reputation...
                    </>
                  ) : 'Check Reputation'}
                </Button>
              </div>

              {enrichmentData[currentIp] && (
                <>
                  <SectionHeader onClick={() => setReputationExpanded(!reputationExpanded)}>
                    <SectionTitle>Reputation Analysis</SectionTitle>
                    <span>{reputationExpanded ? '▼' : '▶'}</span>
                  </SectionHeader>
                  <SectionContent expanded={reputationExpanded}>
                    <CompactInfoRow>
                      <CompactInfoLabel>Public IP:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].isPublic ? 'Yes' : 'No'}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>IP Version:</CompactInfoLabel>
                      <CompactInfoValue>IPv{enrichmentData[currentIp].ipVersion}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Abuse Score:</CompactInfoLabel>
                      <CompactInfoValue>
                        <CounterBadge>
                          {enrichmentData[currentIp].abuseConfidenceScore || 0}%
                        </CounterBadge>
                      </CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Whitelisted:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].isWhitelisted ? 'Yes' : 'No'}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Tor Node:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].isTor ? 'Yes' : 'No'}</CompactInfoValue>
                    </CompactInfoRow>
                  </SectionContent>

                  <SectionHeader onClick={() => setNetworkExpanded(!networkExpanded)}>
                    <SectionTitle>Network Information</SectionTitle>
                    <span>{networkExpanded ? '▼' : '▶'}</span>
                  </SectionHeader>
                  <SectionContent expanded={networkExpanded}>
                    <CompactInfoRow>
                      <CompactInfoLabel>ISP:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].isp || 'N/A'}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Domain:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].domain || 'N/A'}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Hostnames:</CompactInfoLabel>
                      <CompactInfoValue>
                        {(enrichmentData[currentIp].hostnames || []).slice(0, 2).join(', ') || 'None'}
                        {enrichmentData[currentIp].hostnames?.length > 2 && ` (+${enrichmentData[currentIp].hostnames.length - 2} more)`}
                      </CompactInfoValue>
                    </CompactInfoRow>
                  </SectionContent>

                  <SectionHeader onClick={() => setReportsExpanded(!reportsExpanded)}>
                    <SectionTitle>Report Statistics</SectionTitle>
                    <span>{reportsExpanded ? '▼' : '▶'}</span>
                  </SectionHeader>
                  <SectionContent expanded={reportsExpanded}>
                    <CompactInfoRow>
                      <CompactInfoLabel>Total Reports:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].totalReports || 0}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Distinct Users:</CompactInfoLabel>
                      <CompactInfoValue>{enrichmentData[currentIp].numDistinctUsers || 0}</CompactInfoValue>
                    </CompactInfoRow>
                    <CompactInfoRow>
                      <CompactInfoLabel>Last Reported:</CompactInfoLabel>
                      <CompactInfoValue>
                        {enrichmentData[currentIp].lastReportedAt ? 
                          new Date(enrichmentData[currentIp].lastReportedAt).toLocaleString() : 'Never'}
                      </CompactInfoValue>
                    </CompactInfoRow>
                  </SectionContent>
                </>
              )}

              {!currentIpDetails.is_process && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <Button 
                    onClick={() => {
                      handleBlockIP(currentIp, currentIpDetails.hostname);
                      handleCloseModal();
                    }}
                    style={{ width: '100%' }}
                  >
                    Block This IP Address
                  </Button>
                </div>
              )}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

async function fetchCountryData(ip) {
  try {
    const response = await fetch(`https://api.iplocation.net/?ip=${ip}`);
    const data = await response.json();
    return data.country_name || 'Unknown';
  } catch (err) {
    console.error('Error fetching country data:', err);
    return 'Unknown';
  }
}

export default SuspiciousIPs;