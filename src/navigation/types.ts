// src/navigation/types.ts
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Root stack parameter list
 */
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  ForgotPassword?: { email?: string };
  ResetPassword?: { token?: string };
};

/**
 * Authentication stack (for unauthenticated users)
 */
export type AuthStackParamList = Pick<
  RootStackParamList, 
  'Login' | 'Signup' | 'ForgotPassword' | 'ResetPassword'
>;

/**
 * Main stack (for authenticated users)
 */
export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  // Add other authenticated screens here
};

/**
 * Bottom tab navigator parameter list
 */
export type BottomTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications?: { count?: number };
};

// ============================================
// SCREEN PROP TYPES
// ============================================

/**
 * Login screen props
 */
export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

/**
 * Signup screen props
 */
export type SignupScreenProps = StackScreenProps<RootStackParamList, 'Signup'>;

/**
 * Home screen props
 */
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

/**
 * Forgot password screen props
 */
export type ForgotPasswordScreenProps = StackScreenProps<
  RootStackParamList, 
  'ForgotPassword'
>;

// ============================================
// COMPOSITE PROP TYPES (for nested navigation)
// ============================================

/**
 * Bottom tab screen props with stack navigation
 * 
 * Usage: 
 * type DashboardScreenProps = TabScreenProps<'Dashboard'>;
 * type ProfileScreenProps = TabScreenProps<'Profile'>;
 */
export type TabScreenProps<T extends keyof BottomTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >;

/**
 * Stack screen props within tabs
 * 
 * Usage for screens inside tab navigators
 */
export type StackScreenInTabProps<
  T extends keyof MainStackParamList
> = CompositeScreenProps<
  StackScreenProps<MainStackParamList, T>,
  BottomTabScreenProps<BottomTabParamList>
>;

// ============================================
// NAVIGATION HOOK TYPES
// ============================================

/**
 * UseNavigation hook type for root stack
 */
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

/**
 * UseRoute hook type for root stack
 */
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

/**
 * Navigation prop type for login screen
 */
export type LoginNavigationProp = RootStackNavigationProp<'Login'>;

/**
 * Navigation prop type for signup screen
 */
export type SignupNavigationProp = RootStackNavigationProp<'Signup'>;

/**
 * Navigation prop type for home screen
 */
export type HomeNavigationProp = RootStackNavigationProp<'Home'>;

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract screen params for type-safe navigation
 */
export type ExtractParams<T> = T extends undefined 
  ? undefined 
  : { [K in keyof T]: T[K] };

/**
 * Screen component props with navigation and route
 */
export interface ScreenProps<
  RouteName extends keyof RootStackParamList
> {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
}