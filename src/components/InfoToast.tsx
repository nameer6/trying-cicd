import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

interface AnimatedShowToastProps {
  title: string;
  description: string;
  style?: any;
}

const ToastContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View style={styles.toastContentView}>
    <Text style={styles.toastTitleTextStyle}>{title}</Text>
    {!!description && (
      <Text style={styles.toastDescriptionTextStyle}>{description}</Text>
    )}
  </View>
);

const InfoToast = ({title, description, style}: AnimatedShowToastProps) => {
  return (
    <View style={[styles.toastContainer, style]}>
      <View style={styles.iconViewContainer}>
        <Icon name="info" color="#FF9C41" size={20} />
      </View>
      <ToastContent title={title} description={description} />
    </View>
  );
};

export default InfoToast;
const styles = StyleSheet.create({
  toastContainer: {
    borderWidth: 1,
    borderColor: '#FF9C41',
    borderRadius: 18,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingRight: 15,
    width: WIDTH - 32,
    alignSelf: 'center',
    backgroundColor: '#26282F',
    marginTop: 20,
    paddingBottom: 16,
  },
  iconViewContainer: {
    alignItems: 'center',
  },
  toastContentView: {
    marginLeft: 10,
    maxWidth: '90%',
  },
  toastTitleTextStyle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
  toastDescriptionTextStyle: {
    fontFamily: fonts.SF_REGULAR,
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    opacity: 0.5,
  },
});
