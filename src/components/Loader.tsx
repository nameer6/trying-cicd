import {ActivityIndicator, StyleSheet, View} from 'react-native';

type Props = {
  style?: any;
  inCenter?: boolean;
};

const Loader = ({style, inCenter}: Props) => {
  return (
    <View style={[styles.container, style, inCenter && styles.ceneterLoader]}>
      <ActivityIndicator color="#fff" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  ceneterLoader: {
    flex: 1,
    marginTop: 0,
  },
});
