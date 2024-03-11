import React, {RefObject, useEffect, useMemo, useRef} from 'react';
import {Animated, TouchableOpacity} from 'react-native';

type Props = {
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const BounceButton = ({style, children, onPress, disabled, loading}: Props) => {
  const isDisabled = useMemo(() => {
    return loading || disabled;
  }, [loading, disabled]);
  const bounceValue = useRef(new Animated.Value(1)).current;
  let timeoutId: RefObject<NodeJS.Timeout | null> = useRef(null);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        duration: 60,
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      onPress && onPress();
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <Animated.View style={{transform: [{scale: bounceValue}]}}>
      <TouchableOpacity
        activeOpacity={1}
        style={style}
        onPress={handlePress}
        disabled={isDisabled}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default BounceButton;
