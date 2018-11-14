// React / React Native Imports
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
// Library Imports
import { ButtonGroup, Card, ListItem } from "react-native-elements";
import * as Progress from "react-native-progress";
import IonIcon from  "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
// Custom Imports
import CardActivity from "@components/CardActivity/CardActivity";
import CardComponent from "@components/CardComponent/CardComponent";
import CardServiceInterval from "@components/CardServiceInterval/CardServiceInterval";
import Loading from "@components/Loading/Loading";
import NavBack from "@components/NavBack/NavBack";
import ServiceIntervalAdder from "@components/ServiceIntervalAdder/ServiceIntervalAdder";
import colors from "@config/styles/colors";
import { textSize, textColor } from "@config/styles/text";
import { fireStore } from "@firebase/firebase";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Component extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Component",
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

    const userId = props.userId;
    const componentId = props.navigation.state.params.componentId;

    this.state = {
      activities: [],
      activitiesLoading: true,
      activitiesError: null,
      addingServiceInterval: false,
      serviceIntervals: [],
      serviceIntervalsLoading: true,
      serviceIntervalsError: null,
      componentId,
      selectedIndex: 0
    }
  }

  render() {

    if (this.props.componentsLoading) {
      return (
        <Loading/>
      );
    }

    const { goBack, navigate } = this.props.navigation;
    const component = this.props.componentsMap[this.state.componentId];

    if (!component) {
      goBack();
      return (
        <Loading/>
      );
    }


    return (
      <ScrollView>
        <View style={{width: SCREEN_WIDTH}}>
          <CardComponent
            component={component}
            onPress={null}
          />
          <ButtonGroup
            buttons={["Maintenance", "Activities"]}
            containerStyle={{height: 35}}
            onPress={selectedIndex => this.setState({selectedIndex})}
            selectedIndex={this.state.selectedIndex}
          />
          {this.state.selectedIndex === 0 && (
            <View>
              {this.state.addingServiceInterval ? (
                <Card>
                  <ServiceIntervalAdder
                    cancel={() => this.setState({ addingServiceInterval: false })}
                    success={() => {
                      this.setState({ addingServiceInterval: false });
                    }}
                    component={component}
                  />
                </Card>
              ) : (
                <Card style={{padding: 0, margin: 0}}>
                  <TouchableOpacity
                    onPress={() => this.setState({ addingServiceInterval: true })}
                  >
                    <ListItem
                      leftIcon={{
                        name: "ios-add-circle-outline",
                        type: "ionicon",
                        size: 40,
                        color: colors.text
                      }}
                      title={"Add Service Interval"}
                      titleStyle={{color: colors.text}}
                      subtitle={"Maintenance tracking and reminders"}
                      subtitleStyle={{color: colors.text}}
                      style={{
                        padding: 0,
                        margin: 0
                      }}
                    />
                  </TouchableOpacity>
                </Card>
              )}
              {this.state.serviceIntervalsLoading && (
                <ActivityIndicator size={"large"} style={{ padding: 20 }}/>
              )}
              {this.state.serviceIntervals.map((serviceInterval, i) => (
                <CardServiceInterval
                  userId={this.props.userId}
                  componentId={this.state.componentId}
                  serviceInterval={serviceInterval}
                  key={i}
                />
              ))}
            </View>
          )}
          {this.state.selectedIndex === 1 && (
            <View>
              {this.state.activitiesLoading && (
                <Text>Loading</Text>
              )}
              {this.state.activitiesError && <Text>Error: {this.state.activitiesError}</Text>}
              {this.state.activities.length ? this.state.activities.map((activity, i) => (
                <CardActivity
                  activity={activity}
                  bikes={this.props.bikes}
                  onPress={() => navigate("Activity", {activityId: activity.id})}
                  key={i}
                />
            )) : (
              <Card>
                <ListItem
                  leftIcon={{
                    name: "ios-alert",
                    type: "ionicon",
                    size: 40,
                    color: colors.accentPrimary
                  }}
                  title={"No Activities Yet"}
                  titleStyle={{color: colors.text}}
                  subtitle={"Go ride your bike!"}
                  subtitleStyle={{color: colors.text}}
                  style={{
                    padding: 0,
                    borderRadius: 5
                  }}
                />
              </Card>
            )}
            </View>
          )}
        </View>
        <Text/>
      </ScrollView>
    );
  }

  componentDidMount() {
    const userId = this.props.userId;
    const componentId = this.props.navigation.state.params.componentId;

    this.serviceIntervalsListener = fireStore
      .collection("users")
      .doc(userId)
      .collection("components")
      .doc(componentId)
      .collection("serviceIntervals")
      .onSnapshot(serviceIntervals => {
        result = []
        serviceIntervals.forEach(serviceInterval => {
          result.push(serviceInterval.data());
        });
        this.setState({
          serviceIntervals: result,
          serviceIntervalsError: null,
          serviceIntervalsLoading: false
        });
      });
    this.activitiesListener = fireStore
      .collection("users")
      .doc(userId)
      .collection("components")
      .doc(componentId)
      .collection("activities")
      .orderBy("start_date", "desc")
      .limit(10)
      .onSnapshot(activities => {
        result = [];
        activities.forEach(activity => {
          result.push(activity.data());
        });
        this.setState({
          activities: result,
          activitiesLoading: false,
          activitiesError: null
        });
      });
  }

  componentWillUnmount() {
    this.serviceIntervalsListener ? this.serviceIntervalsListener() : null;
    this.activitiesListener ? this.activitiesListener() : null;
  }
}

function mapStoreToProps(store) {
  return {
    bikes: store.bikes.data,
    componentsMap: store.components.map,
    componentsLoading: store.components.loading,
    userId: store.user.session.uid
  }
}

export default connect(mapStoreToProps)(Component);
