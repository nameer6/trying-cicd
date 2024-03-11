import {FlatList} from 'react-native';

export const VirtualizedList = ({children, flatlistProps}: any) => {
  return (
    <FlatList
      data={[]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      keyExtractor={() => 'key'}
      renderItem={null}
      ListHeaderComponent={<>{children}</>}
      {...flatlistProps}
    />
  );
};

export default VirtualizedList;
