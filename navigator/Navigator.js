// React / React Native Imports
import React from "react";
import { Text } from "react-native";
// Library Imports
import { StackNavigator, TabNavigator, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import FAIcon from "react-native-vector-icons/FontAwesome";
import FoundationIcon from "react-native-vector-icons/Foundation";
import IonIcon from "react-native-vector-icons/Ionicons"
// Custom Imports
import { fireAuth } from "@firebase/firebase";
import Activity from "@screens/Activity/Activity";
import AddComponent from "@screens/AddComponent/AddComponent";
import Bike from "@screens/Bike/Bike";
import BikeBuilder from "@screens/BikeBuilder/BikeBuilder";
import Component from "@screens/Component/Component";
import Components from "@screens/Components/Components";
import ConnectStrava from "@screens/ConnectStrava/ConnectStrava";
import Feed from "@screens/Feed/Feed";
import Home from "@screens/Home/Home";
import More from "@screens/More/More";
import OnBoard from "@screens/OnBoard/OnBoard";
import SignInUp from "@screens/SignInUp/SignInUp";
import colors from "@config/styles/colors";


const CommonScreens = {
  AddComponent: { screen: AddComponent },
  Activity: { screen: Activity },
  Bike: { screen: Bike },
  BikeBuilder: { screen: BikeBuilder },
  Component: { screen: Component },
  ConnectStrava: { screen: ConnectStrava },
  OnBoard: { screen: OnBoard }
}

const HomeStack = StackNavigator({
    ...CommonScreens,
    Home: { screen: Home }
  }, {
    initialRouteName: "Home"
  }
);

const FeedStack = StackNavigator({
    ...CommonScreens,
    Feed: { screen: Feed }
  }, {
    initialRouteName: "Feed"
  }
);

const ComponentsStack = StackNavigator({
    ...CommonScreens,
    Components: { screen: Components },
  }, {
    initialRouteName: "Components"
  }
);

const MoreStack = StackNavigator({
    More: { screen: More },
  }, {
    initialRouteName: "More"
  }
);

const LoggedInNavigator = TabNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: "Garage",
        tabBarIcon: ({ tintColor }) => <FoundationIcon name="home" size={28} color={tintColor}/>,
      },
    },
    Feed: {
      screen: FeedStack,
      navigationOptions: {
        tabBarLabel: "Feed",
        tabBarIcon: ({ tintColor }) => <FAIcon name="road" size={25} color={tintColor}/>,
      },
    },
    Components: {
      screen: ComponentsStack,
      navigationOptions: {
        tabBarLabel: "Parts",
        tabBarIcon: ({ tintColor }) => <FAIcon name="user" size={25} color={tintColor}/>
      },
    },
    More: {
      screen: MoreStack,
      navigationOptions: {
        tabBarLabel: "More",
        tabBarIcon: ({ tintColor }) => <IonIcon name="ios-more" size={30} color={tintColor}/>
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: colors.accentPrimary,
      inactiveTintColor: colors.text,
      showIcon: true,
      style: {
        backgroundColor: colors.background
      },
      lazy: true
    },
    tabBarPosition: "bottom",
    swipeEnabled: false
  }
);

const HomeModalStack = StackNavigator(
  {
    LoggedInNavigator: { screen: LoggedInNavigator },
    BikeBuilder: { screen: BikeBuilder },
    AddComponent: { screen: AddComponent },
    ConnectStrava: { screen: ConnectStrava },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const LoggedOutNavigator = StackNavigator({
    SignInUp: { screen: SignInUp}
  }, {
    initialRouteName: "SignInUp"
  }
);

class Navigator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    }

    this.authListener = fireAuth.onAuthStateChanged(user => {
      if (user) {
        setTimeout(() => this.setState({
          loggedIn: true
        }), 500);
      } else {
        setTimeout(() => this.setState({
          loggedIn: false
        }), 500);
      }
    });
  }

  render() {
    return (this.state.loggedIn) ? (
      <HomeModalStack ref={"navigator"}/>
    ) : (
      <LoggedOutNavigator ref={"navigator"}/>
    )
  }

  componentWillUnmount() {
    this.authListener();
  }

  navigate(routeName, params) {
    this.refs.navigator.dispatch(
      NavigationActions.navigate({
        type: "Navigation/NAVIGATE",
        routeName,
        params
      })
    )
  }
}

export default Navigator;
