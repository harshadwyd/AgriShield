import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { AppState, Detection, UserSettings } from '../types';

type AppAction = 
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'ADD_DETECTION'; payload: Detection }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_OFFLINE'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'CLEAR_HISTORY' };

const initialState: AppState = {
  user: null,
  detections: [],
  settings: {
    language: 'en',
    units: 'metric',
    defaultCrop: 'tomato',
    notifications: true,
    theme: 'auto',
    dataUsage: 'medium'
  },
  isOnboarded: false,
  offline: {
    isOffline: false,
    pendingUploads: [],
    cachedContent: []
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ONBOARDED':
      return { ...state, isOnboarded: action.payload };
    case 'ADD_DETECTION':
      return { 
        ...state, 
        detections: [action.payload, ...state.detections].slice(0, 100) // Keep only last 100
      };
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      };
    case 'SET_OFFLINE':
      return {
        ...state,
        offline: { ...state.offline, isOffline: action.payload }
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'CLEAR_HISTORY':
      return { ...state, detections: [] };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isDarkMode: boolean;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const systemColorScheme = useColorScheme();

  const isDarkMode = state.settings.theme === 'auto' 
    ? systemColorScheme === 'dark'
    : state.settings.theme === 'dark';

  // Load persisted state on app start
  useEffect(() => {
    loadPersistedState();
  }, []);

  // Persist state changes
  useEffect(() => {
    persistState();
  }, [state]);

  const loadPersistedState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('agrishield_state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  };

  const persistState = async () => {
    try {
      await AsyncStorage.setItem('agrishield_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error persisting state:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, isDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};