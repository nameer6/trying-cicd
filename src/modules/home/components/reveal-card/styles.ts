import {StyleSheet, Dimensions} from 'react-native';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  gradientShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  container: {
    paddingVertical: 0,
    width: WIDTH,
    alignSelf: 'center',
    borderRadius: 30,
    // marginTop: -10,
    marginTop: 8,
  },
  topView: {
    paddingHorizontal: 12,
    paddingRight: 16,
  },
  bgImagStyle: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 26,
    // position: 'absolute',
    marginTop: 20,
    marginLeft: 15,
    width: WIDTH - 30,
  },
  questionStyle: {
    marginTop: 32,
    color: 'rgba(0,0,0,0.5)',
    fontSize: 24,
    fontFamily: fonts.HELVETICA_MEDIUM,
    marginLeft: 4,
  },
  divider: {
    width: '25%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.33)',
    opacity: 0.5,
    marginLeft: 4,
    marginTop: 28,
    marginBottom: 10,
  },
  answerView: {
    paddingVertical: 10,
  },
  answerStyle: {
    color: '#000',
    fontSize: 26,
    fontFamily: fonts.HELVETICA_MEDIUM,
    // marginTop: 28,
    marginLeft: 4,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // paddingLeft: 15,
    marginBottom: 5,
  },
  footerScrollContainer: {
    flex: 1,
  },
  footerScrollArea: {
    gap: 8,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 45,
    marginLeft: 16,
  },
  addCommentText: {
    color: '#33363F',
    fontSize: 14,
    fontFamily: fonts.HELVETICA_MEDIUM,
  },
  shareButton: {
    height: 47,
    width: 47,
    borderRadius: 47,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  scrollViewblurEnd: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 50,
  },
  seeMoreTextStyle: {
    color: 'grey',
    fontSize: 14,
    fontFamily: fonts.SF_ROUNDED_REGULAR,
    marginTop: 20,
    textAlign: 'center',
  },
  moreOptionView: {
    paddingBottom: 10,
    paddingLeft: 10,
  },
});
