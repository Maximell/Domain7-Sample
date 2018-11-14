// React / React Native Imports
import React from "react";
import {
  Dimensions,
  Text,
  View
} from "react-native";
// Library Imports
import ModalDropdown from "react-native-modal-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";
// Custom Imports
import { textColor, textSize } from "@config/styles/text";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Dropdown = (props) => {
  return (
    <ModalDropdown
      style={{
        alignSelf: "center",
        width: props.width ? props.width : SCREEN_WIDTH * 0.7
      }}
      options={props.options}
      onSelect={(index, value) => props.onSelect(index, value)}
      renderRow={props.renderRow ? props.renderRow : (value, index, isSelected) => {
        return (
          <View style={{
            padding: 10,
            width: props.width ? props.width : SCREEN_WIDTH * 0.7,
            backgroundColor: colors.backgroundLight
          }}>
            <Text style={{
              color: colors.iconSelected,
              textAlign: "center"
            }}>
              {value.name}
            </Text>
          </View>
        )
      }}
    >
      <View style={{
          backgroundColor: colors.background,
          borderRadius: 5,
          padding: 20
        }}>
        <Text style={[textSize.md, textColor.normal, {color: colors.iconSelected, position: "absolute", top: 10, left: 10}]}>
          {props.selected}
        </Text>
        <Icon name="caret-down" size={20} color={colors.iconSelected} style={{position: "absolute", top: 10, right: 10}}/>
      </View>
    </ModalDropdown>
  );
}

export default Dropdown;
