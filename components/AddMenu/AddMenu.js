// React / React Native Imports
import React from "react";
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from "react-native";
// Library Imports
import IonIcon from  "react-native-vector-icons/Ionicons";
// Custom Imports
import { textColor, textSize } from "@config/styles/text";
import colors from "@config/styles/colors";


// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_HEIGHT = Dimensions.get("window").height;

class AddMenu extends React.Component {

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

    const { navigate } = this.props.navigation;

    return (
      <View style={{position: "absolute", top: 0, left: 0, right: 0, height: 0}}>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: this.state.isOpen ? 0 : -160,
            height: 100,
            backgroundColor: colors.backgroundLight,
            overflow: "hidden",
            borderBottomWidth: 1,
            borderColor: colors.backgroundDark,
            zIndex: 2
          }}
        >
          <View style={{flexDirection: "row", flex: 1}}>
            {[
              {
                title: "Bike",
                icon: (
                  <IonIcon name="ios-bicycle" size={40} color={colors.text}/>
                ),
                action: () => navigate("BikeBuilder", {})
              }, {
                title: "Component",
                icon: (
                  <IonIcon name="ios-build" size={40} color={colors.text}/>
                ),
                action: () => navigate("AddComponent")
              }
              // , {
              //   title: "Work Log",
              //   icon: (
              //     <IonIcon name="ios-copy" size={40} color={colors.text}/>
              //   ),
              //   action: () => alert("Work logs coming soon.")
              // }
            ].map((button, i) => (
              <TouchableOpacity
                onPress={() => {
                  button.action();
                  this.toggle();
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
                key={i}
              >
                {button.icon}
                <Text style={[textColor.text, textSize.sm]}>{button.title}</Text>
              </TouchableOpacity>
            ))}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            />
          </View>
        </View>
        {this.state.isOpen && (
          <TouchableWithoutFeedback
            onPress={() => this.toggle()}
          >
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                height: SCREEN_HEIGHT,
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1
              }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}

export default AddMenu;
