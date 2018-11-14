// React / React Native Imports
import React from "react";
import {
  TouchableOpacity,
} from "react-native";
// Library Imports
import EvilIcon from  "react-native-vector-icons/EvilIcons";
// Custom Imports
import colors from "@config/styles/colors";


const AddMenuButton = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()} style={{padding: 10}}>
      <EvilIcon name={"plus"} size={28} style={{ color: colors.accentPrimary }}/>
    </TouchableOpacity>
  );
}

export default AddMenuButton;
