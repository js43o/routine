import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { userSelector } from 'modules/hooks';
import useErrorMessage from 'hooks/useErrorMessage';
import Title from 'templates/Title';
import ErrorMessage from 'components/common/ErrorMessage';
import { getAuthErrorCodeMessage } from 'lib/methods';
import Register from './Register';
import Login from './Login';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto auto;
`;

const AuthBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    label {
      display: flex;
      flex-direction: column;
      position: relative;
    }
  }
  .or {
    align-self: center;
    color: ${({ theme }) => theme.letter_sub};
  }
  .auth-switch {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.25rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.letter_sub};
    .link {
      font-weight: 500;
      color: ${({ theme }) => theme.blue};
    }
  }
  .submit-button {
    padding: 0.5rem;
    color: ${({ theme }) => theme.letter_primary};
    background: ${({ theme }) => theme.primary};
  }
  .kakao-login {
    width: 100%;
  }
  .error-message {
    align-self: center;
  }
`;

type Authprops = {
  type: 'register' | 'login';
};

const Auth = ({ type }: Authprops) => {
  const { error, authErrorCode, user } = useSelector(userSelector);
  const navigate = useNavigate();
  const { message, onError, resetError } = useErrorMessage();

  useEffect(() => {
    if (!error) return;
    onError(getAuthErrorCodeMessage(authErrorCode));
  }, [error]);

  useEffect(() => {
    resetError();
  }, [type]);

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user]);

  return (
    <AuthWrapper>
      <Title />
      <AuthBlock>
        {type === 'register' ? (
          <Register onError={onError} />
        ) : (
          <Login onError={onError} />
        )}
        <ErrorMessage message={message} />
      </AuthBlock>
    </AuthWrapper>
  );
};

export default Auth;
