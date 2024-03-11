import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import emoji from 'emoji-datasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

export const Categories = {
  all: {
    symbol: null,
    name: 'All',
  },
  // history: {
  // symbol: '🕘',
  // name: 'Recently used',
  // },
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  people: {
    symbol: '🧑',
    name: 'People & Body',
  },
  nature: {
    symbol: '🦄',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚾️',
    name: 'Activities',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍🌈',
    name: 'Flags',
  },
};

const charFromUtf16 = utf16 =>
  String.fromCodePoint(...utf16.split('-').map(u => '0x' + u));
export const charFromEmojiObject = obj => charFromUtf16(obj.unified);
const filteredEmojis = emoji.filter(e => !e['obsoleted_by']);
const emojiByCategory = category =>
  filteredEmojis.filter(e => e.category === category);
const sortEmoji = list => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

const TabBar = ({theme, activeCategory, onPress, width}) => {
  const tabSize = width / categoryKeys.length;

  return categoryKeys.map(c => {
    const category = Categories[c];
    if (c !== 'all')
      return (
        <TouchableOpacity
          key={category.name}
          onPress={() => onPress(category)}
          style={{
            flex: 1,
            height: tabSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              paddingBottom: 8,
              fontSize: 16,
            }}>
            {category.symbol}
          </Text>
        </TouchableOpacity>
      );
  });
};

const EmojiCell = ({emoji, colSize, ...other}) => (
  <TouchableOpacity
    activeOpacity={0.5}
    style={{
      width: colSize,
      height: colSize,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    {...other}>
    <Text style={{color: '#FFFFFF', fontSize: 30}}>
      {charFromEmojiObject(emoji)}
    </Text>
  </TouchableOpacity>
);

const storage_key = '@react-native-emoji-selector:HISTORY';
export default class EmojiSelector extends Component {
  state = {
    searchQuery: '',
    category: Categories.people,
    isReady: false,
    history: [],
    emojiList: null,
    colSize: 0,
    width: 0,
  };

  //
  // HANDLER METHODS
  //
  handleTabSelect = category => {
    if (this.state.isReady) {
      if (this.scrollview)
        this.scrollview.scrollToOffset({x: 0, y: 0, animated: false});
      this.setState({
        searchQuery: '',
        category,
      });
    }
  };

  handleEmojiSelect = emoji => {
    if (this.props.showHistory) {
      this.addToHistoryAsync(emoji);
    }
    this.props.onEmojiSelected(charFromEmojiObject(emoji));
  };

  handleSearch = searchQuery => {
    this.setState({searchQuery});
  };

  addToHistoryAsync = async emoji => {
    let history = await AsyncStorage.getItem(storage_key);

    let value = [];
    if (!history) {
      // no history
      let record = Object.assign({}, emoji, {count: 1});
      value.push(record);
    } else {
      let json = JSON.parse(history);
      if (json.filter(r => r.unified === emoji.unified).length > 0) {
        value = json;
      } else {
        let record = Object.assign({}, emoji, {count: 1});
        value = [record, ...json];
      }
    }

    AsyncStorage.setItem(storage_key, JSON.stringify(value));
    this.setState({
      history: value,
    });
  };

  loadHistoryAsync = async () => {
    let result = await AsyncStorage.getItem(storage_key);
    if (result) {
      let history = JSON.parse(result);
      this.setState({history});
    } else {
      this.setState({category: Categories.all});
    }
  };

  //
  // RENDER METHODS
  //
  renderEmojiCell = ({item}) => (
    <EmojiCell
      key={item.key}
      emoji={item.emoji}
      onPress={() => this.handleEmojiSelect(item.emoji)}
      colSize={this.state.colSize}
    />
  );

  returnSectionData() {
    const {history, emojiList, searchQuery, category} = this.state;
    let emojiData = (function () {
      if (category === Categories.all && searchQuery === '') {
        let largeList = [];
        categoryKeys.forEach(c => {
          const name = Categories[c]?.name;
          const list =
            name === Categories?.history?.name ? history : emojiList[name];
          if (c !== 'all' && c !== 'history')
            largeList = largeList.concat(list);
        });

        return largeList.map(emoji => ({key: emoji.unified, emoji}));
      } else {
        let list;
        const hasSearchQuery = searchQuery !== '';
        const name = category.name;
        if (hasSearchQuery) {
          const filtered = emoji.filter(e => {
            let display = false;
            e.short_names.forEach(name => {
              if (name.includes(searchQuery.toLowerCase())) display = true;
            });
            return display;
          });
          list = sortEmoji(filtered);
        } else if (name === Categories?.history?.name) {
          list = history;
        } else {
          list = emojiList[name];
        }
        return list.map(emoji => ({key: emoji.unified, emoji}));
      }
    })();
    return this.props.shouldInclude
      ? emojiData.filter(e => this.props.shouldInclude(e.emoji))
      : emojiData;
  }
  returnRecentIcons() {
    let {history} = this.state;
    console.log('historys', history);
    // console.log('0 condition', history != undefined && history.length != 0);
    if (history != undefined && history.length === 0) {
      history = [
        {
          added_in: '3.0',
          au: null,
          category: 'Smileys & Emotion',
          count: 1,
          docomo: null,
          google: null,
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f923.png',
          name: 'ROLLING ON THE FLOOR LAUGHING',
          non_qualified: null,
          sheet_x: 40,
          sheet_y: 17,
          short_name: 'rolling_on_the_floor_laughing',
          short_names: ['rolling_on_the_floor_laughing'],
          softbank: null,
          sort_order: 7,
          subcategory: 'face-smiling',
          text: null,
          texts: null,
          unified: '1F923',
        },
        {
          added_in: '0.6',
          au: 'EB64',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E72A',
          google: 'FE334',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f602.png',
          name: 'FACE WITH TEARS OF JOY',
          non_qualified: null,
          sheet_x: 32,
          sheet_y: 23,
          short_name: 'joy',
          short_names: ['joy'],
          softbank: 'E412',
          sort_order: 8,
          subcategory: 'face-smiling',
          text: null,
          texts: null,
          unified: '1F602',
        },
        {
          added_in: '0.6',
          au: 'E5C3',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E729',
          google: 'FE347',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f609.png',
          name: 'WINKING FACE',
          non_qualified: null,
          sheet_x: 32,
          sheet_y: 30,
          short_name: 'wink',
          short_names: ['wink'],
          softbank: 'E405',
          sort_order: 12,
          subcategory: 'face-smiling',
          text: ';)',
          texts: [';)', ';-)'],
          unified: '1F609',
        },
        {
          added_in: '14.0',
          au: null,
          category: 'Smileys & Emotion',
          count: 1,
          docomo: null,
          google: null,
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1fae1.png',
          name: 'SALUTING FACE',
          non_qualified: null,
          sheet_x: 55,
          sheet_y: 31,
          short_name: 'saluting_face',
          short_names: ['saluting_face'],
          softbank: null,
          sort_order: 36,
          subcategory: 'face-hand',
          text: null,
          texts: null,
          unified: '1FAE1',
        },
        {
          added_in: '0.6',
          au: 'E595',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E6EC',
          google: 'FEB0C',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '2764-fe0f.png',
          name: 'HEAVY BLACK HEART',
          non_qualified: '2764',
          sheet_x: 56,
          sheet_y: 32,
          short_name: 'heart',
          short_names: ['heart'],
          softbank: 'E022',
          sort_order: 129,
          subcategory: 'emotion',
          text: '<3',
          texts: ['<3'],
          unified: '2764-FE0F',
        },
        {
          added_in: '0.6',
          au: 'EAD3',
          category: 'People & Body',
          count: 1,
          docomo: null,
          google: 'FEB9E',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f44f.png',
          name: 'CLAPPING HANDS SIGN',
          non_qualified: null,
          sheet_x: 13,
          sheet_y: 2,
          short_name: 'clap',
          short_names: ['clap'],
          skin_variations: {
            '1F3FB': [Object],
            '1F3FC': [Object],
            '1F3FD': [Object],
            '1F3FE': [Object],
            '1F3FF': [Object],
          },
          softbank: 'E41F',
          sort_order: 200,
          subcategory: 'hands',
          text: null,
          texts: null,
          unified: '1F44F',
        },
        {
          added_in: '0.6',
          au: 'E471-E5B1',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E722',
          google: 'FE331',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f605.png',
          name: 'SMILING FACE WITH OPEN MOUTH AND COLD SWEAT',
          non_qualified: null,
          sheet_x: 32,
          sheet_y: 26,
          short_name: 'sweat_smile',
          short_names: ['sweat_smile'],
          softbank: null,
          sort_order: 6,
          subcategory: 'face-smiling',
          text: null,
          texts: null,
          unified: '1F605',
        },
        {
          added_in: '0.6',
          au: 'E47B',
          category: 'Travel & Places',
          count: 1,
          docomo: null,
          google: 'FE4F6',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f525.png',
          name: 'FIRE',
          non_qualified: null,
          sheet_x: 30,
          sheet_y: 2,
          short_name: 'fire',
          short_names: ['fire'],
          softbank: 'E11D',
          sort_order: 1035,
          subcategory: 'sky & weather',
          text: null,
          texts: null,
          unified: '1F525',
        },
        {
          added_in: '11.0',
          au: null,
          category: 'Smileys & Emotion',
          count: 1,
          docomo: null,
          google: null,
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f970.png',
          name: 'SMILING FACE WITH SMILING EYES AND THREE HEARTS',
          non_qualified: null,
          sheet_x: 43,
          sheet_y: 60,
          short_name: 'smiling_face_with_3_hearts',
          short_names: ['smiling_face_with_3_hearts'],
          softbank: null,
          sort_order: 15,
          subcategory: 'face-affection',
          text: null,
          texts: null,
          unified: '1F970',
        },
        {
          added_in: '0.6',
          au: 'EACF',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E726',
          google: 'FE32C',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f618.png',
          name: 'FACE THROWING A KISS',
          non_qualified: null,
          sheet_x: 32,
          sheet_y: 45,
          short_name: 'kissing_heart',
          short_names: ['kissing_heart'],
          softbank: 'E418',
          sort_order: 18,
          subcategory: 'face-affection',
          text: null,
          texts: [':*', ':-*'],
          unified: '1F618',
        },
        {
          added_in: '0.6',
          au: 'E4F9',
          category: 'People & Body',
          count: 1,
          docomo: 'E727',
          google: 'FEB97',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f44d.png',
          name: 'THUMBS UP SIGN',
          non_qualified: null,
          sheet_x: 12,
          sheet_y: 51,
          short_name: '+1',
          short_names: ['+1', 'thumbsup'],
          skin_variations: {
            '1F3FB': [Object],
            '1F3FC': [Object],
            '1F3FD': [Object],
            '1F3FE': [Object],
            '1F3FF': [Object],
          },
          softbank: 'E00E',
          sort_order: 194,
          subcategory: 'hand-fingers-closed',
          text: null,
          texts: null,
          unified: '1F44D',
        },
        {
          added_in: '0.6',
          au: 'EAC5',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E72A',
          google: 'FE332',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f606.png',
          name: 'SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES',
          non_qualified: null,
          sheet_x: 30,
          sheet_y: 38,
          short_name: 'laughing',
          short_names: ['laughing', 'satisfied'],
          softbank: null,
          sort_order: 5,
          subcategory: 'face-smiling',
          text: null,
          texts: [':>', ':->'],
          unified: '1F606',
        },
        {
          added_in: '0.6',
          au: 'EB80',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E753',
          google: 'FE333',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f601.png',
          name: 'GRINNING FACE WITH SMILING EYES',
          non_qualified: null,
          sheet_x: 30,
          sheet_y: 33,
          short_name: 'grin',
          short_names: ['grin'],
          softbank: 'E404',
          sort_order: 4,
          subcategory: 'face-smiling',
          text: null,
          texts: null,
          unified: '1F601',
        },
        {
          added_in: '1.0',
          au: null,
          category: 'Smileys & Emotion',
          count: 1,
          docomo: null,
          google: null,
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f600.png',
          name: 'GRINNING FACE',
          non_qualified: null,
          sheet_x: 30,
          sheet_y: 32,
          short_name: 'grinning',
          short_names: ['grinning'],
          softbank: null,
          sort_order: 1,
          subcategory: 'face-smiling',
          text: ':D',
          texts: null,
          unified: '1F600',
        },
        {
          added_in: '0.6',
          au: 'E5C4',
          category: 'Smileys & Emotion',
          count: 1,
          docomo: 'E726',
          google: 'FE327',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '1f60d.png',
          name: 'SMILING FACE WITH HEART-SHAPED EYES',
          non_qualified: null,
          sheet_x: 30,
          sheet_y: 45,
          short_name: 'heart_eyes',
          short_names: ['heart_eyes'],
          softbank: 'E106',
          sort_order: 15,
          subcategory: 'face-affection',
          text: null,
          texts: null,
          unified: '1F60D',
        },
        {
          added_in: '0.6',
          au: 'EAA5',
          category: 'Activities',
          count: 1,
          docomo: 'E68D',
          google: 'FEB1A',
          has_img_apple: true,
          has_img_facebook: true,
          has_img_google: true,
          has_img_twitter: true,
          image: '2665-fe0f.png',
          name: 'BLACK HEART SUIT',
          non_qualified: '2665',
          sheet_x: 54,
          sheet_y: 40,
          short_name: 'hearts',
          short_names: ['hearts'],
          softbank: 'E20C',
          sort_order: 1058,
          subcategory: 'game',
          text: null,
          texts: null,
          unified: '2665-FE0F',
        },
      ];
    } else history = history;
    let emojiData = (function () {
      return history?.map(emoji => ({key: emoji?.unified, emoji}));
    })();
    return this.props.shouldInclude
      ? emojiData.filter(e => this.props.shouldInclude(e.emoji))
      : emojiData;
  }

  prerenderEmojis(callback) {
    let emojiList = {};
    categoryKeys.forEach(c => {
      let name = Categories[c].name;
      emojiList[name] = sortEmoji(emojiByCategory(name));
    });

    this.setState(
      {
        emojiList,
        colSize: Math.floor(this.state.width / this.props.columns),
      },
      callback,
    );
  }

  handleLayout = ({nativeEvent: {layout}}) => {
    this.setState({width: layout.width}, () => {
      this.prerenderEmojis(() => {
        this.setState({isReady: true});
      });
    });
  };

  //
  // LIFECYCLE METHODS
  //
  componentDidMount() {
    const {category, showHistory} = this.props;
    this.setState({category});
    if (showHistory) {
      this.loadHistoryAsync();
    }
  }

  render() {
    const {
      theme,
      columns,
      placeholder,
      showHistory,
      showSearchBar,
      showSectionTitles,
      showTabs,
      ...other
    } = this.props;

    const {category, colSize, isReady, searchQuery} = this.state;

    const Searchbar = (
      <View style={styles.searchbar_container}>
        <BottomSheetTextInput
          style={styles.search}
          placeholder={placeholder}
          clearButtonMode="always"
          returnKeyType="done"
          autoCorrect={false}
          underlineColorAndroid={theme}
          value={searchQuery}
          onChangeText={this.handleSearch}
          placeholderTextColor="rgba(255, 255, 255, 0.60)"
        />
      </View>
    );

    const title = searchQuery !== '' ? 'Search Results' : category.name;
    return (
      <View style={styles.frame} {...other} onLayout={this.handleLayout}>
        <View style={{flex: 1}}>
          {showSearchBar && Searchbar}
          {isReady ? (
            <View style={{flex: 1}}>
              {/* <View>
                <Text style={styles.sectionHeader}>{this.state.history.length == 0 ? "Most frequently used" : "Recently used"}</Text>
                <FlatList
                  data={this.returnRecentIcons()}
                  renderItem={this.renderEmojiCell}
                  keyboardShouldPersistTaps={'always'}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />

              </View> */}
              <View style={styles.container}>
                <FlatList
                  style={styles.scrollview}
                  ListHeaderComponent={
                    <View>
                      <Text style={styles.sectionHeader}>
                        {this.state.history.length === 0
                          ? 'Popular emojis'
                          : 'Recently used'}
                      </Text>
                      <FlatList
                        data={this.returnRecentIcons()}
                        renderItem={this.renderEmojiCell}
                        keyboardShouldPersistTaps={'always'}
                        // horizontal={true}
                        numColumns={8}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                      />
                      {showSectionTitles && (
                        <Text style={styles.sectionHeader}>{title}</Text>
                      )}
                    </View>
                  }
                  contentContainerStyle={{paddingBottom: colSize}}
                  data={this.returnSectionData()}
                  renderItem={this.renderEmojiCell}
                  horizontal={false}
                  numColumns={columns}
                  keyboardShouldPersistTaps={'always'}
                  ref={scrollview => (this.scrollview = scrollview)}
                  removeClippedSubviews
                />
              </View>
            </View>
          ) : (
            <View style={styles.loader} {...other}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.tabBar}>
          {showTabs && (
            <TabBar
              activeCategory={category}
              onPress={this.handleTabSelect}
              theme={theme}
              width={this.state.width}
            />
          )}
        </View>
      </View>
    );
  }
}

EmojiSelector.defaultProps = {
  theme: '#007AFF',
  category: Categories.all,
  showTabs: true,
  showSearchBar: true,
  showHistory: false,
  showSectionTitles: true,
  columns: 6,
  placeholder: 'Search...',
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#000',
    paddingTop: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  scrollview: {
    flex: 1,
  },
  searchbar_container: {
    width: '100%',
    zIndex: 1,
  },
  search: {
    ...Platform.select({
      ios: {
        height: 36,
        paddingLeft: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        color: '#fff',
      },
    }),
    margin: 8,
  },
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionHeader: {
    margin: 8,
    fontSize: 17,
    width: '100%',
    color: '#8F8F8F',
  },
});
