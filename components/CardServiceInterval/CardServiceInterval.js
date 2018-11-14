// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// Library Imports
import { Button, Card, Input, ListItem } from "react-native-elements";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// Custom Imports
import * as ComponentsActions from "@actions/ComponentsActions";
import LearnMore from "@components/LearnMore/LearnMore";
import Map from "@components/Map/Map";
import colors from "@config/styles/colors";
import { textSize, textColor } from "@config/styles/text";
import { getDistanceString, getFormattedDate } from "@config/util/util";
import { fireStore } from "@firebase/firebase";
import RatingTracker from "@ratings/RatingTracker";


class CardServiceInterval extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addingServiceLog: false,
      notes: "",
      loadingServiceLogs: true,
      serviceLogs: []
    }

    this.serviceLogsListener = fireStore
      .collection("users")
      .doc(props.userId)
      .collection("components")
      .doc(props.componentId)
      .collection("serviceIntervals")
      .doc(props.serviceInterval.id)
      .collection("serviceLogs")
      .orderBy("createdAt", "desc")
      .onSnapshot(serviceLogsDocs => {
        result = [];
        serviceLogsDocs.forEach(serviceLog => {
          result.push(serviceLog.data());
        });
        this.setState({
          loadingServiceLogs: false,
          serviceLogs: result
        });
      });
  }

  render() {

    const {
      serviceInterval
    } = this.props;

    const timeProgress = serviceInterval.currentTime / serviceInterval.serviceTime;
    const timeOver = timeProgress > 1 ? true : false;
    const timeOverDouble = timeProgress > 2 ? true : false;
    const distanceProgress = serviceInterval.currentDistance / serviceInterval.serviceDistance;
    const distanceOver = distanceProgress > 1 ? true : false;
    const distanceOverDouble = distanceProgress > 2 ? true : false;

    const {
      loadingServiceLogs,
      serviceLogs
    } = this.state;

    return (
      <Card>
        <ListItem
          title={serviceInterval.name}
          titleStyle={{color: colors.text}}
          style={{
            padding: 0,
            borderRadius: 5
          }}
        />
        {serviceInterval.serviceTime && (
          <View>
            <Progress.Bar
              progress={timeProgress % 1}
              color={timeOver ? "red" : colors.accentPrimary}
              unfilledColor={timeOverDouble ? "red" : timeOver ? colors.accentPrimary : "transparent"}
              borderColor={colors.text}
              height={20}
              width={null}
            />
            <Text style={[textColor.normal]}>{Math.floor(serviceInterval.currentTime/3600)} hr / {Math.floor(serviceInterval.serviceTime/3600)} hr</Text>
          </View>
        )}
        {serviceInterval.serviceDistance && (
          <View>
            <Progress.Bar
              progress={distanceProgress % 1}
              color={distanceOver ? "red" : colors.accentPrimary}
              unfilledColor={distanceOverDouble ? "red" : distanceOver ? colors.accentPrimary : "transparent"}
              borderColor={colors.text}
              height={20}
              width={null}
            />
          <Text style={[textColor.normal]}>{getDistanceString(serviceInterval.currentDistance, 0)} / {getDistanceString(serviceInterval.serviceDistance, 0)}</Text>
          </View>
        )}
        {this.state.addingServiceLog ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                ComponentsActions.addServiceLog(
                  this.props.userId,
                  this.props.componentId,
                  this.props.serviceInterval.id,
                  "reset",
                  this.state.notes
                ).then(() => {
                  this.setState({
                    addingServiceLog: false
                  });
                  RatingTracker.handlePositiveEvent();
                });
              }}
            >
              <ListItem
                leftIcon={{
                  name: "ios-checkmark-circle-outline",
                  type: "ionicon",
                  size: 30,
                  color: colors.text
                }}
                title={"Save"}
                titleStyle={{color: colors.text}}
                containerStyle={{
                  padding: 0,
                  paddingTop: 10
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({
                addingServiceLog: false,
                notes: ""
              })}
            >
              <ListItem
                leftIcon={{
                  name: "ios-close-circle-outline",
                  type: "ionicon",
                  size: 30,
                  color: colors.text
                }}
                title={"Cancel"}
                titleStyle={{color: colors.text}}
                containerStyle={{
                  padding: 0,
                  paddingTop: 5
                }}
              />
            </TouchableOpacity>
            <Input
              value={this.state.notes}
              keyboardAppearance="light"
              autoFocus={false}
              autoCorrect={true}
              returnKeyType="done"
              inputStyle={{marginLeft: 10}}
              placeholder={"Notes"}
              containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
              onChangeText={notes => this.setState({ notes })}
            />
          </View>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => this.setState({
                addingServiceLog: true
              })}
            >
              <ListItem
                leftIcon={{
                  name: "ios-add-circle-outline",
                  type: "ionicon",
                  size: 30,
                  color: colors.text
                }}
                title={"Add Service Log"}
                titleStyle={{color: colors.text}}
                containerStyle={{
                  padding: 0,
                  paddingTop: 10
                }}
              />
            </TouchableOpacity>
            <LearnMore
              moreText={"Add a service log to reset this Service Interval's distance and time."}
            />
          </View>
        )}
        {loadingServiceLogs ? (
          <ActivityIndicator/>
        ) : serviceLogs.length ? serviceLogs.map((serviceLog, i) => (
          <ListItem
            key={i}
            title={serviceLog.notes != "" ? serviceLog.notes : null}
            titleStyle={{color: colors.text}}
            subtitle={getFormattedDate(serviceLog.createdAt)}
            subtitleStyle={{color: colors.text}}
            containerStyle={{
              padding: 5
            }}
          />
        )) : (
          <ListItem
            title={"No service logs yet."}
            titleStyle={{color: colors.text}}
            style={{
              padding: 0,
              borderRadius: 5
            }}
          />
        )}
      </Card>
    )
  }
}

function mapStoreToProps(store) {
  return {
    componentsError: store.components.error,
    componentsLoading: store.components.loading
  }
}

export default connect(mapStoreToProps)(CardServiceInterval);
