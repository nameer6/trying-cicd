import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import reveals from 'src/helpers/http/reveals';
import {updateCreateRevealState} from 'src/store/reducers/createReveal';
import {CategoryType} from 'src/helpers/types/catrgories.types';
import {styles} from './styles';
import SheetBackdrop from 'src/components/bottom-sheet-components/SheetBackdrop';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  sheetContainerStyle,
  sheetIndicatorStyle,
  sheetShadowStyle,
} from 'src/common/common-styles';
import GradientButton from './GradientButton';
import BounceButton from 'src/components/BounceButton';

const HEIGHT = Dimensions.get('window').height;

type Props = {
  showWithText?: boolean;
  onClose?: () => void;
};

const CategoriesPopup = ({showWithText = false, onClose}: Props) => {
  const dispatch = useDispatch();
  const {create_reveal_state} = useSelector((state: any) => state.createReveal);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const openSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = (props: any) => <SheetBackdrop {...props} />;

  const getCategories = () => {
    reveals.getCategories().then(res => {
      if (res?.data) {
        // console.log('Categories: ', res?.data);
        setCategories(res?.data);
      }
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const renderCategory = ({item}: {item: CategoryType}) => {
    const onSelectCategory = async () => {
      setTimeout(async () => {
        await dispatch(
          updateCreateRevealState({
            selected_category: item,
          }),
        );
        closeSheet();
      }, 60);
    };
    return (
      <GradientButton
        onPress={onSelectCategory}
        style={styles.categoryItemGradientWrapper}
        colorsArray={
          create_reveal_state?.selected_category?.question_category_id !==
          item.question_category_id
            ? ['#4E5058', '#4E5058']
            : undefined
        }>
        {item.question_category_id === 'random' ? (
          <Text style={styles.catergoryEmoji}>{item.category_image}</Text>
        ) : (
          <FastImage
            source={{
              uri: item?.category_image,
            }}
            style={styles.categoryImageStyle}
          />
        )}
        <View style={styles.content}>
          <Text style={styles.categoryTitle}>{item.category_name}</Text>
          {!!item.text && (
            <Text style={styles.categoryDescription}>{item.text}</Text>
          )}
        </View>
      </GradientButton>
    );
  };

  const handleSheetChange = (index: number) => {
    if (index === -1) {
      onClose && onClose();
    }
  };

  return (
    <View>
      <BounceButton onPress={openSheet}>
        <View
          style={[styles.headerButton, showWithText && styles.headerWithText]}>
          {create_reveal_state?.selected_category?.category_name !==
          'Random' ? (
            <FastImage
              source={{
                uri: create_reveal_state?.selected_category?.category_image,
              }}
              style={styles.selectedCategoryImageStyle}
            />
          ) : (
            <Text style={styles.catergoryEmojiText}>
              {create_reveal_state?.selected_category.category_image}
            </Text>
          )}
          {showWithText && (
            <Text style={styles.headerButtonText}>
              {create_reveal_state?.selected_category.category_name}
            </Text>
          )}
        </View>
      </BounceButton>
      <BottomSheetModal
        ref={bottomSheetRef}
        stackBehavior="push"
        // index={show ? 0 : -1}
        snapPoints={[HEIGHT / 1.3, HEIGHT]}
        topInset={50}
        onChange={handleSheetChange}
        enableHandlePanningGesture
        enablePanDownToClose
        enableDismissOnClose
        style={sheetShadowStyle}
        backgroundStyle={sheetContainerStyle}
        handleIndicatorStyle={sheetIndicatorStyle}
        keyboardBehavior="interactive"
        backdropComponent={renderBackdrop}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <LinearGradient
              style={styles.plusStyle}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#8B79FC', '#D929F9']}>
              <Text style={styles.gradientText}>PLUS</Text>
            </LinearGradient>
            <Text style={styles.packsTextStyle}>Packs</Text>
          </View>
          <BottomSheetFlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.question_category_id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatlistScrollStyle}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default CategoriesPopup;
