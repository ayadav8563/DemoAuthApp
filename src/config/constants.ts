// src/config/constants.ts
export const AppConfig = {
  APP_NAME: 'AuthApp',
  VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  PASSWORD_MIN_LENGTH: 6,
  TOKEN_REFRESH_INTERVAL: 300000, // 5 minutes
} as const;

export const Colors = {
  primary: '#007AFF',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
} as const;

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 28, fontWeight: '600' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};