import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import AuthBackHeader from 'src/components/AuthBackHeader';
import GradientButton from 'src/components/GradientButton';
import ChooseAvatar from './ChooseAvatar';
import auth from 'src/helpers/http/auth';
import {showErrorToast} from 'src/helpers/mics';
import {setToken} from 'src/helpers/storage';
import {updateUserProfile} from 'src/store/reducers/profileStore';
import general from 'src/helpers/http/general';
import {styles} from './styles';
import BounceButton from 'src/components/BounceButton';

const AddPicture = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: any) => state.user);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePhoto = () => {
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
        // console.log('res:', res);
        uploadImageToBucket(uploadURL, imageBody['type'], file);
      })
      .catch(() => {
        // console.log(err);
        showErrorToast('Error uploading image');
        setUploading(false);
      });
  };

  const uploadImageToBucket = (
    s3BucketUrl: string,
    imageType: string,
    file: any,
  ) => {
    // console.log('imageType: ' + imageType);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', imageType);

    const requestOptions: any = {
      method: 'PUT',
      headers: myHeaders,
      body: file,
      redirect: 'follow',
    };
    // console.log('requestOptions: ' + JSON.stringify(requestOptions));

    fetch(s3BucketUrl, requestOptions)
      .then(response => {
        // console.log('S# bucket upload response: ' + JSON.stringify(response));
        if (response.ok) {
          const uploadedUrl = s3BucketUrl.split('?X-Amz-Algorithm')[0];
          setCapturedImage(uploadedUrl);
          setUploading(false);
        }
      })
      .catch(() => {
        // console.log(err);
      });
  };

  const onSelectAvatar = (selectedAvatar: string) => {
    setCapturedImage(selectedAvatar);
  };

  const onNext = () => {
    setLoading(true);
    const payload = {
      ...user,
      user_image: capturedImage,
    };
    // console.log('payload: ' + JSON.stringify(payload));
    auth
      .register(payload)
      .then(async (res: any) => {
        // console.log('res: ' + JSON.stringify(res));
        if (res.status) {
          // console.log('token: ', res?.data?.token);
          await setToken(res?.data?.token);
          await dispatch(updateUserProfile(payload));
          navigation.navigate('Home');
        } else {
          showErrorToast(res.message);
        }
        setLoading(false);
      })
      .catch(err => {
        showErrorToast(err);
        // console.log('err: ' + JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <AuthBackHeader title="Add a profile picture" />
      <View>
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              capturedImage
                ? {uri: capturedImage}
                : require('src/assets/images/default_avatar.png')
            }
            style={styles.profilePicture}
          />
          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.infoText}>Imported from Contacts</Text>
        <ChooseAvatar onSelect={onSelectAvatar} />
      </View>
      <View style={styles.buttons}>
        <BounceButton
          style={styles.changePhotoButton}
          onPress={handleChangePhoto}>
          <Text style={styles.changePhotoButtonText}>Change photo</Text>
        </BounceButton>
        <GradientButton
          style={styles.button}
          disabled={!capturedImage}
          loading={loading}
          onPress={onNext}>
          <Text
            style={[styles.buttonText, !capturedImage && styles.disabledText]}>
            Next
          </Text>
        </GradientButton>
      </View>
    </View>
  );
};

export default AddPicture;
