// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
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
import { Button, Card, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// Custom Imports
import * as ComponentsActions from "@actions/ComponentsActions";
import Dropdown from "@components/Dropdown/Dropdown";
import LearnMore from "@components/LearnMore/LearnMore";
import colors from "@config/styles/colors";
import { getDistanceUnitsString } from "@config/util/util"


// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const INTERVAL_TYPES = [
  "Distance Only",
  "Time Only",
  "Distance + Time"
];

class ServiceIntervalAdder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      intervalType: "",
      serviceDistance: "",
      serviceTime: "",
      isNameValid: true,
      isIntervalTypeValid: true,
      isServiceDistanceValid: true,
      isServiceTimeValid: true
    }
  }

  componentWillUpdate(nextProps, nextState) {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={{padding: 0}}>
        <ListItem
          leftIcon={{
            name: "ios-add-circle-outline",
            type: "ionicon",
            size: 40,
            color: colors.text
          }}
          title={"Add Service Interval"}
          titleStyle={{color: colors.text}}
          subtitle={(
            <LearnMore
              titleText={"What's this?"}
              moreText={"Add service intervals for maintenance tracking and reminders."}
            />
          )}
          subtitleStyle={{color: colors.text}}
          style={{
            padding: 0,
            margin: 0
          }}
        />
        <Input
          value={this.state.name}
          keyboardAppearance="light"
          autoFocus={false}
          autoCorrect={false}
          returnKeyType="next"
          inputStyle={{marginLeft: 10}}
          placeholder={"Description"}
          containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", alignSelf: "center", paddingBottom: 15}}
          onChangeText={name => this.setState({name})}
          errorMessage={this.state.isNameValid ? null : (
            <Text style={{color: colors.accentPrimary}}>{"Please enter a name"}</Text>
          )}
        />
        <Dropdown
          style={{
            alignSelf: "center",
            width: SCREEN_WIDTH * 0.7
          }}
          options={[
            { name: INTERVAL_TYPES[0] },
            { name: INTERVAL_TYPES[1] },
            { name: INTERVAL_TYPES[2] }
          ]}
          onSelect={(index, value) => {
            this.setState({ intervalType: value.name });
          }}
          selected={this.state.intervalType ? this.state.intervalType : "Interval Type"}
        />
        {[INTERVAL_TYPES[0], INTERVAL_TYPES[2]].includes(this.state.intervalType) && (
          <Input
            value={this.state.serviceDistance}
            keyboardAppearance={"light"}
            keyBoardType={"numeric"}
            autoFocus={false}
            autoCorrect={false}
            returnKeyType="next"
            inputStyle={{marginLeft: 10}}
            placeholder={"Distance to Service (" + getDistanceUnitsString() + ")"}
            containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", alignSelf: "center", paddingTop: 15}}
            onChangeText={serviceDistance => this.setState({serviceDistance: this.cleanNumberInput(serviceDistance)})}
            errorMessage={this.state.isServiceDistanceValid ? null : (
              <Text style={{color: colors.accentPrimary}}>{"Please enter a value for either Distance or Time"}</Text>
            )}
          />
        )}
        {[INTERVAL_TYPES[1], INTERVAL_TYPES[2]].includes(this.state.intervalType) && (
          <Input
            value={this.state.serviceTime}
            keyboardAppearance={"light"}
            keyBoardType={"numeric"}
            autoFocus={false}
            autoCorrect={false}
            returnKeyType="next"
            inputStyle={{marginLeft: 10}}
            placeholder={"Time to Service (hours)"}
            containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", alignSelf: "center", paddingTop: 15}}
            onChangeText={serviceTime => this.setState({ serviceTime: this.cleanNumberInput(serviceTime)})}
            errorMessage={this.state.isServiceTimeValid ? null : (
              <Text style={{color: colors.accentPrimary}}>{"Please enter a value for either Distance or Time"}</Text>
            )}
          />
        )}
        <Button
          buttonStyle={{
            backgroundColor: colors.accentPrimary,
            borderRadius: 2,
            height: 25,
            width: 200
          }}
          containerStyle={{marginTop: 16}}
          activeOpacity={0.8}
          title={"Save"}
          titleStyle={{
            fontSize: 16,
            color: "white",
            fontWeight: "bold"
          }}
          onPress={() => {

            const serviceDistance = [INTERVAL_TYPES[0], INTERVAL_TYPES[2]].includes(this.state.intervalType) ? parseInt(this.state.serviceDistance) * (getDistanceUnitsString() === "km" ? 1000 : 1609.34) : null

            ComponentsActions.addComponentServiceInterval(
              this.props.component,
              this.state.name,
              serviceDistance,
              [INTERVAL_TYPES[1], INTERVAL_TYPES[2]].includes(this.state.intervalType) ? parseInt(this.state.serviceTime)*3600 : null,
              () => this.props.success())
            }}
          loading={this.props.componentsLoading}
          disabled={this.props.componentsLoading ||
            (this.state.name === "") ||
            (this.state.intervalType === "") ||
            (this.state.intervalType === INTERVAL_TYPES[0] && this.state.serviceDistance === "") ||
            (this.state.intervalType === INTERVAL_TYPES[1] && this.state.serviceTime === "") ||
            (this.state.intervalType === INTERVAL_TYPES[2] && (this.state.serviceTime === "" || this.state.serviceDistance === ""))}
        />
        <Button
          buttonStyle={{
            backgroundColor: colors.accentSecondary,
            borderRadius: 2,
            height: 25,
            width: 100
          }}
          containerStyle={{marginTop: 16}}
          activeOpacity={0.8}
          title={"Cancel"}
          titleStyle={{
            fontSize: 16,
            color: "white",
            fontWeight: "bold"
          }}
          onPress={() => this.props.cancel()}
          disabled={this.props.componentsLoading}
        />
      </View>
    );
  }

  cleanNumberInput(number) {
    return number.replace(/[^0-9]/g, '')
  }
}

function mapStoreToProps(store) {
  return {
    componentsLoading: store.components.loading,
  }
}

export default connect(mapStoreToProps)(ServiceIntervalAdder);
