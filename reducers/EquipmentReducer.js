export default function reducer(state={
  data: null,
  map: null,
  error: null,
  loading: false,
  ref: null
}, action) {
  switch (action.type) {
    case "SET_EQUIPMENT_DATA":
      return {
        ...state,
        loading: false,
        data: action.payload.equipment,
        map: action.payload.equipmentMap
      }
    case "SET_EQUIPMENT_REF":
      return {
        ...state,
        loading: true,
        ref: action.payload
      }
    case "GET_STRAVA_EQUIPMENT":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "GET_STRAVA_EQUIPMENT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "GET_STRAVA_EQUIPMENT_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    default:
      return {
        ...state
      };
  }
}
