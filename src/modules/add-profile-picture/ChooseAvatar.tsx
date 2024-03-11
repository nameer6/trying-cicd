import {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fonts} from 'src/common/fonts';
import general from 'src/helpers/http/general';
import {showErrorToast} from 'src/helpers/mics';

type AvatarImgType = {
  avatar_image: string;
};

type Props = {
  onSelect: (avatar: string) => void;
};

const ChooseAvatar = ({onSelect}: Props) => {
  const [avatars, setAvatars] = useState<AvatarImgType[]>([]);

  const getAvatars = () => {
    general
      .getAvatars()
      .then((res: any) => {
        console.log('res: ' + JSON.stringify(res));
        if (res?.status) {
          setAvatars(res?.data);
        } else {
          showErrorToast(res?.message || 'Error fetching avatars');
        }
      })
      .catch(err => {
        console.log('res: ' + JSON.stringify(err));
      });
  };

  useEffect(() => {
    getAvatars();
  }, []);

  const onSelectAvatar = (img: string) => () => {
    onSelect(img);
  };
  return (
    <>
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or choose one</Text>
        <View style={styles.separatorLine} />
      </View>
      <ScrollView horizontal contentContainerStyle={styles.avatarsList}>
        {avatars?.map((avt: AvatarImgType) => (
          <TouchableOpacity
            key={avt.avatar_image}
            onPress={onSelectAvatar(avt.avatar_image)}>
            <Image
              source={{uri: avt.avatar_image}}
              style={styles.avatarStyle}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default ChooseAvatar;

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
    alignSelf: 'center',
  },
  separatorLine: {
    height: 0.5,
    width: 83,
    backgroundColor: '#949494',
  },
  separatorText: {
    color: '#949494',
    fontSize: 14,
    fontFamily: fonts.SF_REGULAR,
  },
  avatarsList: {
    gap: 16,
    marginHorizontal: 20,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avatarStyle: {
    height: 70,
    width: 70,
    borderRadius: 70,
    resizeMode: 'contain',
  },
});
