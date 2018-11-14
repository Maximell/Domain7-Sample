// React
// Library
import { combineReducers } from "redux";
// Custom
import ActivityReducer from "@reducers/ActivityReducer";
import BikesReducer from "@reducers/BikesReducer";
import ComponentsReducer from "@reducers/ComponentsReducer";
import EquipmentReducer from "@reducers/EquipmentReducer";
import UserReducer from "@reducers/UserReducer";

export default reducers = combineReducers({
  activities: ActivityReducer,
  bikes: BikesReducer,
  components: ComponentsReducer,
  equipment: EquipmentReducer,
  user: UserReducer
});
