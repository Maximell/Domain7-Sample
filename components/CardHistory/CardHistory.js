// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import { Button, Card, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
// Custom Imports
import colors from "@config/styles/colors";
import { getPercent } from "@config/util/util";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const CardHistory = (props) => {

  const history = props.history;
  const { navigate } = props.navigation;

  switch (history.type) {
    case "bikeCreated":
      return (
        <TouchableWithoutFeedback
          onPress={() => navigate("Bike", {bikeId: history.bike.id})}
          disabled={!props.bikesMap[history.bike.id]}
        >
          <Card containerStyle={styles.card}>
            <ListItem
              leftIcon={{
                name: "plus",
                type: "evilicon",
                size: 40,
                color: colors.text
              }}
              title={history.bike.name + " Added"}
              titleStyle={styles.listTitle}
              subtitle={history.bike.year + " " + history.bike.brand + " " + history.bike.model}
              subtitleStyle={styles.listSubtitle}
              chevron={props.bikesMap[history.bike.id] ? true : false}
              chevronColor={colors.text}
              style={styles.list}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
      break;
    case "componentCreated":
      return (
        <TouchableWithoutFeedback
          onPress={() => navigate("Component", {componentId: history.component.id})}
          disabled={!props.componentsMap[history.component.id]}
        >
          <Card containerStyle={styles.card}>
            <ListItem
              leftIcon={{
                name: "plus",
                type: "evilicon",
                size: 40,
                color: colors.text
              }}
              title={history.component.name + " Added"}
              titleStyle={styles.listTitle}
              subtitle={history.component.category + " - " + history.component.type}
              subtitleStyle={styles.listSubtitle}
              chevron={props.componentsMap[history.component.id] ? true : false}
              chevronColor={colors.text}
              style={styles.list}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
      break;
    case "componentInstalled":
      return (
        <TouchableWithoutFeedback
          onPress={() => navigate("Bike", {bikeId: history.bike.id})}
          disabled={!props.bikesMap[history.bike.id]}
        >
          <Card containerStyle={styles.card}>
            <ListItem
              leftIcon={{
                name: "ios-build",
                type: "ionicon",
                size: 40,
                color: colors.text
              }}
              title={history.component.name + " installed on " + history.bike.name}
              titleStyle={styles.listTitle}
              subtitle={history.component.category + " - " + history.component.type}
              subtitleStyle={styles.listSubtitle}
              chevron={props.bikesMap[history.bike.id] ? true : false}
              chevronColor={colors.text}
              style={styles.list}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
      break;
    case "componentUninstalled":
      return (
        <TouchableWithoutFeedback
          onPress={() => navigate("Bike", {bikeId: history.bike.id})}
          disabled={!props.bikesMap[history.bike.id]}
        >
          <Card containerStyle={styles.card}>
            <ListItem
              leftIcon={{
                name: "ios-build",
                type: "ionicon",
                size: 40,
                color: colors.text
              }}
              title={history.component.name + " uninstalled from " + history.bike.name}
              titleStyle={styles.listTitle}
              subtitle={history.component.category + " - " + history.component.type}
              subtitleStyle={styles.listSubtitle}
              chevron={props.bikesMap[history.bike.id] ? true : false}
              chevronColor={colors.text}
              style={styles.list}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
      break;
    case "serviceIntervalTrigger":

      const component = props.componentsMap[history.componentId];

      subtitle = "";
      if (history.timeTrigger && history.distanceTrigger) {
        subtitle = getPercent(history.serviceInterval.currentDistance, history.serviceInterval.serviceDistance, 0) + "% Distance - " + getPercent(history.serviceInterval.currentTime, history.serviceInterval.serviceTime, 0) + "% Time";
      } else if (history.timeTrigger) {
        subtitle = getPercent(history.serviceInterval.currentTime, history.serviceInterval.serviceTime, 0) + "% Time";
      } else if (history.distanceTrigger) {
        subtitle = getPercent(history.serviceInterval.currentDistance, history.serviceInterval.serviceDistance, 0) + "% Distance";
      }

      return (
        <TouchableWithoutFeedback
          onPress={() => navigate("Component", {componentId: history.componentId})}
          disabled={component ? false : true}
        >
          <Card containerStyle={styles.card}>
            <ListItem
              leftIcon={{
                name: "exclamation",
                type: "evilicon",
                size: 40,
                color: colors.text
              }}
              title={component ? component.name : "Component" + ": " + history.serviceInterval.name}
              titleStyle={styles.listTitle}
              subtitle={subtitle}
              subtitleStyle={styles.listSubtitle}
              chevron={component ? true : false}
              chevronColor={colors.text}
              style={styles.list}
            />
          </Card>
        </TouchableWithoutFeedback>
      );
      break;
    default:
      return null;
      break;
  }

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <Card containerStyle={{padding: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
        <ListItem
          leftAvatar={{
            source: require('@assets/images/strava.png'),
          }}
          title={titleText}
          titleStyle={styles.listTitle}
          subtitle={"props.activity.gear_id"}
          subtitleStyle={styles.listSubtitle}
          chevron
          chevronColor={colors.text}
          style={styles.list}
        />
      </Card>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 4
  },
  list: {
    padding: 0,
    borderRadius: 5,
  },
  listTitle: {
    color: colors.text
  },
  listSubtitle: {
    fontSize: 13,
    color: "grey"
  }
})

export default CardHistory;
