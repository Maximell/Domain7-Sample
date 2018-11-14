// React / React Native Imports
import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
// Library Imports
import { Card, ListItem } from "react-native-elements";
// Custom Imports
import ListItemComponent from "@components/ListItemComponent/ListItemComponent";
import ListItemComponentConnected from "@components/ListItemComponentConnected/ListItemComponentConnected";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const CardComponent = (props) => {
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      disabled={props.onPress ? false : true}
    >
      <Card containerStyle={{padding: 0, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
        {props.componentSwitch ? (
          <ListItemComponentConnected
            activity={props.activity}
            bike={props.bike}
            component={props.component}
            checkBox={props.checkBox ? props.checkBox : null}
            onPress={props.onPress}
            componentSwitch={props.componentSwitch}
          />
        ) : (
          <ListItemComponent
            activity={props.activity}
            bike={props.bike}
            component={props.component}
            checkBox={props.checkBox ? props.checkBox : null}
            onPress={props.onPress}
            componentSwitch={props.componentSwitch}
          />
        )}
      </Card>
    </TouchableWithoutFeedback>
  );
}

export default CardComponent;
