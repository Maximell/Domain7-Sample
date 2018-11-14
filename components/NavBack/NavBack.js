// React / React Native Imports
import React from "react";
import {
  TouchableOpacity
} from "react-native";
// Library Imports
import IonIcon from  "react-native-vector-icons/Ionicons";
// Custom Imports
import colors from "@config/styles/colors";


const NavBack = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ padding: 30, paddingLeft: 15 }}>
      <IonIcon name="ios-arrow-back" size={28} color={colors.accentPrimary}/>
    </TouchableOpacity>
  )
}

export default NavBack;
