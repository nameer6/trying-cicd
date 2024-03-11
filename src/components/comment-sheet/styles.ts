import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  sheetWrapperStyle: {
    backgroundColor: '#rgba(0, 0, 0, 0.40)',
    flex: 1,
  },
  sheetContainerStyle: {
    borderRadius: 24,
    backgroundColor: '#26282F',
    paddingBottom: 0,
  },
  draggableIconStyle: {
    backgroundColor: '#686868',
  },
  commentBoxStyle: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
  flatListStyle: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  flatListScrollStyle: {
    justifyContent: 'flex-end',
  },
  loader: {
    marginTop: 20,
  },
  commentCountText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  noDataView: {
    marginTop: 0,
  },
});
