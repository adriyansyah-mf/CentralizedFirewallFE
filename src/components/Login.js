import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #764ba2;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 10px;
  font-size: 14px;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Firewall Management Login</h2>
        <div>
          <label>Username</label>
          <InputField
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <InputField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;