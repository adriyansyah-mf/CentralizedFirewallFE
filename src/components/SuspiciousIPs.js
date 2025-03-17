import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';

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

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const BlockButton = styled(ActionButton)`
  background-color: #e53e3e;
  color: white;
`;

const EnrichButton = styled(ActionButton)`
  background-color: #667eea;
  color: white;
`;

const EnrichmentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.color || '#ddd'};
  color: white;
  font-size: 12px;
`;

const CommentCell = styled(TableCell)`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4fd1c5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 2rem auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #2a3042;
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

const PageInfo = styled.span`
  margin-right: 1rem;
  color: #2a3042;
`;

const SuspiciousIPs = () => {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostname, setHostname] = useState('');
  const [isBlocked, setIsBlocked] = useState('');
  const [enrichmentData, setEnrichmentData] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0
  });

  const fetchCountryData = async (ip) => {
    try {
      const response = await fetch(`https://api.iplocation.net/?ip=${ip}`);
      const data = await response.json();
      return data.country_name || 'Unknown';
    } catch (err) {
      console.error('Error fetching country data:', err);
      return 'Unknown';
    }
  };

  const fetchIps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        per_page: pagination.per_page
      });
      
      if (hostname) params.append('hostname', hostname);
      if (isBlocked !== '') params.append('is_blocked', isBlocked);

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
    } catch (err) {
      setError('Failed to fetch suspicious IPs');
    } finally {
      setLoading(false);
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

  const handleEnrichIP = async (ip) => {
    try {
      const response = await api.get(`/admin/enrich/${ip}`);
      setEnrichmentData(prev => ({ ...prev, [ip]: response.data }));
    } catch (err) {
      setError('Failed to fetch enrichment data');
    }
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
  }, [pagination.page, pagination.per_page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading suspicious IPs...</LoadingText>
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
          <MenuIcon>🔒</MenuIcon>
          Blocked IPs
        </MenuItem>
        <MenuItem to="/settings">
          <MenuIcon>⚙️</MenuIcon>
          Settings
        </MenuItem>
      </Sidebar>

      <MainContent>
        <h1>Suspicious IPs</h1>
        
        <FiltersContainer>
          <Input
            type="text"
            placeholder="Search by hostname"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
          
          <Select
            value={isBlocked}
            onChange={(e) => setIsBlocked(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="true">Blocked</option>
            <option value="false">Not Blocked</option>
          </Select>
          
          <Button onClick={handleSearch}>Search</Button>
        </FiltersContainer>

        {error && <div style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</div>}

        <Table>
          <thead>
            <tr>
              <TableHeader>IP Address</TableHeader>
              <TableHeader>Hostname</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Comment</TableHeader>
              <TableHeader>Country</TableHeader>
              <TableHeader>Actions</TableHeader>
              <TableHeader>Enrichment</TableHeader>
            </tr>
          </thead>
          <tbody>
            {ips.map(ip => (
              <TableRow key={ip.id}>
                <TableCell>{ip.ip_address}</TableCell>
                <TableCell>{ip.hostname}</TableCell>
                <TableCell>
                  {ip.is_process ? (
                    <span style={{ color: '#e53e3e' }}>Blocked</span>
                  ) : (
                    <span style={{ color: '#4fd1c5' }}>Allowed</span>
                  )}
                </TableCell>
                <CommentCell title={ip.comment || '-'}>
                  {ip.comment || '-'}
                </CommentCell>
                <TableCell>{ip.country}</TableCell>
                <TableCell>
                  {!ip.is_process && (
                    <BlockButton onClick={() => handleBlockIP(ip.ip_address, ip.hostname)}>
                      Block
                    </BlockButton>
                  )}
                  <EnrichButton onClick={() => handleEnrichIP(ip.ip_address)}>
                    Enrich
                  </EnrichButton>
                </TableCell>
                <TableCell>
                  {enrichmentData[ip.ip_address] && (
                    <EnrichmentTags>
                      {enrichmentData[ip.ip_address].map((tag) => (
                        <Tag key={tag.id} color={tag.color}>
                          {tag.value}
                        </Tag>
                      ))}
                    </EnrichmentTags>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {pagination.total > 0 && (
          <PaginationContainer>
            <div>
              <PageInfo>
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.per_page)}
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
            <div>
              <Button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.per_page)}
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

export default SuspiciousIPs;