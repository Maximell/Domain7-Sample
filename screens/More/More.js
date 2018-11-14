// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
// Library Imports
import {
  Card,
  ListItem
} from "react-native-elements";
import Communications from "react-native-communications";
import { connect } from "react-redux";
// Custom Imports
import * as UserActions from "@actions/UserActions";
import Dropdown from "@components/Dropdown/Dropdown";
import Loading from "@components/Loading/Loading";
import colors from "@config/styles/colors";
import RatingTracker from "@ratings/RatingTracker";


const SCREEN_WIDTH = Dimensions.get("window").width;

class More extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "white",
    },
    headerTitleStyle: {
      color: colors.text,
      fontWeight: "400",
    },
  });

  componentWillUpdate(nextProps, nextState) {
    LayoutAnimation.easeInEaseOut();
  }

  render() {

    if (!this.props.userData) {
      return (
        <Loading/>
      )
    }

    const { navigate } = this.props.navigation;

    return (
      <ScrollView navigation={this.props.navigation}>
        <Card containerStyle={{
          padding: 0,
          marginHorizontal: 0,
          marginTop: 12
        }}>
          <ListItem
            switch={this.props.userLoading ? null : {
              onValueChange: allowNotifications => UserActions.updatePushNotificationPermissions(allowNotifications, this.props.userData.settings.pushNotifications.permissionMaintenance, this.props.userData.settings.pushNotifications.permissionActivities),
              value: this.props.userData.settings.pushNotifications.permission
            }}
            rightElement={this.props.userLoading ? (
              <ActivityIndicator/>
            ) : null}
            hideChevron
            title="Allow Notifications"
            titleStyle={{color: colors.text}}
            style={{
                padding: 0,
                borderRadius: 5,
            }}
          />
          {this.props.userData.settings.pushNotifications.permission && (
            <ListItem
              switch={this.props.userLoading ? null : {
                onValueChange: allowMaintenanceNotifications => UserActions.updatePushNotificationPermissions(this.props.userData.settings.pushNotifications.permission, allowMaintenanceNotifications, this.props.userData.settings.pushNotifications.permissionActivities),
                value: this.props.userData.settings.pushNotifications.permissionMaintenance
              }}
              rightElement={this.props.userLoading ? (
                <ActivityIndicator/>
              ) : null}
              hideChevron
              title={"\t Maintenance"}
              titleStyle={{color: colors.text}}
              style={{
                padding: 0,
                borderRadius: 5,
              }}
            />
          )}
          {this.props.userData.settings.pushNotifications.permission && (
            <ListItem
              switch={this.props.userLoading ? null : {
                onValueChange: allowActivitiesNotifications => UserActions.updatePushNotificationPermissions(this.props.userData.settings.pushNotifications.permission, this.props.userData.settings.pushNotifications.permissionMaintenance, allowActivitiesNotifications),
                value: this.props.userData.settings.pushNotifications.permissionActivities
              }}
              rightElement={this.props.userLoading ? (
                <ActivityIndicator/>
              ) : null}
              hideChevron
              title={"\t Activity Upload"}
              titleStyle={{color: colors.text}}
              style={{
                  padding: 0,
                  borderRadius: 5,
              }}
            />
          )}
        </Card>
        <Card containerStyle={{
          padding: 0,
          marginHorizontal: 0,
        }}>
          <ListItem
            rightElement={this.props.userLoading ? (
              <ActivityIndicator/>
            ) : (
              <Dropdown
                options={[
                  { "name": "Metric (km)" },
                  { "name": "Imperial (mi)" }
                ]}
                onSelect={(index, value) => UserActions.updateUnitOfMeasurement(value.name)}
                selected={this.props.userData.settings.unitOfMeasurement ? this.props.userData.settings.unitOfMeasurement : "Metric (km)"}
                width={Dimensions.get("window").width * 0.4}
              />
            )}
            hideChevron
            title={"Unit of Measurement"}
            titleStyle={{color: colors.text}}
            style={{
                padding: 0,
                borderRadius: 5,
            }}
          />
        </Card>
        <Card containerStyle={{
          padding: 0,
          marginHorizontal: 0,
        }}>
          <ListItem
            chevron
            chevronColor={colors.text}
            leftAvatar={{
              source: require("@assets/images/strava.png"),
              size: "small",
            }}
            onPress = {() => navigate("ConnectStrava")}
            title={"Connect to Strava"}
            titleStyle={{color: colors.text}}
            style={{
                padding: 0,
                borderRadius: 5,
            }}
          />
        </Card>
        <Card containerStyle={{
            padding: 10,
            marginHorizontal: 0,
            marginTop: 12,
            marginBottom: 12
        }}>
            <ListItem
                title={"Introduction"}
                titleStyle={{color: colors.text}}
                chevron
                chevronColor={colors.text}
                onPress = {() => navigate("OnBoard")}
                style={{
                    padding: 0,
                    borderRadius: 5,
                }}
            />
            <ListItem
                title={"Rate BikeWrench"}
                titleStyle={{color: colors.text}}
                chevron
                chevronColor={colors.text}
                onPress = {() => {
                  RatingTracker.showRatingDialog();
                }}
                style={{
                    padding: 0,
                    borderRadius: 5,
                }}
            />
            <ListItem
                title={"Support"}
                titleStyle={{color: colors.text}}
                chevron
                chevronColor={colors.text}
                onPress = {() => Communications.web("https://getbikewrench.com/#footer-4")}
                style={{
                    padding: 0,
                    borderRadius: 5,
                }}
            />            
            <ListItem
                title={"Privacy policy"}
                titleStyle={{color: colors.text}}
                chevron
                chevronColor={colors.text}
                onPress = {() => Communications.web("https://getbikewrench.com/privacy-policy.html")}
                style={{
                    padding: 0,
                    borderRadius: 5,
                }}
            />
        </Card>
        <TouchableOpacity onPress={() => UserActions.signOut()}>
          <Card
            containerStyle={{
              padding: 12,
              marginHorizontal: 0,
              marginTop: 0,
              marginBottom: 12
            }}
            style={{textAlign: 'center'}}
          >
            {this.props.userLoading ? (
              <ActivityIndicator/>
            ) : (
              <Text style={{ textAlign: 'center', color: colors.accentPrimary, fontSize: 17 }}>
                Log out
              </Text>
            )}
          </Card>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

function mapStoreToProps(store) {
  return {
    userData: store.user.data,
    userLoading: store.user.loading
  }
}

export default connect(mapStoreToProps)(More);
