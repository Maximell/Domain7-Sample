// React / React Native Imports
import React from "react";
import {
  Dimensions,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from "react-native";
// Library Imports
import { Card, ListItem } from "react-native-elements";
import EvilIcon from "react-native-vector-icons/EvilIcons";
// Custom Imports
import CardComponent from "@components/CardComponent/CardComponent";
import ComponentAdder from "@components/ComponentAdder/ComponentAdder";
import { componentTypes } from "@config/components/components";
import colors from "@config/styles/colors";
import { textColor, textSize } from "@config/styles/text";


// Enable LayoutAnimation on Android
// UIManager.setLayoutAnimationEnabledExperimental
//   && UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;


class ComponentAdderPopup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillUpdate(nextProps, nextState) {
    // LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          height: this.props.addingComponent ? SCREEN_HEIGHT - 63 : 0,
          // overflow: "hidden",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.backgroundLight
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.cancel()}
          style={{ position: "absolute", top: 10, right: 5, zIndex: 2 }}
        >
          <EvilIcon name={"close"} size={28} style={{color: colors.text}}/>
        </TouchableOpacity>
        <ComponentAdder
          success={() => this.props.success()}
          cancel={() => this.props.cancel()}
          category={this.props.addingComponentCategories}
        />
      </View>
    );
  }

}

export default ComponentAdderPopup;
