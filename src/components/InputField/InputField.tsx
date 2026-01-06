// src/components/InputField/InputField.tsx
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { InputType } from '../../types';

export interface InputFieldRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: InputType;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showCharacterCount?: boolean;
  maxLength?: number;
  onValidation?: (value: string) => string | undefined;
}

const InputField = forwardRef<InputFieldRef, InputFieldProps>(
  (
    {
      label,
      value,
      onChangeText,
      placeholder,
      error,
      success,
      leftIcon,
      rightIcon,
      type = 'text',
      secureTextEntry = false,
      containerStyle,
      inputStyle,
      showCharacterCount = false,
      maxLength,
      onBlur,
      onFocus,
      onValidation,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [internalError, setInternalError] = useState<string | undefined>();

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => {
        inputRef.current?.clear();
        onChangeText?.('');
        setInternalError(undefined);
      },
    }));

    // Handle focus and blur
    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
      if (onValidation) setInternalError(onValidation(value ?? ''));
    };

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      setInternalError(undefined);
      onFocus?.(e);
    };

    const handleChangeText = (text: string) => {
      onChangeText?.(text);
      if (internalError) setInternalError(undefined);
    };

    // Determine keyboard type
    const getKeyboardType = (): TextInputProps['keyboardType'] => {
      const map: Record<string, TextInputProps['keyboardType']> = {
        email: 'email-address',
        number: 'numeric',
      };
      return map[type] || 'default';
    };

    // Render right icon
    const renderRightIcon = () => {
      if (rightIcon) return rightIcon;

      if (secureTextEntry) {
        return (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        );
      }

      if (success && !error && !internalError) {
        return <Icon name="check-circle" size={22} color="#28A745" style={styles.icon} />;
      }

      return null;
    };

    const displayError = error || internalError;
    const characterCount = value?.length ?? 0;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && <Text style={styles.label}>{label}</Text>}

        {/* Input container */}
        <View
          style={[
            {
              flexDirection: 'row',
              borderWidth: 1.5,
              borderColor: isFocused
                ? '#007AFF'
                : displayError
                ? '#DC3545'
                : success && !displayError
                ? '#28A745'
                : '#E9ECEF',
              borderRadius: 10,
              backgroundColor: '#FFF',
              height: 52,
              paddingHorizontal: 0,
              alignItems: 'center',
            },
          ]}
        >
          {/* Left icon */}
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          {/* TextInput */}
          <TextInput
            ref={inputRef}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={getKeyboardType()}
            autoCapitalize="none"
            autoCorrect={false}
            onBlur={handleBlur}
            onFocus={handleFocus}
            maxLength={maxLength}
            {...rest}
          />

          {/* Right icon */}
          {renderRightIcon()}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {displayError && (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" size={14} color="#DC3545" />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}
          {showCharacterCount && maxLength !== undefined && (
            <Text style={styles.characterCount}>
              {characterCount}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#333',
  },
  leftIcon: {
    paddingLeft: 16,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  iconButton: {
    paddingRight: 16,
    justifyContent: 'center',
  },
  icon: { marginRight: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  errorContainer: { flexDirection: 'row', alignItems: 'center' },
  errorText: { color: '#DC3545', fontSize: 12, marginLeft: 4 },
  characterCount: { fontSize: 12, color: '#6C757D' },
});

export { InputField };
