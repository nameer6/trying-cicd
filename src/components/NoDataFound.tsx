import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {fonts} from 'src/common/fonts';

type Props = {
  noDataText?: string;
  style?: any;
  noDataTextStyle?: any;
  noDataImage?: React.ReactNode;
  inCenter?: boolean;
};

const NoDataFound = ({
  noDataText = 'No data found',
  style,
  noDataImage,
  noDataTextStyle,
  inCenter,
}: Props) => {
  return (
    <View style={[styles.container, style, inCenter && styles.inCenter]}>
      {!!noDataImage && noDataImage}
      <Text style={[styles.noDataText, noDataTextStyle]}>{noDataText}</Text>
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inCenter: {
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.5,
  },
});
