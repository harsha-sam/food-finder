import React, { useContext, useReducer } from 'react';
import { authInitialState, authReducer } from './reducers/authReducer';
import {
  SET_USER,
  UPDATE_USER,
} from './actionTypes';
import { message } from 'antd';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);


  const setUser = (payload) => {
    // storing access token and refresh token in local storage
    localStorage.setItem('access-token', payload.accessToken);
    localStorage.setItem('refresh-token', payload.refreshToken);
    // storing user info in the state
    return authDispatch({ type: SET_USER, payload: payload.user });
  };

  const signout = async () => {
    // removing access token and refresh token from localStorage
    await message.loading('Logging out ...!', 1);
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    await message.success('Logged out', 0.5);
    window.location = '/auth/login';
    window.location.reload(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        authActions: {
          setUser,
          signout,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
