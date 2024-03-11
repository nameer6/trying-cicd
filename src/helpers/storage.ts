import AsyncStorage from '@react-native-async-storage/async-storage';

const setToken = (token: string) => {
  AsyncStorage.setItem('token', token);
};
const getToken = () => {
  return AsyncStorage.getItem('token');
};
const removeToken = () => {
  AsyncStorage.removeItem('token');
};
const clearStorage = () => {
  AsyncStorage.multiRemove(['user', 'token', 'lastTodos', 'lastDocsChat']);
};

export {setToken, getToken, removeToken, clearStorage};
