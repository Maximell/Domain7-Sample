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
import { Button, Card, ListItem } from "react-native-elements";
import IonIcon from  "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
// Custom Imports
import * as ActivitiesActions from "@actions/ActivitiesActions";
import * as EquipmentActions from "@actions/EquipmentActions";
import * as UserActions from "@actions/UserActions";
import CardActivity from "@components/CardActivity/CardActivity";
import CardBike from "@components/CardBike/CardBike";
import CardComponent from "@components/CardComponent/CardComponent";
import ListComponents from "@components/ListComponents/ListComponents";
import Loading from "@components/Loading/Loading";
import Map from "@components/Map/Map";
import NavBack from "@components/NavBack/NavBack";
import { getBikeFromEquipmentId, getFormattedDate } from "@config/util/util";
import colors from "@config/styles/colors";
import { fireAuth, fireStore } from "@firebase/firebase";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Activity extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Activity",
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
    ),
    tabBarVisible: false
  });

  constructor(props) {
    super(props);

    const { goBack } = props.navigation;
    const activityId = this.props.navigation.state.params.activityId;

    this.state = {
      activity: null,
      loading: true
    }

    fireStore
      .collection("users")
      .doc(fireAuth.currentUser.uid)
      .collection("activities")
      .doc(activityId.toString())
      .onSnapshot(activitySnapshot => {
        if (!activitySnapshot.exists)
          return goBack();
        this.setState({
          activity: activitySnapshot.data(),
          loading: false
        });
      })
  }

  render() {

    const { navigate } = this.props.navigation;

    if (this.state.loading) {
      return (
        <Loading/>
      );
    }

    const activity = this.state.activity;
    const bike = getBikeFromEquipmentId(activity.gear_id, this.props.bikes);
    const equipment = this.props.equipmentMap[activity.gear_id];

    return (
      <ScrollView style={{ width: SCREEN_WIDTH }}>
        <CardActivity
          activity={activity}
          bikes={this.props.bikes}
          onPress={null}
        />
        {bike ? (
          <CardBike
            bike={bike}
            onPress={() => navigate("Bike", {bikeId: bike.id})}
          />
        ) : equipment ? (
          <Card>
            <TouchableOpacity
              onPress={() => navigate("BikeBuilder", {equipmentId: equipment.id})}
            >
              <ListItem
                chevron
                chevronColor={colors.text}
                leftIcon={{
                  name: "ios-add-circle-outline",
                  type: "ionicon",
                  size: 40,
                  color: colors.text
                }}
                title={"Add a bike for \"" + equipment.name + "\""}
                titleStyle={{color: colors.text}}
                style={{
                  padding: 0,
                  borderRadius: 5,
                }}
                subtitle={""}
                subtitleStyle={{fontSize: 13, color: "grey"}}
              />
            </TouchableOpacity>
          </Card>
        ) : (
          <Card>
            <Text>Don't know this equipment either.</Text>
          </Card>
        )}
        {bike && (
          <View>
            <ListComponents
              activity={activity}
              navigation={this.props.navigation}
              components={bike.components.filter(componentId => this.props.componentsMap[componentId] ? true : false).map(componentId => this.props.componentsMap[componentId])}
              componentSwitch={true}
            />
          </View>
        )}
      </ScrollView>
    );
  }
}

function mapStoreToProps(store) {
  return {
    bikes: store.bikes.data,
    bikesLoading: store.bikes.loading,
    componentsMap: store.components.map,
    equipmentMap: store.equipment.map
  }
}

export default connect(mapStoreToProps)(Activity);
