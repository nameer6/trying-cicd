import React from 'react';
import {StyleSheet} from 'react-native';
import {BlurMask, Canvas, RoundedRect} from '@shopify/react-native-skia';

type BackgroundGradientProps = {
  width: number;
  height: number;
  type?: string;
};

const BackgroundGradient: React.FC<BackgroundGradientProps> = React.memo(
  ({width, height}) => {
    const canvasPadding = 0;

    return (
      <Canvas
        style={[
          styles.canvasContainer,
          {
            width: width,
            height: height + 110,
          },
        ]}>
        <RoundedRect
          x={canvasPadding / 2}
          y={canvasPadding / 2}
          width={width}
          height={150}
          color="#000"
          r={0}>
          <BlurMask blur={200} style="normal" />
        </RoundedRect>
        <RoundedRect
          x={canvasPadding / 2}
          y={150}
          width={width - 20}
          height={height - 145}
          color="#403b3b"
          r={40}>
          <BlurMask blur={200} style="normal" />
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
    borderRadius: 30,
  },
});
