// Library
// Custom
import {
  fireAuth,
  fireStore,
  fireFunc
} from "@firebase/firebase";
import store from "@stores/Store";

export function setActivitiesListener(userId) {
  return (dispatch, getState) => {
    // Get and deactivate the store
    // ref if there is one
    getState().ref ? ref() : null;
    // Get a new ref if we have a user
    // or set it to null
    ref = userId ? fireStore.collection("users").doc(userId).collection("activities").orderBy("start_date", "desc").limit(30).onSnapshot(snapshot => {
      activities = [];
      activitiesMap = {};
      for (var i=0; i<snapshot.docs.length; i++) {
        const activity = snapshot.docs[i].data();
        activities.push(activity);
        activitiesMap[activity.id] = activity;
      }
      dispatch({
        type: "SET_ACTIVITIES_DATA",
        payload: {activities, activitiesMap}
      });
    }) : dispatch({
      type: "SET_ACTIVITIES_DATA",
      payload: {activities: null, activitiesMap: null}
    });

    dispatch({
      type: "SET_ACTIVITIES_REF",
      payload: ref
    });
  }
}

export function syncActivities() {

    if (!store.getState().user.data.integrations.strava) {
      store.dispatch({
        type: "GET_STRAVA_ACTIVITIES_ERROR",
        payload: "Strava has not been connected yet."
      });
      return;
    }

    const stravaAccessToken = store.getState().user.data.integrations.strava.access_token;
    const stravaUserId = store.getState().user.data.integrations.strava.athlete.id;
    const firebaseUserId = store.getState().user.session.uid;

    const syncStravaActivities = fireFunc.httpsCallable("syncStravaActivities");

    store.dispatch({
      type: "GET_STRAVA_ACTIVITIES"
    })

    return syncStravaActivities({stravaAccessToken, stravaUserId, firebaseUserId}).then(({ data }) => {
      data.success ? store.dispatch({
        type: "GET_STRAVA_ACTIVITIES_SUCCESS"
      }) : store.dispatch({
        type: "GET_STRAVA_ACTIVITIES_ERROR",
        payload: data.error
      });
    }).catch(error => {
      store.dispatch({
        type: "GET_STRAVA_ACTIVITIES_ERROR",
        payload: error
      });
    });
}
