// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import { Button, Card, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
// Custom Imports
import Map from "@components/Map/Map";
import { getFormattedDate, getDistanceString } from "@config/util/util";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const CardBike = (props) => {
  const bike = props.bike;
  const icon = bike.type === "Mountain"
    ? require("@assets/images/mountain-bike.png")
    : require("@assets/images/road-bike.png");
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
    >
      <Card containerStyle={{padding: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
        <ListItem
          leftAvatar={{
            source: icon,
          }}
          title={bike.name}
          titleStyle={{color: colors.text}}
          subtitle={bike.year + " " + bike.brand + " " + bike.model}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          chevron={props.onPress ? true : false}
          chevronColor={colors.text}
          style={{
            padding: 0,
            borderRadius: 5,
          }}
        />
        <View style={{justifyContent: "center", alignItems: "center", flex: 1, flexDirection: "row", paddingLeft: 10, paddingBottom: 10}}>
          <View style={{
            flex: 0.33
            }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 8
              }}
            >
              Time
            </Text>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 4}}>
              <Icon color={colors.text} name={"clock-o"} size={20} style={{padding: 2}}/>
              <Text style={{
                color: colors.text,
                fontSize: 20,
                marginHorizontal: 4
              }}>
                {Math.floor(bike.time / 3600) + "hr"}
              </Text>
            </View>
          </View>
          <View style={{
            flex: 0.33
          }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 8
              }}
            >
              Distance
            </Text>
            <View style={{flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 4}}>
              <Icon color={colors.text} name={"map-signs"} size={20} style={{padding: 2}}/>
              <Text style={{
                color: colors.text,
                fontSize: 20,
                marginHorizontal: 4
              }}>
                {getDistanceString(bike.distance, 0)}
              </Text>
            </View>
          </View>
          <View style={{
            flex: 0.33
          }}>            
          </View>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
}

export default CardBike;
