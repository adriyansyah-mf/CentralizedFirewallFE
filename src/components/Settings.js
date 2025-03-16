import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
`;

const ApiKeyDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
`;

const ApiKeyText = styled.span`
  font-family: monospace;
  color: #2a3042;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 0.5rem;
`;

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    password: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [createGroupError, setCreateGroupError] = useState('');
  const [createdGroupId, setCreatedGroupId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiKeyResponse, userResponse] = await Promise.all([
          api.get('/admin/get-apikey'),
          api.get('/admin/me')
        ]);
        setApiKey(apiKeyResponse.data.apikey);
        setUserDetails({
          name: userResponse.data.name,
          password: ''
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateApiKey = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await api.post('/admin/create-apikey');
      setApiKey(response.data);
    } catch (err) {
      setError('Failed to generate new API key');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateUserDetails = async () => {
    setError('');
    setUpdateSuccess(false);

    try {
      const payload = {};
      if (userDetails.name) payload.name = userDetails.name;
      if (userDetails.password) payload.password = userDetails.password;

      const response = await api.patch('/admin/me/update', payload);
      if (response.data) {
        setUpdateSuccess(true);
      }
    } catch (err) {
      setError('Failed to update user details');
    }
  };

  const handleCreateGroup = async () => {
    setCreateGroupError('');
    setCreatedGroupId(null);

    if (!groupName.trim()) {
      setCreateGroupError('Group name is required');
      return;
    }

    setCreateGroupLoading(true);
    try {
      const response = await api.post('/admin/add-group', null, {
        params: { name: groupName }
      });
      setCreatedGroupId(response.data);
      setGroupName('');
    } catch (err) {
      setCreateGroupError('Failed to create group');
    } finally {
      setCreateGroupLoading(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

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
        <SettingsContainer>
          <h1>Settings</h1>
          
          <Section>
            <h2>API Key Management</h2>
            {error && <div style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</div>}
            <ApiKeyDisplay>
              <ApiKeyText>{apiKey || 'No API key generated yet'}</ApiKeyText>
              <Button 
                onClick={handleGenerateApiKey} 
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate New API Key'}
              </Button>
            </ApiKeyDisplay>
            <div style={{ marginTop: '1rem', color: '#718096' }}>
              <small>
                Note: Generating a new API key will invalidate the previous one.
              </small>
            </div>
          </Section>

          <Section>
            <h2>User Details</h2>
            {updateSuccess && (
              <div style={{ color: '#4fd1c5', marginBottom: '1rem' }}>
                User details updated successfully!
              </div>
            )}
            {error && <div style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</div>}
            <FormGroup>
              <label>Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <label>Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={userDetails.password}
                onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
              />
            </FormGroup>
            <Button onClick={handleUpdateUserDetails}>
              Update User Details
            </Button>
          </Section>

          <Section>
            <h2>Group Management</h2>
            {createGroupError && <div style={{ color: '#e53e3e', marginBottom: '1rem' }}>{createGroupError}</div>}
            {createdGroupId && (
              <div style={{ color: '#4fd1c5', marginBottom: '1rem' }}>
                Group created successfully! ID: {createdGroupId}
              </div>
            )}
            <FormGroup>
              <label>Group Name</label>
              <Input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormGroup>
            <Button 
              onClick={handleCreateGroup}
              disabled={createGroupLoading}
            >
              {createGroupLoading ? 'Creating...' : 'Create New Group'}
            </Button>
          </Section>

        </SettingsContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default Settings;