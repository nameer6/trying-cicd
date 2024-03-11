import {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from 'src/common/colors';
import {fonts} from 'src/common/fonts';
import {isUrl} from 'src/helpers/mics';

type Props = {
  image?: string;
  name?: string;
  style?: any;
};

const ProfileThumbnail = ({image, name, style}: Props) => {
  const initials = useMemo(() => {
    return name
      ?.split(' ')
      ?.slice(0, 2)
      ?.map(n => n[0]);
  }, [name]);

  const isValidImage = useMemo(() => {
    if (!image) {
      return false;
    }
    if (isUrl(image)) {
      return true;
    } else {
      return false;
    }
  }, [image]);
  return (
    <View style={[styles.container, style]}>
      {!!isValidImage && (
        <FastImage source={{uri: image}} style={[styles.imageStyle, style]} />
      )}
      {!isValidImage && !!name && (
        <Text style={styles.initialsTextStyle}>{initials}</Text>
      )}
    </View>
  );
};

export default ProfileThumbnail;

const styles = StyleSheet.create({
  container: {
    height: 46,
    width: 46,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputPlaceHolderColor,
  },
  imageStyle: {
    height: 46,
    width: 46,
    borderRadius: 46,
  },
  initialsTextStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});
