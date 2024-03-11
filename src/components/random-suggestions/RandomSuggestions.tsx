import {useState} from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import GradientText from 'src/components/GradientText';
import {colors} from 'src/common/colors';
import {styles} from './styles';

type Props = {
  style?: any;
  selected?: any;
};

const RandomSuggestions = ({style, selected}: Props) => {
  return (
    <View style={[styles.container, style]}>
      {/* Shadow wrapper */}
      <>
        <View
          style={[
            styles.imageWrapperOuter,
            selected?.shadow_color_code && {
              shadowColor: selected?.shadow_color_code,
            },
          ]}>
          <View
            style={[
              styles.imageWrapperInner,
              selected?.shadow_color_code && {
                shadowColor: selected?.shadow_color_code,
              },
            ]}>
            {selected?.image && (
              <FastImage
                source={{uri: selected?.image}}
                style={styles.imageStyle}
              />
            )}
          </View>
        </View>
        <View style={styles.titleStyle}>
          <Text style={styles.titleTextStyle}>Reveal to your </Text>
          <GradientText
            start={{x: 1, y: 0.8}}
            style={styles.titleTextStyle}
            colors={[colors.gradientLimeColor, colors.gradientGreenColor]}>
            {selected?.reveal_to}
          </GradientText>
        </View>
        <Text style={styles.descriptionStyle}>{selected?.text}</Text>
      </>
    </View>
  );
};

export default RandomSuggestions;

// shadow_color: 'rgba(255, 184, 39, 1)',
// shadow_color: 'rgba(231, 81, 164, 1)',
