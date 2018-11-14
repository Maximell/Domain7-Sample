// React / React Native Imports
import { StyleSheet, Platform, PixelRatio, Dimensions } from "react-native";
// Library Imports
// Custom Imports
import colors from "@config/styles/colors";


export function normalize(pixelSize) {
  const referenceWidth = 420;
  const deviceWidth = Dimensions.get("window").width;
  const modifiedDeviceWidth = deviceWidth > 700 ? deviceWidth-200 : deviceWidth;
  return pixelSize*modifiedDeviceWidth/referenceWidth;
}

export const textSize = StyleSheet.create({
  xxl: {
    fontSize: normalize(36)
  },
  xl: {
    fontSize: normalize(30)
  },
  lg: {
    fontSize: normalize(24)
  },
  md: {
    fontSize: normalize(20)
  },
  sm: {
    fontSize: normalize(16)
  },
  xs: {
    fontSize: normalize(14)
  },
  xxs: {
    fontSize: normalize(12)
  }
});

export const textColor = StyleSheet.create({
  light: {
    color: colors.textLight
  },
  normal: {
    color: colors.text
  },
  dark: {
    color: colors.textDark
  },
  contrast: {
    color: colors.textContrast
  },
  accent: {
    color: colors.accentPrimary
  }
});

export const textStyle = StyleSheet.create({
  bold: {
    fontWeight: "bold"
  },
  italic: {
    fontStyle: "italic"
  },
  underline: {
    textDecorationLine: "underline"
  }
});
