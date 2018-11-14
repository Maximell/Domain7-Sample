// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import { Button, Card, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// Custom Imports
import * as ComponentsActions from "@actions/ComponentsActions"
import ComponentAdder from "@components/ComponentAdder/ComponentAdder";
import NavBack from "@components/NavBack/NavBack";
import colors from "@config/styles/colors";
import RatingTracker from "@ratings/RatingTracker";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class AddComponent extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Add Component",
    headerStyle: {
      backgroundColor: "white",
    },
    headerTitleStyle: {
      color: colors.text,
      fontWeight: "400",
    },
    headerLeft: (
      <NavBack
        onPress={() => navigation.goBack()}
      />
    )
  });

  render() {

    const { goBack } = this.props.navigation;

    return (
      <ScrollView>
        <View style={{width: SCREEN_WIDTH}}>
          <Card containerStyle={{padding: 10, marginHorizontal: 10, marginTop: 10, marginBottom: 4}}>
            <ComponentAdder
              success={() => {
                goBack();
                RatingTracker.handlePositiveEvent();
              }}
              cancel={() => goBack()}
            />
          </Card>
        </View>
      </ScrollView>
    );
  }
}

function mapStoreToProps(store) {
  return {}
}

export default connect(mapStoreToProps)(AddComponent);
