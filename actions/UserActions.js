// React / React Native
// Library
// Custom
import * as ActivitiesActions from '@actions/ActivitiesActions';
import * as EquipmentActions from '@actions/EquipmentActions';
import { decodeFirebaseAuthError } from "@config/util/util";
import {
  fireAuth,
  fireStore,
  fireFunc
} from "@firebase/firebase";
import store from "@stores/Store";


export function clearError() {
  store.dispatch({
    type: "CLEAR_ERROR"
  });
}

export function updateUnitOfMeasurement(unitOfMeasurement) {
  fireStore
    .collection("users")
    .doc(fireAuth.currentUser.uid)
    .update({ "settings.unitOfMeasurement": unitOfMeasurement })
    .then(() => {
      store.dispatch({
        type: "UPDATE_UNIT_OF_MEASUREMENT_SUCCESS"
      });
    }).catch(error => {
      store.dispatch({
        type: "UPDATE_UNIT_OF_MEASUREMENT_ERROR"
      });
    });
  store.dispatch({
    type: "UPDATE_UNIT_OF_MEASUREMENT"
  });
}

export function updateMilestoneOnBoard(onBoardCompleted) {
  fireStore
    .collection("users")
    .doc(fireAuth.currentUser.uid)
    .update({ "milestones.onBoard": onBoardCompleted })
    .then(() => {
      store.dispatch({
        type: "UPDATE_MILESTONE_ONBOARD_SUCCESS"
      });
    })
    .catch(error => {
      store.dispatch({
        type: "UPDATE_MILESTONE_ONBOARD_ERROR",
        payload: error
      });
    });
  store.dispatch({
    type: "UPDATE_MILESTONE_ONBOARD"
  });
}

export function updatePushNotificationPermissions(allowNotifications, allowMaintenanceNotifications, allowActivitiesNotifications) {
  fireStore
    .collection("users")
    .doc(fireAuth.currentUser.uid)
    .update({
      "settings.pushNotifications.permission": allowNotifications,
      "settings.pushNotifications.permissionMaintenance": allowMaintenanceNotifications,
      "settings.pushNotifications.permissionActivities": allowActivitiesNotifications
    })
    .then(() => {
      store.dispatch({
        type: "UPDATE_PUSH_NOTIFICATION_PERMISSIONS_SUCCESS"
      });
    })
    .catch(error => {
      store.dispatch({
        type: "UPDATE_PUSH_NOTIFICATION_PERMISSIONS_ERROR",
        payload: error
      });
    });
  store.dispatch({
    type: "UPDATE_PUSH_NOTIFICATION_PERMISSIONS"
  });
}

export function updatePushNotificationToken(token) {
  fireStore
    .collection("users")
    .doc(fireAuth.currentUser.uid)
    .update({"settings.pushNotifications.token": token})
    .then(() => {
      store.dispatch({
        type: "UPDATE_PUSH_NOTIFICATION_TOKEN_SUCCESS"
      });
    })
    .catch(error => {
      store.dispatch({
        type: "UPDATE_PUSH_NOTIFICATION_TOKEN_ERROR",
        payload: error
      });
    });
  store.dispatch({
    type: "UPDATE_PUSH_NOTIFICATION_TOKEN"
  });
}

export function setUserData(userId) {
  return (dispatch, getState) => {
    // Get and deactivate the store
    // ref if there is one
    getState().ref ? ref() : null;
    // Get a new ref if we have a user
    // or set it to null
    ref = null;
    if (userId) {
      ref = fireStore.collection("users").doc(userId).onSnapshot((doc) => {
        if (doc.exists) {
          dispatch({
            type: "SET_USER_DATA",
            payload: doc.data()
          });
        } else {
          fireStore.collection("users").doc(userId).set({
            integrations: {
              strava: false
            },
            membership: {
              manualOverride: false
            },
            milestones: {
              onBoard: false
            },
            settings: {
              emailNotifications: true,
              pushNotifications: {
                permission: true,
                permissionMaintenance: true,
                permissionActivities: true,
                token: null
              }
            }
          })
        }
      });
    } else {
      dispatch({
        type: "SET_USER_DATA",
        payload: null
      });
    }
    // Set the ref
    dispatch({
      type: "SET_USER_REF",
      payload: ref
    });
  }
}

export function setUserSession(user) {
  return {
    type: "SET_USER_SESSION",
    payload: user
  };
}

export function signIn(email, password) {
  fireAuth.signInAndRetrieveDataWithEmailAndPassword(
    email,
    password
  ).then(() => {
    store.dispatch({
      type: "SIGN_IN_SUCCESS"
    });
  }).catch((error) => {
    store.dispatch({
      type: "SIGN_IN_ERROR",
      payload: decodeFirebaseAuthError(error.code)
    });
  });
  store.dispatch({
    type: "SIGN_IN"
  });
}

export function signOut() {
  fireAuth.signOut()
    .then(() => {
      store.dispatch({
        type: "SIGN_OUT_SUCCESS"
      });
    })
    .catch(error => {
      store.dispatch({
        type: "SIGN_OUT_ERROR",
        payload: error
      })
    });
  store.dispatch({
    type: "SIGN_OUT"
  });
}

export function signUp(email, password) {
  fireAuth.createUserAndRetrieveDataWithEmailAndPassword(
    email,
    password
  ).then(() => {
    store.dispatch({
      type: "SIGN_UP_SUCCESS"
    });
    signIn(email, password);
  }).catch((error) => {
    store.dispatch({
      type: "SIGN_UP_ERROR",
      payload: decodeFirebaseAuthError(error.code)
    });
  });
  store.dispatch({
    type: "SIGN_UP"
  });
}

export function stravaTokenExchange(clientId, clientSecret, code) {
  fetch(`https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {
    method: "POST"
  })
  .then((response) => response.json())
  .then((response) => {
    userId = store.getState().user.session.uid;
    fireStore.collection("users").doc(userId).update({
      "integrations.strava": response
    }).then(() => {
      ActivitiesActions.syncActivities();
      EquipmentActions.syncStravaEquipment();
      store.dispatch({
        type: "SET_STRAVA_SUCCESS"
      });
    });
  }).catch((error) => {
    store.getState().ref.update({
      "integrations.strava": false
    });
    store.dispatch({
      type: "SET_STRAVA_ERROR",
      payload: error
    });
  });
  return {
    type: "SET_STRAVA"
  };
}
