import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import React, {useEffect} from 'react';

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
        style={{
          width: width,
          height: height + canvasPadding,
        }}>
        <RoundedRect
          x={canvasPadding / 2}
          y={canvasPadding / 2}
          width={width - 40}
          height={height}
          r={30}>
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
