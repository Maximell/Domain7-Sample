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
import colors from "@config/styles/colors";
import { getBikeFromEquipmentId, getDistanceString, getElevationString, getFormattedDate } from "@config/util/util";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const CardActivity = (props) => {

  const bike = getBikeFromEquipmentId(props.activity.gear_id, props.bikes)

  return (
    <TouchableWithoutFeedback
      onPress={() => props.onPress()}
      disabled={props.onPress ? false : true}
    >
      <Card containerStyle={{padding: 0, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
        <ListItem
          leftAvatar={{
            source: require('@assets/images/strava.png'),
          }}
          title={props.activity.name}
          titleStyle={{color: colors.text}}
          subtitle={bike ? bike.name : "Unknown Bike" + " - " + getFormattedDate(props.activity.start_date)}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          chevron={props.onPress ? true : false}
          chevronColor={colors.text}
          style={{
            padding: 10,
            paddingBottom: 0,
            margin: 0,
            borderRadius: 5
          }}
        />
        {props.activity.map.summary_polyline && (
          <Map
            activityId={props.activity.id}
            polyline={props.activity.map.summary_polyline}
          />
        )}
        <View style={{justifyContent: "center", alignItems: "center", flex: 1, flexDirection: 'row', paddingLeft: 10, paddingBottom: 10, marginTop: 5}}>
          <View style={{
            flex: 0.33
            }}>
            <Text style={{
              color: colors.text,
              fontSize: 8
            }}>Distance</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 4}}>
              <Text style={{
                color: colors.text,
                fontSize: 20,
                marginLeft: 1
              }}>
                {getDistanceString(props.activity.distance, 2)}
              </Text>
            </View>
          </View>
          <View style={{
            flex: 0.33
          }}>
            <Text style={{
              color: colors.text,
              fontSize: 8
            }}>Elevation Gain</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 4}}>
              <Text style={{
                color: colors.text,
                fontSize: 20,
                marginLeft: 1
              }}>
                {getElevationString(props.activity.total_elevation_gain, 0)}
              </Text>
            </View>
          </View>
          <View style={{
            flex: 0.33
          }}>
            <Text style={{
              color: colors.text,
              fontSize: 8
            }}>Moving Time</Text>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 4}}>
              <Text style={{
                color: colors.text,
                fontSize: 20,
                marginLeft: 1
              }}>
                {Math.floor(props.activity.moving_time / 3600) + "h " + Math.round((props.activity.moving_time - (Math.floor(props.activity.moving_time / 3600) * 3600)) / 60) + "m"}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
}

export default CardActivity;
