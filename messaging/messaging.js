// React imports
import React from "react";
import { Platform } from "react-native";
// Library Imports
import firebase from "react-native-firebase";
// Custom Imports
import colors from "@config/styles/colors";
import { fireAuth, fireMessaging, fireNotifications } from "@firebase/firebase";


export function handleOnNotification(notification) {
  if (Platform.OS === "android") {
    const localNotification = new firebase.notifications.Notification({
        sound: "default",
        show_in_foreground: true
      })
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .android.setChannelId("BikeWrenchNotificationChannelId")
      .android.setSmallIcon("ic_stat_ic_notification")
      .android.setColor(colors.text)
      .android.setPriority(firebase.notifications.Android.Priority.High);
    firebase.notifications()
      .displayNotification(localNotification)
      .catch(error => console.error("error"));
  } else if (Platform.OS === "ios") {
    const localNotification = new firebase.notifications.Notification()
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .ios.setBadge(notification.ios.badge);

    fireNotifications
      .displayNotification(localNotification)
      .catch(error => console.error(error));
  }
}

export function handleOnNotificationOpen(notificationOpen, navigatorRef) {
  if (notificationOpen) {
    const {
      action,
      notification
    } = notificationOpen;
    const { data } = notification;
    switch (data.type) {
      case "activityCreated":
      case "activityUpdated":
        setTimeout(() => navigatorRef.navigate("Activity", {activityId: data.activityId}), 3000);
        break;
      case "serviceIntervalTrigger":
        setTimeout(() => navigatorRef.navigate("Component", {componentId: data.componentId}), 3000);                
        break;
    }
    fireNotifications.removeDeliveredNotification(notification.notificationId);
  }
}
