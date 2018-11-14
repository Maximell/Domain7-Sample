// React / React Native Imports
import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  View
} from "react-native";
// Library Imports
import { Card, ListItem } from "react-native-elements";
import EvilIcon from  "react-native-vector-icons/EvilIcons";
import { connect } from "react-redux";
// Custom Imports
import * as ActivitiesActions from "@actions/ActivitiesActions";
import AddMenu from "@components/AddMenu/AddMenu";
import AddMenuButton from "@components/AddMenuButton/AddMenuButton";
import CardComponent from "@components/CardComponent/CardComponent";
import ListComponents from "@components/ListComponents/ListComponents";
import Loading from "@components/Loading/Loading";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "white",
    },
    headerTitleStyle: {
      color: colors.text,
      fontWeight: "400",
    },
    headerRight: (
      <AddMenuButton
        onPress={() => navigation.state.params.addMenuToggle()}
      />
    )
  });

  constructor(props) {
    super (props);
    props.navigation.setParams({
      addMenuToggle: () => this.refs.addMenu.toggle()
    });
  }

  render() {
    return (
      <View style={{height: "100%"}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              colors={[colors.text]}
              refreshing={this.props.componentsLoading || this.props.activitiesLoading}
              onRefresh={() => ActivitiesActions.syncActivities()}
            />
          }
        >
          <ListComponents
            navigation={this.props.navigation}
            components={this.props.components}
          />
        </ScrollView>
        <AddMenu
          navigation={this.props.navigation}
          ref={"addMenu"}
        />
      </View>
    );
  }
}

function mapStoreToProps(store) {
  return {
    components: store.components.data,
    componentsLoading: store.components.loading,
    componentsMap: store.components.map,
    activitiesLoading: store.activities.loading
  }
}

export default connect(mapStoreToProps)(Home);
