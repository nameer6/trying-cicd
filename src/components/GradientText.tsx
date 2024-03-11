import {StyleSheet, Text} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {colors as Colors} from 'src/common/colors';

interface GradientTextProps {
  colors?: string[];
  [x: string]: any;
}

const GradientText = ({
  colors = [Colors.gradientGreenColor, Colors.gradientLimeColor],
  ...rest
}: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <LinearGradient
        colors={colors}
        start={rest.start || {x: 0, y: 0}}
        end={rest.end || {x: 1, y: 0}}>
        <Text {...rest} style={[rest.style, styles.noOpacity]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;

const styles = StyleSheet.create({
  noOpacity: {
    opacity: 0,
  },
});
