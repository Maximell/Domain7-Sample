// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import update from 'immutability-helper';
import { Card, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// Custom Imports
import { componentTypes, componentMaintenanceSuggestions } from "@config/components/components";
import colors from "@config/styles/colors";
import { getDistanceString } from "@config/util/util"


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class ComponentAdderSuggestedMaintenance extends React.Component {

  constructor(props) {
    super(props);

    maintenanceSuggestions = this.getMaintenanceSuggestions(props.category, props.type)

    this.state = {
      selected: Array(maintenanceSuggestions.length).fill(false),
      maintenanceSuggestions: maintenanceSuggestions
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.category !== nextProps.category || this.props.type !== nextProps.type) {
      maintenanceSuggestions = this.getMaintenanceSuggestions(nextProps.category, nextProps.type)
      this.setState({
        selected: Array(maintenanceSuggestions.length).fill(false),
        maintenanceSuggestions
      });
    }
  }

  render() {

    return (
      <View>
        {this.state.maintenanceSuggestions.length !== 0 && (
          <ListItem
            title={"Suggested Maintenance"}
            titleStyle={{color: colors.text}}
            subtitle={null}
            subtitleStyle={{fontSize: 13, color: "grey"}}
            chevron={false}
            chevronColor={colors.text}
            style={{
              padding: 0,
              borderRadius: 5,
            }}
          />
        )}
        {this.state.maintenanceSuggestions.map((maintenanceSuggestion, i) => (
          <Card key={i} containerStyle={{padding: 0, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
            <ListItem
              checkBox={{
                checked: this.state.selected[i],
                checkedColor: colors.accentPrimary,
                uncheckedColor: colors.accentPrimary,
                onPress: () => this.setState({ selected: update(this.state.selected, {[i]: {$set: !this.state.selected[i]}})})
              }}
              leftIcon={{
                name: "plus",
                type: "evilicon",
                size: 40,
                color: colors.text
              }}
              title={maintenanceSuggestion.name}
              titleStyle={{color: colors.text}}
              subtitle={this.getMaintenanceSuggestionDistanceTimeString(maintenanceSuggestion.serviceDistance, maintenanceSuggestion.serviceTime)}
              subtitleStyle={{fontSize: 13, color: "grey"}}
              chevron={false}
              chevronColor={colors.text}
              style={{
                padding: 0,
                borderRadius: 5,
              }}
            />
          </Card>
        ))}
      </View>
    );
  }

  getMaintenanceSuggestionDistanceTimeString(serviceDistance, serviceTime) {

    if (serviceDistance && serviceTime) {
      return getDistanceString(serviceDistance, 0) + " / " + serviceTime / 3600 + "hr";
    } else if (serviceDistance) {
      return getDistanceString(serviceDistance, 0);
    } else if (serviceTime) {
      return serviceTime / 3600 + "hr";
    }
  }

  getMaintenanceSuggestions(category, type) {
    selectedCategory = componentMaintenanceSuggestions[category];
    typeSuggestions = [];
    if (selectedCategory && type) {
      typeSuggestions = selectedCategory[type];
    }
    return typeSuggestions;
  }

  getSelectedMaintenanceSuggestions() {
    return this.state.maintenanceSuggestions.filter((maintenanceSuggestion, i) => this.state.selected[i]);
  }
}

export default ComponentAdderSuggestedMaintenance;
