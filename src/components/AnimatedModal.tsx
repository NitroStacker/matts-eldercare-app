import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ViewStyle,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  animationType?: 'slide' | 'fade' | 'scale';
  duration?: number;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  onClose,
  children,
  style,
  animationType = 'slide',
  duration = 300,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate backdrop
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: duration * 0.6,
        useNativeDriver: true,
      }).start();

      // Animate content
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration * 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slide':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenHeight, 0],
              }),
            },
          ],
        };
      case 'fade':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: backdropOpacity,
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                {
                  backgroundColor: 'white',
                  borderRadius: 16,
                  width: '90%',
                  maxHeight: '80%',
                  ...getAnimatedStyle(),
                },
                style,
              ]}
            >
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AnimatedModal;
