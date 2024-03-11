import {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import CategoriesPopup from 'src/components/create-reveal/category-popup/CategoriesPopup';
import reveals from 'src/helpers/http/reveals';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateCreateRevealState,
  updateQuestionsToExclude,
} from 'src/store/reducers/createReveal';
import {showErrorToast, triggerHapticFeedback} from 'src/helpers/mics';
import BounceButton from 'src/components/BounceButton';

const ComposeHeader = ({onClose}: {onClose: () => void}) => {
  const dispatch = useDispatch();
  const {create_reveal_state, questions_to_exclude} = useSelector(
    (state: any) => state.createReveal,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [rotation]: any = useState(new Animated.Value(0));

  const rotateAnimation = useCallback(() => {
    Animated.timing(rotation, {
      toValue: rotation._value - 180, // Rotate counterclockwise by 180 degrees
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [rotation]);

  const getQuestionToReveal = useCallback(() => {
    triggerHapticFeedback();
    rotateAnimation();
    setLoading(true);
    // console.log(
    //   'create_reveal_state.questions_to_exclude: ' + questions_to_exclude,
    // );
    reveals
      .getAllRevealQuestions({
        category_id:
          create_reveal_state.selected_category?.question_category_id,
        exclude_reveals: questions_to_exclude,
      })
      .then(async res => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
        // console.log('Reveal question: ' + JSON.stringify(res));
        if (res?.data) {
          await dispatch(updateQuestionsToExclude(res?.data[0]?.question_id));
          await dispatch(
            updateCreateRevealState({
              questionToReveal: res?.data[0],
            }),
          );
        } else {
          showErrorToast(res?.message);
        }
      })
      .catch(error => {
        setLoading(false);
        showErrorToast(error + '');
      });
  }, [
    create_reveal_state.selected_category?.question_category_id,
    dispatch,
    questions_to_exclude,
    rotateAnimation,
  ]);

  useEffect(() => {
    if (!create_reveal_state?.questionToReveal) {
      getQuestionToReveal();
    }
  }, [create_reveal_state?.questionToReveal, getQuestionToReveal]);

  const interpolatedRotate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.header}>
      <CategoriesPopup showWithText onClose={onClose} />
      <BounceButton onPress={getQuestionToReveal} disabled={loading}>
        <View style={[styles.headerButton, styles.headerWithText]}>
          <Text style={styles.headerButtonText}>Shuffle</Text>
          <Animated.Text
            style={{
              transform: [
                {
                  rotate: interpolatedRotate,
                },
              ],
            }}>
            🎲
          </Animated.Text>
        </View>
      </BounceButton>
    </View>
  );
};

export default ComposeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  headerButton: {
    height: 40,
    minWidth: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33363F',
    flexDirection: 'row',
  },
  headerWithText: {
    paddingHorizontal: 16,
    gap: 6,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  hiddenButton: {
    opacity: 0,
  },
  rollingDice: {
    height: 40,
    width: 40,
  },
});
