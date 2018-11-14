// Custom
import store from "@stores/Store";

export function getFormattedDate(dateTime) {

  const monthToStringMap = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  };

  const date = dateTime.getDate();
  const month = monthToStringMap[dateTime.getMonth()];
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes().toString().length === 1 ? "0" + dateTime.getMinutes().toString() : dateTime.getMinutes().toString();

  return date + " " + month + " " + year + " at " + hours + ":" + minutes;
}

export function decodeFirebaseAuthError(errorCode) {
  switch (errorCode) {
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
    case "auth/user-disabled":
      errorString = "Invalid email or password.";
      break;
    case "auth/too-many-requests":
      errorString = "Try again in a moment.";
      break;
    case "auth/network-request-failed":
    case "auth/network-error":
      errorString = "No network connection.";
      break;
    case "auth/unknown":
    default:
      errorString = "Hmm - we don't know what happened! Contact support if this keeps happening.";
      break;
  }
  return errorString;
}

export function getBikeFromEquipmentId(equipmentId, bikes) {
  var bike = null;
  if (bikes && equipmentId) {
    for (var i=0; i<bikes.length; i++) {
      if (bikes[i].equipment === equipmentId) {
        bike = bikes[i];
        break;
      }
    }
  }
  return bike;
}

export function getDistanceString(meters, decimalPlaces) {
  unitOfMeasurement = "Metric (km)";
  try {
    unitOfMeasurement = store.getState().user.data.settings.unitOfMeasurement;
  } catch(error) {}

  if (unitOfMeasurement === "Imperial (mi)") {
    return Math.round(meters / 1609.34 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces) + "mi"
  } else {
    return Math.round(meters / 1000 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces) + "km"
  }
}

export function getElevationString(meters, decimalPlaces) {
  unitOfMeasurement = "Metric (km)";
  try {
    unitOfMeasurement = store.getState().user.data.settings.unitOfMeasurement;
  } catch(error) {}

  if (unitOfMeasurement === "Imperial (mi)") {
    return Math.round(meters * 3.28 * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces) + "ft"
  } else {
    return Math.round(meters * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces) + "m"
  }
}

export function getDistanceUnitsString() {
  unitOfMeasurement = "Metric (km)";
  try {
    unitOfMeasurement = store.getState().user.data.settings.unitOfMeasurement;
  } catch(error) {}

  if (unitOfMeasurement === "Imperial (mi)") {
    return "mi"
  } else {
    return "km";
  }  
}

export function getPercent(numerator, denominator, decimalPlaces) {
  return Math.round(numerator/denominator * Math.pow(10,decimalPlaces) * 100) / (Math.pow(10,decimalPlaces));
}
