// React / React Native Imports
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
// Custom Imports
import ListItemComponent from "@components/ListItemComponent/ListItemComponent";
import colors from "@config/styles/colors";
import { textColor, textSize } from "@config/styles/text";
import { fireAuth, fireStore } from "@firebase/firebase";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class ListItemComponentConnected extends React.Component {

  constructor(props) {
    super(props);

    const activity = this.props.activity;
    const component = this.props.component;
    const userId = fireAuth.currentUser.uid;

    this.state = {
      loading: true,
      switchValue: null
    };

    this.ref = fireStore
      .collection("users")
      .doc(userId)
      .collection("components")
      .doc(component.id)
      .collection("activities")
      .doc(activity.id.toString())
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          this.setState({
            loading: false,
            switchValue: false
          });
        } else {
          this.setState({
            loading: false,
            switchValue: true
          });
        }
      });
  }

  render() {
    return (
      <ListItemComponent
        component={this.props.component}
        checkBox={this.props.checkBox ? this.props.checkBox : null}
        onPress={this.props.onPress}
        componentSwitch={(this.props.componentSwitch && !this.state.loading) ? {
          onValueChange: syncActivity => this.syncActivity(syncActivity),
          value: this.state.switchValue,
          style: {
            marginRight: -15
          }
        } : null}
        loading={this.state.loading}
      />
    );
  }

  componentWillUnmount() {
    this.ref();
  }

  syncActivity(syncActivity) {
    activityRef = fireStore
      .collection("users")
      .doc(fireAuth.currentUser.uid)
      .collection("components")
      .doc(this.props.component.id)
      .collection("activities")
      .doc(this.props.activity.id.toString());

    if (syncActivity) {
      activityRef
        .set(this.props.activity);
    } else {
      activityRef
        .delete();
    }
    this.setState({
      loading: true
    });
  }
}

export default ListItemComponentConnected;
