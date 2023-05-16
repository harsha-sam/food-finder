import React, { useEffect, useContext, useReducer } from 'react';
import { authInitialState, authReducer } from './reducers/authReducer';
import {
  SET_USER
} from './actionTypes';
import { axiosInstance } from '@/api-config';
import { message } from 'antd';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
     // fetching user info with access token
     if (localStorage.getItem('access-token')) {
       axiosInstance
         .get('/api/auth/me')
         .then((response) => {
           authDispatch({ type: SET_USER, payload: response.data });
         })
         .catch((err) => {
           console.log(err)
           message.warning('Session expired, please login again');
         })
     } 
   }, []);

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
    window.location = '/api/auth/login';
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
