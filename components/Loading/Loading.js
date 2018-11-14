// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  View
} from "react-native";
// Library Imports
// Custom Imports
import colors from "@config/styles/colors";


const Loading = (props) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size={"large"} color={colors.text}/>
    </View>
  );
}

export default Loading;
