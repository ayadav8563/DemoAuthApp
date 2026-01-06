// src/components/SplashScreen/SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

export interface SplashScreenProps {
  /** Duration in milliseconds (default: 1500) */
  duration?: number;
  /** Called when animation completes */
  onAnimationComplete?: () => void;
  /** Called when ready to hide */
  onReady?: () => void;
  /** Custom logo component */
  logo?: React.ReactNode;
  /** App name to display */
  appName?: string;
  /** Loading message */
  message?: string;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show loading dots */
  showLoadingDots?: boolean;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Progress bar color */
  progressColor?: string;
}

/**
 * Clean, professional splash screen with simple animations
 * No external dependencies required
 */
export const Splash: React.FC<SplashScreenProps> = ({
  duration = 1500,
  onAnimationComplete,
  onReady,
  logo,
  appName = 'AuthApp',
  message = 'Loading...',
  showProgress = true,
  showLoadingDots = true,
  backgroundColor = '#007AFF',
  textColor = '#FFFFFF',
  progressColor = '#FFFFFF',
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;
  
  const [progress, setProgress] = useState(0);

  // Progress width interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // Scale up with bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration - 200,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Loading dots animation
    if (showLoadingDots) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim1, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim2, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim3, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Update progress percentage
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 100);
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          // Call onAnimationComplete when animation finishes
          setTimeout(() => {
            onAnimationComplete?.();
          }, 200);
        }
        
        return newProgress;
      });
    }, 100);

    // Overall timeout for splash screen
    const timer = setTimeout(() => {
      onReady?.();
    }, duration);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, fadeAnim, scaleAnim, progressAnim, dotAnim1, dotAnim2, dotAnim3, showLoadingDots, onAnimationComplete, onReady]);

  const renderDefaultLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Outer circle with pulse effect */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            borderColor: textColor,
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.1],
            }),
          },
        ]}
      />
      
      {/* Main logo circle */}
      <View style={[styles.logoCircle, { borderColor: textColor }]}>
        <View style={[styles.logoInner, { backgroundColor: textColor }]} />
      </View>
      
      {/* Rotating ring */}
      <Animated.View
        style={[
          styles.rotatingRing,
          {
            borderColor: textColor,
            transform: [
              {
                rotate: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );

  const renderLoadingDots = () => {
    if (!showLoadingDots) return null;

    return (
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: textColor,
              opacity: dotAnim1,
              transform: [
                {
                  scale: dotAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: textColor,
              opacity: dotAnim2,
              transform: [
                {
                  scale: dotAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: textColor,
              opacity: dotAnim3,
              transform: [
                {
                  scale: dotAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      
      <View style={styles.content}>
        {logo || renderDefaultLogo()}
        
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.appName, { color: textColor }]}>
            {appName}
          </Text>
          <Text style={[styles.message, { color: textColor }]}>
            {message}
          </Text>
        </Animated.View>

        {renderLoadingDots()}

        {showProgress && (
          <Animated.View
            style={[
              styles.progressSection,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.progressContainer}>
              <View style={[styles.progressTrack, { backgroundColor: `${textColor}30` }]}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressWidth,
                      backgroundColor: progressColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: textColor }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: `${textColor}80` }]}>
            Secure Authentication
          </Text>
          <Text style={[styles.versionText, { color: `${textColor}60` }]}>
            v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
    marginBottom: 32,
  },
  outerCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  rotatingRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressSection: {
    width: '100%',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  versionText: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});

export default Splash;