// React
// Library
import {
  applyMiddleware,
  createStore
} from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
// Custom
import reducer from "@reducers/Reducer";


const { pathname } = window.location || {};
const IS_RUNNING_IN_CHROME = pathname && pathname.indexOf("debugger-ui");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const middleware = IS_RUNNING_IN_CHROME && !IS_PRODUCTION ? applyMiddleware(thunk, createLogger()) : applyMiddleware(thunk);

export default createStore(reducer, {}, middleware);
