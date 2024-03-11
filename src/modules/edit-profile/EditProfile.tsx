import {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import {useDispatch} from 'react-redux';
import BackHeader from 'src/components/BackHeader';
import GradientButton from 'src/components/GradientButton';
import ProfileThumbnail from 'src/components/ProfileThumbnail';
import {ProfileType} from 'src/helpers/types/profile.types';
import {colors} from 'src/common/colors';
import profile from 'src/helpers/http/profile';
import {
  showErrorToast,
  showSuccessToast,
  triggerHapticFeedback,
} from 'src/helpers/mics';
import general from 'src/helpers/http/general';
import {updateUserProfile} from 'src/store/reducers/profileStore';
import CameraIcon from 'src/assets/icons/camera.svg';
import {styles} from './styles';
import BounceButton from 'src/components/BounceButton';

const EditProfile = ({route, navigation}: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const dispatch = useDispatch();

  const name = useMemo(() => {
    return [firstName, lastName].join(' ');
  }, [firstName, lastName]);

  useEffect(() => {
    if (route?.params?.profileData) {
      const data = route.params.profileData;
      setImage(data?.user_image);
      setFirstName(data?.full_name?.split(' ')[0]);
      setLastName(data?.full_name?.split(' ')[1]);
      setProfileData(data);
    }
  }, [route.params.profileData]);

  const disableDoneButton = useMemo(() => {
    if (!profileData) {
      return true;
    }
    if (name === profileData?.full_name && image === profileData?.user_image) {
      return true;
    } else {
      return false;
    }
  }, [image, name, profileData]);

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      writeTempFile: false,
      smartAlbums: [
        'UserLibrary',
        'Generic',
        'Screenshots',
        'Favorites',
        'Bursts',
        'Regular',
        'SelfPortraits',
        'SyncedAlbum',
      ],
      mediaType: 'photo',
    }).then(image => {
      console.log(image);
      if (image) {
        const uploadableFile = {
          uri: image?.path,
          name: image?.filename,
          type: image?.mime,
        };
        let path = uploadableFile.uri;
        console.log('FILE URIII: ' + path);
        setUploading(true);
        uploadFile(path);
      }
    });
  };

  async function getBlob(fileUri: string) {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  }

  const uploadFile = async (uri: string) => {
    const imageBody = await getBlob(uri);
    let fileName = new Date().getTime();
    const file = {
      uri: uri,
      name: fileName,
      type: imageBody['type'],
    };
    general
      .generateAwsUrl({
        folder: 'images',
        file_name: fileName + '',
        content_type: imageBody['type'],
      })
      .then(res => {
        const {uploadURL} = res;
        console.log('res:', res);
        uploadImageToBucket(uploadURL, imageBody['type'], file);
      })
      .catch(err => {
        console.log(err);
        showErrorToast('Error uploading image');
        setUploading(false);
      });
  };

  const uploadImageToBucket = (
    s3BucketUrl: string,
    imageType: string,
    file: any,
  ) => {
    console.log('imageType: ' + imageType);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', imageType);

    const requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      body: file,
      redirect: 'follow',
    };
    console.log('requestOptions: ' + JSON.stringify(requestOptions));
    fetch(s3BucketUrl, requestOptions)
      .then(response => {
        console.log('S# bucket upload response: ' + JSON.stringify(response));
        if (response.ok) {
          console.log('s3BucketUrl1: ', s3BucketUrl);
          const uploadedUrl = s3BucketUrl.split('?X-Amz-Algorithm')[0];
          setImage(uploadedUrl);
          setUploading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSave = () => {
    setLoading(true);
    const payload = {
      name,
      user_image: image,
    };
    profile
      .updateProfile(payload)
      .then(res => {
        console.log('profile res: ' + JSON.stringify(res));
        setLoading(false);
        setProfileData((prev: any) => ({
          ...prev,
          full_name: name,
          user_image: image,
        }));
        dispatch(updateUserProfile(payload));
        showSuccessToast(res?.message);
        triggerHapticFeedback('rigid');
        Keyboard.dismiss();
        navigation.goBack();
      })
      .catch(error => {
        setLoading(false);
        console.log('profile error: ' + JSON.stringify(error));
        showErrorToast(error + '');
      });
  };

  return (
    <View style={styles.container}>
      <BackHeader
        title="Edit Profile"
        rightComponent={
          <GradientButton
            onPress={handleSave}
            style={styles.doneButton}
            radius={16}
            disabled={disableDoneButton}
            loading={loading}
            secondColorOffset="0.4">
            <Text style={styles.doneButtonText}>Done</Text>
          </GradientButton>
        }
      />
      <View style={styles.content}>
        <View style={styles.profileImageView}>
          <ProfileThumbnail
            image={image}
            style={styles.imageStyle}
            name={[firstName, lastName].join(' ')}
          />
          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={openGallery}
            disabled={uploading}>
            <EditBackground />
            <CameraIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.nameLabel}>First Name</Text>
        <TextInput
          placeholder="First name"
          style={styles.inputStyle}
          placeholderTextColor={colors.inputPlaceHolderColor}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.nameLabel}>Last Name</Text>
        <TextInput
          placeholder="First name"
          style={styles.inputStyle}
          placeholderTextColor={colors.inputPlaceHolderColor}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
    </View>
  );
};

export default EditProfile;

const EditBackground = () => (
  <Svg height="32" width="32" style={styles.editBackgroundStyle}>
    <Defs>
      <LinearGradient
        id="grad"
        x1="0"
        y1="-2.57343"
        x2="52.1474"
        y2="34.0238"
        gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#00FFB3" />
        <Stop offset="0.7" stopColor="#F0FF44" />
      </LinearGradient>
    </Defs>
    <Circle cx="16" cy="16" r="16" fill="url(#grad)" />
  </Svg>
);
