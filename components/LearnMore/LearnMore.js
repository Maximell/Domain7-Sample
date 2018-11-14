// React / React Native Imports
import React from "react";
import {
  LayoutAnimation,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
// Library Imports
import IonIcon from  "react-native-vector-icons/Ionicons";
// Custom Imports
import colors from "@config/styles/colors";


// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);

class LearnMore extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    LayoutAnimation.easeInEaseOut();
  }

  render() {

    const titleText = this.props.titleText ? this.props.titleText : "Learn more";

    return (
      <View
        style={{
          marginVertical: 8,
          marginHorizontal: "5%",
          overflow: "hidden"
        }}
      >
        <TouchableOpacity
          onPress={() => this.toggle()}
        >
          <Text style={{ color: colors.text }}>
            <IonIcon name="ios-information-circle-outline" size={16} color={colors.text}/>
            {" " + titleText}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: colors.text,
            height: this.state.isOpen ? "auto" : 0,
          }}
        >
          {this.props.moreText}
        </Text>
      </View>
    );
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}

export default LearnMore;
