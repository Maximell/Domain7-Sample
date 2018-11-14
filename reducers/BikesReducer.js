export default function reducer(state={
  data: null,
  map: null,
  error: null,
  loading: false,
  ref: null
}, action) {
  switch (action.type) {
    case "ADD_BIKE":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_BIKE_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_BIKE_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "ADD_BIKE_COMPONENTS":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_BIKE_COMPONENTS_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_BIKE_COMPONENTS_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "SET_BIKES_DATA":
      return {
        ...state,
        data: action.payload.bikes,
        loading: false,
        map: action.payload.bikesMap
      }
    case "SET_BIKES_REF":
      return {
        ...state,
        loading: true,
        ref: action.payload
      }
    default: {
      return {
        ...state
      };
    }
  }
  return state;
}
