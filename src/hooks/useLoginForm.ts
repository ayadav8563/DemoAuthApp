// src/hooks/useLoginForm.ts
import { useState, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Credentials } from '../types';
import { validateEmail, validatePassword } from '../utils/validators';

interface UseLoginFormReturn {
  credentials: Credentials;
  errors: Partial<Credentials>;
  isLoading: boolean;
  handleChange: (field: keyof Credentials, value: string) => void;
  handleSubmit: () => Promise<void>;
  validateForm: () => boolean;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { login, isLoading } = useAuthContext();
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Credentials>>({});

  const handleChange = useCallback((field: keyof Credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear error for field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Credentials> = {};
    
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(credentials.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [credentials]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      await login(credentials);
    } catch (err) {
      // Error is already handled in auth context
      console.error('Login failed:', err);
    }
  }, [credentials, login, validateForm]);

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    validateForm,
  };
};