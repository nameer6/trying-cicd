module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          components: './src/components',
          consts: './src/consts',
          modules: './src/modules',
          helpers: './src/helpers',
          common: './src/common',
          src: './src',
          // '@react-native-community/masked-view':
          //   '@react-native-masked-view/masked-view',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
