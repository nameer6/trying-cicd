import {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {getStatusBarHeight} from 'src/helpers/statusbar-height';

const CustomStausbar = ({color = '#fff'}: {color?: string}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    const height = getStatusBarHeight(false);
    setStatusBarHeight(height);
  }, []);

  return (
    <View style={{height: statusBarHeight, backgroundColor: color}}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
    </View>
  );
};

export default CustomStausbar;
