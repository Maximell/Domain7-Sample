export default function reducer(state={
  data: [],
  map: {},
  loading: false,
  error: null,
  ref: null
}, action) {
  switch (action.type) {
    case "ADD_COMPONENT":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_COMPONENT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_COMPONENT_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "ADD_COMPONENT_SERVICE_INTERVAL":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_COMPONENT_SERVICE_INTERVAL_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_COMPONENT_SERVICE_INTERVAL_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "ADD_COMPONENT_SERVICE_LOG":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_COMPONENT_SERVICE_LOG_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_COMPONENT_SERVICE_LOG_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "ADD_COMPONENT_WITH_SERVICE_INTERVALS":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "ADD_COMPONENT_WITH_SERVICE_INTERVALS_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "ADD_COMPONENT_WITH_SERVICE_INTERVALS_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "SET_COMPONENTS_DATA":
      return {
        ...state,
        loading: false,
        data: action.payload.components,
        map: action.payload.componentsMap
      }
    case "SET_COMPONENTS_REF":
      return {
        ...state,
        loading: true,
        ref: action.payload
      }
    default:
      return {
        ...state
      };
  }
}
