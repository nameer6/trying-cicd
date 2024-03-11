import LottieView from 'lottie-react-native';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

interface AnimatedShowToastProps {
  loading?: boolean;
  title: string;
  description?: string;
  key?: string;
  type?: string;
}

const ToastContent = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <View style={styles.toastContentView}>
    <Text style={styles.toastTitleTextStyle}>{title}</Text>
    {description && (
      <Text style={styles.toastDescriptionTextStyle}>{description}</Text>
    )}
  </View>
);

const SuccessToast = ({
  title,
  description,
  key = new Date().getTime() + '',
  type,
}: AnimatedShowToastProps) => {
  return (
    <View
      style={[styles.toastContainer, type === 'error' && styles.erroConatiner]}>
      {type === 'successToast' && (
        <LottieView
          style={styles.lottieImage}
          source={require('src/assets/lottie/success.json')}
          autoPlay
          duration={4000}
          loop={false}
          key={key}
        />
      )}
      {type === 'error' && (
        <LottieView
          style={styles.lottieImage}
          source={require('src/assets/lottie/error.json')}
          autoPlay
          duration={2000}
          loop={false}
          key={key}
        />
      )}

      <ToastContent title={title} description={description} />
    </View>
  );
};

export default SuccessToast;

const styles = StyleSheet.create({
  toastContainer: {
    borderRadius: 18,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingRight: 15,
    width: WIDTH - 32,
    alignSelf: 'center',
    backgroundColor: '#26282F',
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00C985',
    flex: 1,
    paddingVertical: 8,
  },
  erroConatiner: {
    borderWidth: 1,
    borderColor: '#E23E3E',
  },
  iconViewContainer: {
    alignItems: 'center',
  },
  toastContentView: {
    marginLeft: 4,
    flex: 1,
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
  lottieImage: {
    height: 60,
    width: 60,
  },
});
