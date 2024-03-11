import {StyleSheet, Dimensions} from 'react-native';
import {fonts} from 'src/common/fonts';

const WIDTH = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  headerButton: {
    height: 40,
    minWidth: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 54, 63, 0.80)',
    flexDirection: 'row',
  },
  headerWithText: {
    paddingHorizontal: 16,
    gap: 4,
    backgroundColor: '#33363F',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerButtonImgStyle: {
    fontSize: 18,
  },
  categoryItemGradientWrapper: {
    marginBottom: 21,
    width: WIDTH - 32,
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catergoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E5058',
    paddingHorizontal: 17,
    paddingVertical: 17,
    gap: 10,
    borderRadius: 28,
    flex: 1,
    margin: 2,
  },
  catergoryEmoji: {
    fontSize: 29,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: fonts.SF_REGULAR,
    color: '#fff',
    marginTop: 2,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 16,
    marginBottom: 21,
  },
  plusStyle: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 9,
  },
  gradientText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  packsTextStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryImageStyle: {
    height: 29,
    width: 29,
    resizeMode: 'contain',
  },
  selectedCategoryImageStyle: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginRight: 4,
  },
  content: {
    flex: 1,
  },
  catergoryEmojiText: {
    fontSize: 18,
  },
  flatlistScrollStyle: {
    paddingBottom: 70,
  },
});
