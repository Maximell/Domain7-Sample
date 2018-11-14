// React / React Native Imports
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import React from "react";
// Library Imports
import update from 'immutability-helper';
import { Button, ButtonGroup, Card, ListItem } from "react-native-elements";
import IonIcon from  "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
// Custom Imports
import * as BikesActions from "@actions/BikesActions";
import CardActivity from "@components/CardActivity/CardActivity";
import CardBike from "@components/CardBike/CardBike";
// import ComponentAdder from "@components/ComponentAdder/ComponentAdder";
import ComponentAdderPopup from "@components/ComponentAdderPopup/ComponentAdderPopup";
import ListComponents from "@components/ListComponents/ListComponents";
import NavBack from "@components/NavBack/NavBack";
import colors from "@config/styles/colors";
import { textColor, textStyle } from "@config/styles/text";
import { fireStore } from "@firebase/firebase";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Bike extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Bike",
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

    this.state = {
      activities: [],
      activitiesLoading: true,
      activitiesError: null,
      addingComponent: false,
      addingComponentCategories: null,
      bikeId: props.navigation.state.params.bikeId,
      linkingComponents: false,
      selectedIndex: 0
    }
  }

  render() {

    const { navigate } = this.props.navigation;

    const bike = this.props.bikesMap[this.state.bikeId];
    const currentComponents = bike.components.filter(componentId => this.props.componentsMap[componentId] ? true : false).map(componentId => this.props.componentsMap[componentId]);
    const linkableComponents = this.props.components.filter(component => !bike.components.includes(component.id));
    return (
      <View>
        <ScrollView style={{height: "100%"}}>
          <View style={{width: SCREEN_WIDTH}}>
            <CardBike
              bike={bike}
              onPress={null}
            />
            <ButtonGroup
              buttons={["Components", "Activities"]}
              containerStyle={{height: 35}}
              onPress={selectedIndex => {
                this.setState({
                  linkingComponents: false,
                  selectedIndex
                });
              }}
              selectedIndex={this.state.selectedIndex}
            />
            {this.state.selectedIndex === 0 && (
              <View>
                {this.state.linkingComponents ? (
                  <View>
                    <TouchableWithoutFeedback
                      onPress={() => BikesActions.addBikeComponents(
                        bike.id,
                        this.refs.componentList.getComponentsToAdd().map(component => component.id),
                        () => {
                          this.setState({
                            linkingComponents: false
                          });
                          this.refs.componentList.refreshSelectedComponents();
                        }
                      )}
                    >
                      <ListItem
                        title={"Save Components"}
                        titleStyle={[textColor.normal]}
                        leftIcon={{
                          name: "check",
                          type: "evilicon",
                          size: 40,
                          color: colors.text
                        }}
                        style={{
                          padding: 0
                        }}
                      />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => this.setState({ linkingComponents: false })}
                    >
                      <ListItem
                        title={"Cancel"}
                        titleStyle={[textColor.normal]}
                        leftIcon={{
                          name: "close-o",
                          type: "evilicon",
                          size: 40,
                          color: colors.text
                        }}
                        style={{
                          padding: 0
                        }}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({ linkingComponents: this.state.linkingComponents ? false : true})}
                  >
                    <ListItem
                      title={"Add Components"}
                      titleStyle={[textColor.normal]}
                      leftIcon={{
                        name: "plus",
                        type: "evilicon",
                        size: 40,
                        color: colors.text
                      }}
                      style={{
                        padding: 0
                      }}
                    />
                  </TouchableWithoutFeedback>
                )}
                <ListComponents
                  bike={bike}
                  components={currentComponents}
                  linkableComponents={linkableComponents}
                  editable={this.state.linkingComponents ? true : false}
                  navigation={this.props.navigation}
                  onAddingComponent={(componentCategory) => this.setState({ addingComponent: true, addingComponentCategories: componentCategory })}
                  ref={"componentList"}
                />
              </View>
            )}
            {this.state.selectedIndex === 1 && (
              <View style={{width: SCREEN_WIDTH}}>
                {this.state.activitiesLoading ? (
                  <ActivityIndicator size={"large"}/>
                ) : this.state.activitiesError ? (
                  <Text style={{color: colors.accentPrimary, textAlign: "center"}}>Error: {this.state.activitiesError.toString()}</Text>
                ) : (this.state.activities && this.state.activities.length) ? this.state.activities.map((activity, i) => (
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
        </ScrollView>
        <ComponentAdderPopup
          addingComponent={this.state.addingComponent}
          addingComponentCategories={this.state.addingComponentCategories}
          success={() => this.setState({ addingComponent: false })}
          cancel={() => this.setState({ addingComponent: false })}
        />
      </View>
    );
  }

  componentDidMount() {
    const userId = this.props.userId;
    const bikeId = this.props.navigation.state.params.bikeId;

    this.activitiesListener = fireStore
      .collection("users")
      .doc(userId)
      .collection("bikes")
      .doc(bikeId)
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
        })
      })
  }

  componentWillUnmount() {
    this.activitiesListener();
  }
}

function mapStoreToProps(store) {
  return {
    bikes: store.bikes.data,
    bikesMap: store.bikes.map,
    bikesLoading: store.bikes.loading,
    components: store.components.data.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) {
        return 0;
      } else if (!a.createdAt) {
        return -1;
      } else if (!b.createdAt) {
        return 1;
      } else {
        return a.createdAt >= b.createdAt ? 1 : -1;
      }
    }),
    componentsMap: store.components.map,
    componentsLoading: store.componentsLoading,
    userId: store.user.session.uid
  }
}

export default connect(mapStoreToProps)(Bike);
