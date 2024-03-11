import React from 'react';
import {StyleSheet} from 'react-native';
import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';

type BackgroundGradientProps = {
  width: number;
  height: number;
  type?: string;
};

const BackgroundGradient: React.FC<BackgroundGradientProps> = React.memo(
  ({width, height, type = 'red'}) => {
    const canvasPadding = 40;

    return (
      <Canvas
        style={[
          styles.canvasContainer,
          {
            width: width,
            height: height + canvasPadding,
            overflow: 'hidden',
          },
        ]}>
        <RoundedRect
          x={canvasPadding / 2}
          y={canvasPadding / 2}
          width={width - 40}
          height={height}
          r={26}>
          <SweepGradient
            c={vec(width / 2, (height + canvasPadding) / 2)}
            colors={
              type === 'red'
                ? ['#FF0F7B', '#FF8C00', '#FF0F7B']
                : ['#E81CFF', '#40C9FF', '#E81CFF']
            }
          />
          <BlurMask blur={12} style={'solid'} />
        </RoundedRect>
      </Canvas>
    );
  },
);

export {BackgroundGradient};

const styles = StyleSheet.create({
  canvasContainer: {
    opacity: 0.9,
    position: 'absolute',
  },
});
