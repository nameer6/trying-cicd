import {colors} from 'src/common/colors';
export const NoDataStyle = {
  marginBottom: 16,
  shadowOffset: {
    width: -5,
    height: -14,
  },
  shadowOpacity: 1,
  shadowRadius: 16.0,
  shadowColor: 'rgba(76, 217, 100, 1)',
};

export const sheetIndicatorStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
};

export const transparentSheetIndicatorStyle = {
  backgroundColor: 'transparent',
  height: 0,
};

export const sheetContainerStyle = {
  backgroundColor: colors.sheetBgColor,
  borderRadius: 30,
};

export const transparentSheetStyle = {
  backgroundColor: 'transparent',
  borderRadius: 30,
};

export const sheetShadowStyle = {
  borderRadius: 30,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.88,
  shadowRadius: 14.0,
  elevation: 24,
};
