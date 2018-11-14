// React imports
import React from "react";
import { Platform } from "react-native";
// Library Imports
import { Provider } from "react-redux";
import firebase from "react-native-firebase";
// Custom Imports
import { fireAuth, fireMessaging, fireNotifications } from "@firebase/firebase";
import * as BikesActions from "@actions/BikesActions";
import * as ActivitiesActions from "@actions/ActivitiesActions";
import * as ComponentsActions from "@actions/ComponentsActions";
import * as EquipmentActions from "@actions/EquipmentActions";
import * as UserActions from "@actions/UserActions";
import colors from "@config/styles/colors";
import { handleOnNotification, handleOnNotificationOpen } from "@messaging/messaging";
import store from "@stores/Store";
import Navigator from "@navigator/Navigator";


class App extends React.Component {

  componentWillMount() {

    fireAuth.onAuthStateChanged((user) => {
      store.dispatch(UserActions.setUserSession(user))
      store.dispatch(UserActions.setUserData(user ? user.uid : null));
      store.dispatch(BikesActions.setBikesListener(user ? user.uid : null));
      store.dispatch(ActivitiesActions.setActivitiesListener(user ? user.uid : null));
      store.dispatch(ComponentsActions.setComponentsListener(user ? user.uid : null));
      store.dispatch(EquipmentActions.setEquipmentListener(user ? user.uid : null));

      if (user) {
        fireMessaging.getToken()
          .then(fcmToken => {
            if (fcmToken) {
              UserActions.updatePushNotificationToken(fcmToken);
            }
          }).catch(error => console.warn(error));
        fireMessaging.onTokenRefresh(function() {
          fireMessaging.getToken()
            .then(function(refreshedToken) {
              console.warn("Token refreshed.");
              UserActions.updatePushNotificationToken(refreshedToken);
            })
            .catch(function(err) {
              console.warn("Unable to retrieve refreshed token ", err);
            })
        });
        fireMessaging.hasPermission()
          .then(enabled => {
            if (!enabled) {
              fireMessaging.requestPermission()
                .then(() => {
                  UserActions.updatePushNotificationPermissions(true, true, true);
                })
                .catch(error => {
                  UserActions.updatePushNotificationPermissions(false, true, true);
                });
            }
          }).catch(error => console.warn(error));
      }
    });
  }

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "BikeWrenchNotificationChannelId",
      "BikeWrenchNotificationChannelId",
      firebase.notifications.Android.Importance.Max
    ).setDescription("Notification channel for BikeWrench.");
    firebase.notifications().android.createChannel(channel);
    // app in foreground notification received
    this.notificationListener = fireNotifications.onNotification(notification => handleOnNotification(notification));
    // app closed notification opened
    const notificationOpen = firebase.notifications().getInitialNotification().then(notificationOpen => handleOnNotificationOpen(notificationOpen, this.refs.navigator));
    // foreground or background notification opened
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => handleOnNotificationOpen(notificationOpen, this.refs.navigator));
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator ref={"navigator"}/>
      </Provider>
    )
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
}

export default App;
