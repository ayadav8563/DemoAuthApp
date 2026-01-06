// src/navigation/NavigationService.ts
import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<any>>();
export const isReadyRef = createRef<boolean>();

/**
 * Navigate to a screen in the root navigator
 */
export function navigate(name: string, params?: any) {
  if (navigationRef.current && isReadyRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('Navigation not ready yet');
    // You can queue navigation actions here if needed
  }
}

/**
 * Go back to previous screen
 */
export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
  }
}

/**
 * Reset navigation stack
 */
export function reset(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}