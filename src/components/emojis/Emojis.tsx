import {memo, useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import EmojiPicker from './EmojiPicker';
import {fonts} from 'src/common/fonts';
import reveals from 'src/helpers/http/reveals';
import {ReactionType} from 'src/helpers/types/reveal.types';
import OtherEmojiIcon from 'src/assets/icons/other-emoji.svg';
import {triggerHapticFeedback} from 'src/helpers/mics';
import BounceButton from '../BounceButton';

type Props = {
  reactionsData: ReactionType[];
  answer_id?: string;
  current_user_reactions?: string[];
};

const Emojis = memo(function Emojis({
  reactionsData,
  current_user_reactions,
  answer_id,
}: Props) {
  const [reactions, setReactions] = useState<ReactionType[]>([]);
  const [currentUserReactions, setCurrentUserReactions] = useState<any>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    if (!showEmojiPicker) {
      triggerHapticFeedback();
    }
  };

  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (reactionsData?.length > 0) {
      const updatedReactions = [...reactionsData].map(reaction => ({
        ...reaction,
        isCurrentUser:
          reaction.isCurrentUser ||
          currentUserReactions.includes(reaction.reaction_unicode),
      }));

      setReactions(updatedReactions);
    } else {
      setReactions([]);
    }
  }, [currentUserReactions, reactionsData]);

  useEffect(() => {
    if (current_user_reactions) {
      setCurrentUserReactions(current_user_reactions || []);
    }
  }, [current_user_reactions]);

  const updateReactionsForQuery = useCallback(
    (queryKey: string, currentReactions: any) => {
      queryClient.setQueryData([queryKey], (prev: any) => {
        if (prev?.pages) {
          const updatedPages = prev.pages.map((page: any) => {
            const updatedData = (page?.data || []).map((item: any) => {
              if (item.answer_id === answer_id) {
                return {
                  ...item,
                  reactions: currentReactions,
                  current_user_reactions: currentReactions?.filter(
                    (i: any) => i.isCurrentUser,
                  ),
                };
              }
              return item;
            });

            return {...page, data: updatedData};
          });

          return {pages: updatedPages, pageParams: prev.pageParams};
        }

        return prev;
      });
    },
    [answer_id, queryClient],
  );

  const updateQueryDataForRevealWithOtherScreen = useCallback(
    (currentReactions: any) => {
      queryClient.setQueryData(['get-reveals-with-others'], (prev: any) => {
        if (prev?.pages) {
          const updatedPages = prev.pages.map((page: any) => {
            const prevData = page?.data;
            const updatedReveals = (prevData?.reveals || []).map(
              (item: any) => {
                if (item.answer_id === answer_id) {
                  return {
                    ...item,
                    reactions: currentReactions,
                    current_user_reactions: currentReactions?.filter(
                      (i: any) => i.isCurrentUser,
                    ),
                  };
                }
                return item;
              },
            );

            return {...page, data: {...prevData, reveals: updatedReveals}};
          });

          return {pages: updatedPages, pageParams: prev.pageParams};
        }

        return prev;
      });
    },
    [answer_id, queryClient],
  );

  const onPress = useCallback(
    (emoji: string) => async () => {
      triggerHapticFeedback();
      const currentReactions = [...reactions];
      const payload = {
        answer_id,
        reaction: emoji,
      };
      const index = currentReactions.findIndex(
        i => i.reaction_unicode === emoji,
      );
      console.log('currentReactions:: ' + JSON.stringify(currentReactions));
      if (index === -1) {
        currentReactions.push({
          reaction_unicode: emoji,
          count: 1,
          isCurrentUser: true,
        });
      } else {
        if (currentReactions[index].isCurrentUser) {
          if (currentReactions[index].count === 1) {
            currentReactions.splice(index, 1);
          } else {
            currentReactions[index].count = currentReactions[index].count - 1;
            currentReactions[index].isCurrentUser = false;
          }
        } else {
          currentReactions[index].count = currentReactions[index].count + 1;
          currentReactions[index].isCurrentUser = true;
        }
      }
      setReactions(currentReactions);
      reveals.addReaction(payload);

      const queryKeysToUpdate = ['get-reveals', 'get-my-archives'];

      queryKeysToUpdate.forEach(queryKey => {
        updateReactionsForQuery(queryKey, currentReactions);
      });
      updateQueryDataForRevealWithOtherScreen(currentReactions);
    },
    [
      reactions,
      answer_id,
      updateReactionsForQuery,
      updateQueryDataForRevealWithOtherScreen,
    ],
  );

  const onSelectEmoji = (emoji: string) => {
    onPress(emoji)();
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {reactions.map(i => (
          <BounceButton
            key={i.reaction_unicode + '-' + answer_id}
            style={styles.emojiItem}
            onPress={onPress(i.reaction_unicode)}>
            <Text style={styles.emojiText}>{i.reaction_unicode}</Text>
            {!!i.count && <Text style={styles.emojiCount}>{i.count}</Text>}
          </BounceButton>
        ))}
        <BounceButton style={styles.emojiItem} onPress={toggleEmojiPicker}>
          {/* <Pressable style={styles.emojiItem} onPress={toggleEmojiPicker}> */}
          <OtherEmojiIcon />
          {/* </Pressable> */}
        </BounceButton>
      </ScrollView>
      <EmojiPicker
        show={showEmojiPicker}
        onClose={closeEmojiPicker}
        onSelectEmoji={onSelectEmoji}
      />
    </>
  );
});

export default Emojis;

const styles = StyleSheet.create({
  emojiItem: {
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    flex: 1,
  },
  emojiText: {
    fontSize: 22,
  },
  emojiCount: {
    fontSize: 14,
    color: '#33363F',
    fontFamily: fonts.HELVETICA_BOLD,
  },
});
