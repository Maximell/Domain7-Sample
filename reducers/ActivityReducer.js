export default function reducer(state={
  data: null,
  map: null,
  loading: false,
  error: null,
  ref: null
}, action) {
  switch (action.type) {
    case "SET_ACTIVITIES_DATA":
      return {
        ...state,
        data: action.payload.activities,
        map: action.payload.activitiesMap
      }
    case "SET_ACTIVITIES_REF":
      return {
        ...state,
        ref: action.payload
      }
    case "GET_STRAVA_ACTIVITIES":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "GET_STRAVA_ACTIVITIES_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "GET_STRAVA_ACTIVITIES_SUCCESS":
      return {
        ...state,
        loading: false
      }
    default:
      return {
        ...state
      };
  }
}
