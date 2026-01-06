// src/components/Button/Button.tsx
import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { ButtonVariant } from '../../types';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  testID?: string;
}

const getVariantStyle = (variant: ButtonVariant): ViewStyle => {
  const variants = {
    primary: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    secondary: {
      backgroundColor: '#6C757D',
      borderColor: '#6C757D',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: '#007AFF',
      borderWidth: 1,
    },
    danger: {
      backgroundColor: '#DC3545',
      borderColor: '#DC3545',
    },
  };
  return variants[variant] || variants.primary;
};

const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
  leftIcon,
  rightIcon,
  children,
  testID,
}) => {
  const variantStyle = getVariantStyle(variant);
  const textColor = variant === 'outline' ? '#007AFF' : '#FFFFFF';

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.button,
        variantStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          {title && (
            <Text style={[styles.text, { color: textColor }, textStyle]}>
              {title}
            </Text>
          )}
          {children}
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

// Compound Component Pattern
const Button = Object.assign(memo(ButtonComponent), {
  Primary: (props: Omit<ButtonProps, 'variant'>) => (
    <ButtonComponent variant="primary" {...props} />
  ),
  Secondary: (props: Omit<ButtonProps, 'variant'>) => (
    <ButtonComponent variant="secondary" {...props} />
  ),
  Outline: (props: Omit<ButtonProps, 'variant'>) => (
    <ButtonComponent variant="outline" {...props} />
  ),
  Danger: (props: Omit<ButtonProps, 'variant'>) => (
    <ButtonComponent variant="danger" {...props} />
  ),
});

export { Button };