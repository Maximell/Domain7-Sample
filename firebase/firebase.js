// React imports
import React from 'react';
import {
  Platform
} from 'react-native';
// Library Imports
import firebase from "react-native-firebase";
// Custom Imports


// Create firebase
const firebaseApp = firebase.app();

// Get our references
export const fireAuth = firebaseApp.auth();
export const fireStore = firebaseApp.firestore();
export const fireFunc = firebaseApp.functions();
export const fireMessaging = firebaseApp.messaging();
export const fireNotifications = firebaseApp.notifications();
export const fireStorage = firebaseApp.storage();

fireStore.settings({timestampsInSnapshots: true});
