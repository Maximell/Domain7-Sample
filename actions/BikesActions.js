import {
  fireAuth,
  fireStore
} from "@firebase/firebase";
// Library
// Custom
import store from "@stores/Store";


export function addBike(name, brand, model, year, type, time, distance, equipment, components, success) {
  const userId = store.getState().user.session.uid;
  const userDb = fireStore.collection("users").doc(userId);
  const newBikeRef = userDb.collection("bikes").doc();

  newBikeRef.set({
    name,
    brand,
    model,
    year,
    type,
    time,
    distance,
    equipment: equipment,
    components: components,
    id: newBikeRef.id
  }).then(() => {
    store.dispatch({
      type: "ADD_BIKE_SUCCESS"
    });
    success();
  }).catch(error => {
    store.dispatch({
      type: "ADD_BIKE_ERROR",
      payload: error
    });
  });
  store.dispatch({
    type: "ADD_BIKE"
  });
}

export function addBikeComponents(bikeId, newComponents, success) {
  const userId = store.getState().user.session.uid;
  const userDb = fireStore.collection("users").doc(userId);
  const bikeRef = userDb.collection("bikes").doc(bikeId);

  components = store.getState().bikes.map[bikeId].components;
  // check that we don't add duplicate component Id's
  for (var i=0; i<newComponents.length; i++)
    components.push(newComponents[i]);

  components = [... new Set(components)];

  bikeRef.update({
    components
  }).then(() => {
    store.dispatch({
      type: "ADD_BIKE_COMPONENTS_SUCCESS"
    });
    success();
  }).catch(error => {
    store.dispatch({
      type: "ADD_BIKE_COMPONENTS_ERROR",
      payload: error
    });
  });
  store.dispatch({
    type: "ADD_BIKE_COMPONENTS"
  });
}

export function removeBikeComponents(bikeId, oldComponents) {
  const userId = fireAuth.currentUser.uid;

  const bikeRef = fireStore
    .collection("users")
    .doc(userId)
    .collection("bikes")
    .doc(bikeId);

  return new Promise((resolve, reject) => {
    bikeRef.get()
      .then(bikeDoc => {
        if (!bikeDoc.exists) {
          reject("Bike not found.");
          return;
        }
        bikeData = bikeDoc.data();

        newComponentArray = bikeData.components.filter(component => !oldComponents.includes(component))

        bikeRef.update({ components: newComponentArray })
          .then(() => resolve())
          .catch(error => reject(error));
      })
      .catch(error => reject(error))
  })
}

export function setBikesListener(userId) {
  return (dispatch, getState) => {
    // Get and deactivate the store
    // ref if there is one
    getState().ref ? ref() : null;
    // Get a new ref if we have a user
    // or set it to null
    ref = userId ? fireStore.collection("users").doc(userId).collection("bikes").onSnapshot(async snapshot => {
      bikes = [];
      bikesMap = {};
      for (var i=0; i<snapshot.docs.length; i++) {
        bike = snapshot.docs[i].data();
        bikes.push(bike);
        bikesMap[bike.id] = bike;
      }
      dispatch({
        type: "SET_BIKES_DATA",
        payload: {bikes, bikesMap}
      });
    }) : dispatch({
      type: "SET_BIKES_DATA",
      payload: {bikes: null, bikesMap: null}
    });

    dispatch({
      type: "SET_BIKES_REF",
      payload: ref
    });
  }
}
