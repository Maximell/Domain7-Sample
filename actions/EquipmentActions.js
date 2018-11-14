import {
  fireAuth,
  fireStore,
  fireFunc
} from "@firebase/firebase";
// Library
// Custom
import store from "@stores/Store";

export function setEquipmentListener(userId) {
  return (dispatch, getState) => {
    // Get and deactivate the store
    // ref if there is one
    getState().ref ? ref() : null;
    // Get a new ref if we have a user
    // or set it to null
    ref = userId ? fireStore.collection("users").doc(userId).collection("equipment").onSnapshot(snapshot => {
      equipment = [];
      equipmentMap = {};
      for (var i=0; i<snapshot.docs.length; i++) {
        const equip = snapshot.docs[i].data();
        equipment.push(equip);
        equipmentMap[equip.id] = equip;
      }
      dispatch({
        type: "SET_EQUIPMENT_DATA",
        payload: {
          equipment,
          equipmentMap
        }
      });
    }) : dispatch({
      type: "SET_EQUIPMENT_DATA",
      payload: {
        equipment: null,
        equipmentMap: null
      }
    });

    dispatch({
      type: "SET_EQUIPMENT_REF",
      payload: ref
    });
  }
}

export function syncStravaEquipment() {

  const stravaAccessToken = store.getState().user.data.integrations.strava.access_token;
  const stravaUserId = store.getState().user.data.integrations.strava.athlete.id;
  const firebaseUserId = store.getState().user.session.uid;

  const syncStravaEquipment = fireFunc.httpsCallable("syncStravaEquipment");

  store.dispatch({
    type: "GET_STRAVA_EQUIPMENT"
  });

  syncStravaEquipment({stravaAccessToken, stravaUserId, firebaseUserId}).then(({ data }) => {

    data.success ? store.dispatch({
      type: "GET_STRAVA_EQUIPMENT_SUCCESS"
    }) : store.dispatch({
      type: "GET_STRAVA_EQUIPMENT_ERROR",
      payload: data.error
    });

  }).catch(error => {
    store.dispatch({
      type: "GET_STRAVA_EQUIPMENT_ERROR",
      payload: error
    });
  });
}
