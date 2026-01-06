// src/hooks/useAuth.tsx
import { useCallback, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, Credentials, SignupData } from '../types';

const STORAGE_KEY = '@auth_user';
const USERS_KEY = '@auth_users'; 

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'INIT_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'INIT_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: !!action.payload, // Set to true if user exists
        error: null,
      };
    case 'INIT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGIN_REQUEST':
    case 'SIGNUP_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true, // Starts as true
    error: null,
    isAuthenticated: false,
  });

  // Load stored user on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      dispatch({ type: 'INIT_REQUEST' });
      
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const user: User = JSON.parse(storedUser);
          dispatch({ type: 'INIT_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'INIT_SUCCESS', payload: null }); // No stored user
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ 
          type: 'INIT_FAILURE', 
          payload: 'Failed to load user data' 
        });
      }
    };

    loadStoredUser();
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
  dispatch({ type: 'LOGIN_REQUEST' });

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const usersRaw = await AsyncStorage.getItem(USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const user = users.find(
      (u: any) =>
        u.email === credentials.email &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error instanceof Error ? error.message : 'Login failed',
    });
    throw error;
  }
}, []);

  const signup = useCallback(async (data: SignupData) => {
  dispatch({ type: 'SIGNUP_REQUEST' });

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password, // ✅ store password (demo only)
      createdAt: new Date(),
    };

    const existingUsersRaw = await AsyncStorage.getItem(USERS_KEY);
    const users = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    // prevent duplicate signup
    const userExists = users.some((u: any) => u.email === data.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    users.push(newUser);

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    dispatch({ type: 'SIGNUP_SUCCESS', payload: newUser });
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error instanceof Error ? error.message : 'Signup failed',
    });
    throw error;
  }
}, []);

const logout = useCallback(async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  dispatch({ type: 'LOGOUT' });
}, []);
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };
};