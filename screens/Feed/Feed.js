// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
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
import CardActivity from "@components/CardActivity/CardActivity";
import CardHistory from "@components/CardHistory/CardHistory";
import Loading from "@components/Loading/Loading";
import colors from "@config/styles/colors";
import { fireStore } from "@firebase/firebase";
import RatingTracker from "@ratings/RatingTracker";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Feed extends React.Component {
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
    super(props);

    this.state = {
      activities: [],
      activitiesLoading: true,
      dateRangeStart: null,
      dateRangeEnd: new Date(),
      histories: [],
      historiesLoading: true,
      weekCounter: 0
    };

    props.navigation.setParams({
      addMenuToggle: () => this.refs.addMenu.toggle()
    });
  }

  renderItem(item, i) {
    const { navigate } = this.props.navigation;

    switch (item.type) {
      case "Ride":
        return (
          <CardActivity
            key={i}
            activity={item}
            bikes={this.props.bikes}
            onPress={() => navigate("Activity", {activityId: item.id})}
          />
        )
      case "Loading":
        return (
          <ActivityIndicator key={i} size="large" style={{padding: 20}}/>
        );
      case "PreviousWeek":
        return (
          <TouchableOpacity
            key={i}
            onPress={() => this.changeDateRangeByWeek(-1)}
            style={{ alignItems: "center" }}
          >
            <Text>
              <IonIcon name="ios-arrow-up" size={40} color={colors.text}/>
            </Text>
          </TouchableOpacity>
        );
      case "NextWeek":
        return (
          <TouchableOpacity
            key={i}
            onPress={() => this.changeDateRangeByWeek(1)}
            style={{ alignItems: "center" }}
          >
            <Text>
              <IonIcon name="ios-arrow-down" size={40} color={colors.text}/>
            </Text>
          </TouchableOpacity>
        )
      default:
        return (
          <CardHistory
            key={i}
            bikesMap={this.props.bikesMap}
            componentsMap={this.props.componentsMap}
            history={item}
            navigation={this.props.navigation}
          />
        );
    }
  }

  render() {

    if (!this.props.userData || !this.props.userSession) {
      return (
        <Loading/>
      )
    }

    feed = [];
    if (this.state.weekCounter > 1 && !(this.state.historiesLoading || this.state.activitiesLoading)) {
      feed.push({ type: "PreviousWeek" });
    }

    if (!this.state.activitiesLoading && !this.state.historiesLoading) {
      feed = feed.concat(this.state.activities);
      // TODO: this is where we will group histories together
      feed = feed.concat(this.state.histories);
    }

    feed.sort((a, b) => {
      return new Date(b.start_date || b.createdAt) - new Date(a.start_date || a.createdAt);
    });
    (this.state.historiesLoading || this.state.activitiesLoading) ?
      feed.push({ type: "Loading" }) :
      feed.push({ type: "NextWeek" });

      return (
        <View style={{height: "100%"}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                colors={[colors.text]}
                refreshing={this.props.activitiesLoading}
                onRefresh={() => {
                  ActivitiesActions.syncActivities();
                  RatingTracker.handlePositiveEvent();
                }}
              />
            }
          >
            {feed.map((feedItem, i) => this.renderItem(feedItem, i))}
          </ScrollView>
          <AddMenu
            navigation={this.props.navigation}
            ref={"addMenu"}
          />
        </View>
      )
  }

  componentDidMount() {
    this.changeDateRangeByWeek(1);
  }

  componentWillUnmount() {
    this.historiesListener();
    this.activitiesListener();
  }

  changeDateRangeByWeek(numberOfWeeks) {

    daysToChange = numberOfWeeks * 7;

    weekCounter = this.state.weekCounter+numberOfWeeks;

    if (daysToChange > 0) {
      dateRangeStart = new Date(this.state.dateRangeEnd);
      dateRangeEnd = new Date(dateRangeStart);
      dateRangeEnd.setDate(dateRangeEnd.getDate() - daysToChange);
    } else if (daysToChange < 0) {
      dateRangeEnd = new Date(this.state.dateRangeStart);
      dateRangeStart = new Date(dateRangeEnd);
      dateRangeStart.setDate(dateRangeStart.getDate() - daysToChange);
    } else {
      dateRangeStart = this.state.dateRangeStart;
      dateRangeEnd = this.state.dateRangeEnd;
    }


    this.historiesListener ? this.historiesListener() : null;
    this.historiesListener = fireStore
      .collection("users")
      .doc(this.props.userSession.uid)
      .collection("history")
      .where("createdAt", "<", dateRangeStart)
      .where("createdAt", ">", dateRangeEnd)
      .orderBy("createdAt", "desc")
      .onSnapshot(histories => {
        result = [];
        histories.forEach(history => result.push(history.data()));
        this.setState({
          histories: result,
          historiesLoading: false
        });
      });

    this.activitiesListener ? this.activitiesListener() : null;
    this.activitiesListener = fireStore
      .collection("users")
      .doc(this.props.userSession.uid)
      .collection("activities")
      .where("start_date", "<", dateRangeStart)
      .where("start_date", ">", dateRangeEnd)
      .orderBy("start_date", "desc")
      .onSnapshot((activities) => {
        result = [];
        activities.forEach(activity => result.push(activity.data()));
        this.setState({
          activities: result,
          activitiesLoading: false,
        });
      });
    this.setState({
      dateRangeStart,
      dateRangeEnd,
      weekCounter,
      histories: [],
      historiesLoading: true,
      activities: [],
      activitiesLoading: true
    });
  }
}

function mapStoreToProps(store) {
  return {
    activitiesLoading: store.activities.loading,
    bikes: store.bikes.data,
    bikesMap: store.bikes.map,
    componentsMap: store.components.map,
    userData: store.user.data,
    userSession: store.user.session
  }
}

export default connect(mapStoreToProps)(Feed);
