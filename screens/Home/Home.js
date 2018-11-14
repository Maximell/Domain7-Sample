// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import { Button, Card, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import EvilIcon from  "react-native-vector-icons/EvilIcons";
import IonIcon from  "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
// Custom Imports
import * as ActivitiesActions from "@actions/ActivitiesActions";
import * as EquipmentActions from "@actions/EquipmentActions";
import * as UserActions from "@actions/UserActions";
import AddMenu from "@components/AddMenu/AddMenu";
import AddMenuButton from "@components/AddMenuButton/AddMenuButton";
import CardBike from "@components/CardBike/CardBike";
import Loading from "@components/Loading/Loading";
import colors from "@config/styles/colors";
import { fireFunc, fireMessaging } from "@firebase/firebase";


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
    super(props)

    this.state = {
      activitiesLoading: false,
      navigatedOnboard: false
    }

    props.navigation.setParams({
      addMenuToggle: () => this.refs.addMenu.toggle(),
    });
  }

  render() {

    const { navigate } = this.props.navigation;
    const { userData } = this.props;
    const listData = [];

    if (!userData) {
      return (
        <Loading/>
      )
    }

    if (!this.state.navigatedOnboard && !userData.milestones.onBoard) {
      this.setState({
        navigatedOnboard: true
      });
      navigate("OnBoard");
    }

    if (!this.props.userData.integrations.strava || !this.props.userData.integrations.strava.athlete) {
      listData.push({
        type: "ConnectStrava"
      });
    };

    if (this.props.userData.integrations.strava && !this.props.equipment && !this.props.equipmentLoading) {
      listData.push({
        type: "SyncEquipment"
      });
    }

    if (this.props.bikes && this.props.bikes.length) {
      this.props.bikes.forEach((bike, i) => {
        listData.push({
          type: "Bike",
          data: bike
        });
      });
    } else if (!this.props.bikesLoading){
      listData.push({
        type: "AddBike"
      });
    }

    return (
      <View style={{height: "100%"}}>
        <FlatList
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              colors={[colors.text]}
              refreshing={this.props.activitiesLoading}
              onRefresh={() => ActivitiesActions.syncActivities()}
            />
          }
          data={listData}
          renderItem={({ item }) => {
            switch (item.type) {
              case "AddBike":
                return (
                  <TouchableWithoutFeedback
                    onPress={() => navigate("BikeBuilder", {})}
                  >
                    <Card containerStyle={{padding: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
                      <ListItem
                        leftIcon={{
                          name: "ios-alert",
                          type: "ionicon",
                          size: 40,
                          color: colors.text
                        }}
                        title="You don't have any bikes added"
                        titleStyle={{color: colors.text}}
                        subtitle="Click to add a bike"
                        chevron
                        chevronColor={colors.text}
                        containerStyle={{
                          borderRadius: 6
                        }}
                      />
                    </Card>
                  </TouchableWithoutFeedback>
                );
              case "Bike": {
                let bike = item.data;
                return (
                  <CardBike
                    bike={bike}
                    onPress={() => navigate("Bike", {bikeId: bike.id})}
                  />
                );
              }
              case "ConnectStrava":
                return (
                  <TouchableWithoutFeedback
                    onPress={() => navigate("ConnectStrava")}
                  >
                    <Card containerStyle={{padding: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
                      <ListItem
                        leftAvatar={{
                          source: require("@assets/images/strava.png"),
                          size: "medium",
                        }}
                        title="Connect to Strava"
                        titleStyle={{color: colors.text}}
                        subtitle="We can use your current gear from Strava! Connect for a better BikeWrench."
                        chevron
                        chevronColor={colors.text}
                        style={{
                          padding: 0
                        }}
                      />
                    </Card>
                  </TouchableWithoutFeedback>
                );
              case "SyncEquipment":
                return (
                  <TouchableWithoutFeedback
                    onPress={() => EquipmentActions.syncStravaEquipment()}
                  >
                    <Card containerStyle={{padding: 10, marginHorizontal: 0, marginTop: 0, marginBottom: 4}}>
                      <ListItem
                        leftIcon={{
                          name: "ios-sync",
                          type: "ionicon",
                          size: 40,
                          color: colors.text
                        }}
                        title="Sync gear from Strava"
                        titleStyle={{color: colors.text}}
                        subtitle="You're connected to Strava, but we need your gear too! Sync for a better BikeWrench."
                        chevron
                        chevronColor={colors.text}
                        style={{
                          padding: 0
                        }}
                      />
                    </Card>
                  </TouchableWithoutFeedback>
                );
            }
          }}
          keyExtractor={(item, index) => index}
        />
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
    activitiesLoading: store.activities.loading,
    bikes: store.bikes.data,
    bikesLoading: store.bikes.loading,
    equipment: store.equipment.data,
    equipmentLoading: store.equipment.loading,
    userSession: store.user.session,
    userData: store.user.data
  }
}

export default connect(mapStoreToProps)(Home);
