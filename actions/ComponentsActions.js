// React / React-Native
// Library
// Custom
import {
  fireAuth,
  fireFunc,
  fireStore
} from "@firebase/firebase";
import store from "@stores/Store";


export function addComponent(name, category, type, time, distance, retired, success) {
  const userId = store.getState().user.session.uid;
  const userDb = fireStore.collection("users").doc(userId);
  const newComponentRef = userDb.collection("components").doc();
  newComponentRef.set({
    name,
    category,
    type,
    distance,
    time,
    retired,
    createdAt: new Date(),
    id: newComponentRef.id
  }).then(() => {
    store.dispatch({
      type: "ADD_COMPONENT_SUCCESS"
    });
    success();
  }).catch(error => {
    store.dispatch({
      type: "ADD_COMPONENT_ERROR",
      payload: error
    });
  });
  store.dispatch({
    type: "ADD_COMPONENT"
  });
}

export function addComponentServiceInterval(component, name, serviceDistance, serviceTime, success) {
  const userId = store.getState().user.session.uid;

  const newServiceIntervalRef = fireStore
    .collection("users")
    .doc(userId)
    .collection("components")
    .doc(component.id)
    .collection("serviceIntervals")
    .doc();

  newServiceIntervalRef.set({
    name,
    createdAt: new Date(),
    currentDistance: 0,
    currentTime: 0,
    serviceDistance,
    serviceTime,
    id: newServiceIntervalRef.id
  }).then(() => {
    store.dispatch({
      type: "ADD_COMPONENT_SERVICE_INTERVAL_SUCCESS"
    });
    success();
  }).catch(error => {
    store.dispatch({
      type: "ADD_COMPONENT_SERVICE_INTERVAL_ERROR",
      payload: error
    });
  });
  store.dispatch({
    type: "ADD_COMPONENT_SERVICE_INTERVAL"
  });
}

export function addComponentWithServiceIntervals(name, category, type, time, distance, retired, serviceIntervals, success) {
  const userId = store.getState().user.session.uid;

  const batch = fireStore.batch();

  const newComponentRef = fireStore
    .collection("users")
    .doc(userId)
    .collection("components")
    .doc();
  const newComponentId = newComponentRef.id;
  batch.set(newComponentRef, {
    name,
    category,
    type,
    distance,
    time,
    retired,
    createdAt: new Date(),
    id: newComponentId
  });

  for (var i=0; i<serviceIntervals.length; i++) {
    const newServiceIntervalRef = fireStore
    .collection("users")
    .doc(userId)
    .collection("components")
    .doc(newComponentId)
    .collection("serviceIntervals")
    .doc();
    batch.set(newServiceIntervalRef, {
      name: serviceIntervals[i].name,
      createdAt: new Date(),
      currentDistance: distance,
      currentTime: time,
      serviceDistance: serviceIntervals[i].serviceDistance,
      serviceTime: serviceIntervals[i].serviceTime,
      id: newServiceIntervalRef.id
    });
  }
  batch.commit().then(() => {
    store.dispatch({
      type: "ADD_COMPONENT_WITH_SERVICE_INTERVALS_SUCCESS"
    });
    success();
  }).catch(error => {
    store.dispatch({
      type: "ADD_COMPONENT_WITH_SERVICE_INTERVALS_ERROR",
      payload: error
    });
  });
  store.dispatch({
    type: "ADD_COMPONENT_WITH_SERVICE_INTERVALS"
  });
}

export function addServiceLog(userId, componentId, serviceIntervalId, type, notes) {
  store.dispatch({
    type: "ADD_COMPONENT_SERVICE_LOG"
  });
  return fireStore
    .collection("users")
    .doc(userId)
    .collection("components")
    .doc(componentId)
    .collection("serviceIntervals")
    .doc(serviceIntervalId)
    .collection("serviceLogs")
    .doc()
    .set({
      createdAt: new Date(),
      notes,
      type
    })
    .then(() => {
      store.dispatch({
        type: "ADD_COMPONENT_SERVICE_LOG_SUCCESS"
      });
    })
    .catch(error => {
      store.dispatch({
        type: "ADD_COMPONENT_SERVICE_LOG_ERROR",
        payload: error
      });
    });
}

export function setComponentRetired(componentId) {

  const userId = fireAuth.currentUser.uid;

  const componentSetRetired = fireFunc.httpsCallable("componentSetRetired");

  return componentSetRetired({userId, componentId})
    .then(() => console.warn("success"))
    .catch(error => console.warn(error));
}

export function setComponentsListener(userId) {
  return (dispatch, getState) => {
    // Get and deactivate the store
    // ref if there is one
    getState().ref ? ref() : null;
    // Get a new ref if we have a user
    // or set it to null
    ref = userId ? fireStore.collection("users").doc(userId).collection("components").where("retired", "==", false).onSnapshot(snapshot => {
      components = [];
      componentsMap = {};
      for (var i=0; i<snapshot.docs.length; i++) {
        const component = snapshot.docs[i].data();
        components.push(component);
        componentsMap[component.id] = component;
      }
      dispatch({
        type: "SET_COMPONENTS_DATA",
        payload: {
          components,
          componentsMap
        }
      });
    }) : dispatch({
      type: "SET_COMPONENTS_DATA",
      payload: {
        components: null,
        componentsMap: null
      }
    });

    dispatch({
      type: "SET_COMPONENTS_REF",
      payload: ref
    });
  }
}
