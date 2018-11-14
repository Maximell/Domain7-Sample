export default function reducer(state={
  data: null,
  session: null,
  loading: false,
  error: null,
  ref: null
}, action) {
  switch (action.type) {
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null
      }
    case "UPDATE_UNIT_OF_MEASUREMENT":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "UPDATE_UNIT_OF_MEASUREMENT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "UPDATE_UNIT_OF_MEASUREMENT_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "UPDATE_MILESTONE_ONBOARD":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "UPDATE_MILESTONE_ONBOARD_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "UPDATE_MILESTONE_ONBOARD_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "UPDATE_PUSH_NOTIFICATION_PERMISSIONS_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "UPDATE_PUSH_NOTIFICATION_PERMISSIONS":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "UPDATE_PUSH_NOTIFICATION_PERMISSIONS_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "UPDATE_PUSH_NOTIFICATION_PERMISSIONS_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "UPDATE_PUSH_NOTIFICATION_TOKEN":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "UPDATE_PUSH_NOTIFICATION_TOKEN_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "UPDATE_PUSH_NOTIFICATION_TOKEN_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "SET_USER_SESSION":
      return {
        ...state,
        error: null,
        session: action.payload
      }
    case "SET_USER_DATA":
      return {
        ...state,
        data: action.payload
      }
    case "SET_USER_REF":
      return {
        ...state,
        ref: action.payload
      }
    case "SET_STRAVA":
      return {
        ...state,
        error: null,
        loading: true
      };
    case "SET_STRAVA_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "SET_STRAVA_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "SET_USER_DATA":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      };
    case "SIGN_IN":
      return {
        ...state,
        loading: true,
        error: null
      };
    case "SIGN_IN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case "SIGN_IN_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null
      }
    case "SIGN_OUT":
      return {
        ...state,
        error: null,
        loading: true
      }
    case "SIGN_OUT_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case "SIGN_OUT_SUCCESS":
      return {
        ...state,
        error: null,
        loading: false
      }
    case "SIGN_UP":
      return {
        ...state,
        loading: true,
        error: null
      }
    case "SIGN_UP_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case "SIGN_UP_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null
      }
    default:
      return {
        ...state
      };
  }
}
