import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const SecurityContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0a1929;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
`;

const SecurityForm = styled.form`
  background: #121e2d;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #30475e;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  width: 100%;
  max-width: 450px;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #ff5252;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  color: #5effff;
  font-size: 0.9rem;
  border-bottom: 1px solid #30475e;
  padding-bottom: 1rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #5effff;
  font-size: 0.9rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #1a2634;
  border: 1px solid #30475e;
  border-radius: 4px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #5effff;
    box-shadow: 0 0 0 2px rgba(94, 255, 255, 0.2);
  }
`;

const StatusBox = styled.div`
  background: #1a2634;
  border: 1px solid #30475e;
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
`;

const IPInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
`;

const StatusText = styled.span`
  color: ${props => props.status === 'warning' ? '#ffcc00' : 
    props.status === 'danger' ? '#ff5252' : 
    props.status === 'success' ? '#52ff9a' : '#e0e0e0'};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.5rem;
  background: #003366;
  color: #ffffff;
  border: 1px solid #30475e;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #004080;
  }
  
  &:disabled {
    background: #1a2634;
    color: #5a6872;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  margin-top: 1rem;
  padding: 0.5rem;
  border-left: 3px solid #ff5252;
  background: rgba(255, 82, 82, 0.1);
  font-size: 0.85rem;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Generate random IP for display
  const randomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };
  
  const clientIP = randomIP();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
          }
        }
      );
      
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Access denied.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SecurityContainer>
      <SecurityForm onSubmit={handleSubmit}>
        <Header>
          <Title>Threat Shield</Title>
          <Subtitle>Firewall Management Console</Subtitle>
        </Header>
        
        <StatusBox>
          <IPInfo>
            <span>Client IP:</span>
            <StatusText status="warning">{clientIP}</StatusText>
          </IPInfo>
          <IPInfo>
            <span>Status:</span>
            <StatusText status="warning">VERIFICATION REQUIRED</StatusText>
          </IPInfo>
          <IPInfo>
            <span>Security Level:</span>
            <StatusText status="danger">HIGH</StatusText>
          </IPInfo>
        </StatusBox>
        
        <InputGroup>
          <InputLabel htmlFor="username">Username</InputLabel>
          <InputField
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel htmlFor="password">Password</InputLabel>
          <InputField
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'AUTHENTICATING...' : 'VERIFY IDENTITY'}
        </SubmitButton>
      </SecurityForm>
    </SecurityContainer>
  );
};

export default Login;