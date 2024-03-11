/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors} from 'src/common/colors';
import CustomStausbar from 'src/components/CustomStausbar';

import {Provider} from 'react-redux';
import {store} from 'src/store/store';
import AppNavigation from 'src/navigation/AppNavigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import InfoToast from 'src/components/InfoToast';
import CustomToast from 'src/components/CustomToast';

const App = () => {
  const queryClient = new QueryClient();
  // useEffect(() => {
  //   try {
  //     OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  //     // OneSignal Initialization
  //     OneSignal.initialize('f8741ba6-7df0-4ab3-83a0-66fa0f2a8c75');
  //     OneSignal.Notifications.requestPermission(true);
  //   } catch (err) {
  //     alert(JSON.stringify(err));
  //   }
  // }, []);

  const toastConfig = {
    infoToast: ({props}: any) => (
      <InfoToast title={props.title} description={props.description} />
    ),
    successToast: ({props}: any) => (
      <CustomToast title={props.title} type="successToast" />
    ),
    errorToast: ({props}: any) => (
      <CustomToast title={props.title} type="error" />
    ),
    // SuccessToast
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CustomStausbar color={colors.bgColor} />
          {/* <BottomSheetModalProvider> */}
          <AppNavigation />
          {/* </BottomSheetModalProvider> */}
        </Provider>
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
