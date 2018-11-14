// React / React Native Imports
import React from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
// Library Imports
import { Button } from "react-native-elements"
import Swiper from "react-native-swiper";
import IonIcon from  "react-native-vector-icons/Ionicons";
// Custom Imports
import * as UserActions from "@actions/UserActions";
import colors from "@config/styles/colors";
import { textSize, textColor } from "@config/styles/text";


class OnBoard extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false
  };

  render() {

    const { goBack } = this.props.navigation;

    const slides = [
      {
        title: "Hi, We\'re BikeWrench",
        description: "You might not be able to tell from behind that screen, but we\'re real happy that you are here.\n\nNow, swipe to start the tour.",
        img: require("./assets/icon.png")
      }, {
        title: "Your Garage",
        description: "The home page of BikeWrench. Here you can check out the maintenance status of your bikes at one glance, to see if anything needs attention.",
        img: require("./assets/home-ios.png")
      }, {
        title: "The Feed",
        description: "The place to see exactly what bike-related stuff you have been up to - both on and off the bike. Get some new tires? Replace a bike\'s worn-out chain? You can see that here mixed in with your activities from Strava.",
        img: require("./assets/feed-ios.png")
      }, {
        title: "Parts Bin",
        description: "The list of all your parts. Each component can be installed on as many bikes as they are used on. Share wheelsets? Want to know when to recharge your Garmin? Add it to as many bikes as you use it on.",
        img: require("./assets/parts-ios.png")
      },
      {
        title: "Multiple Wheelsets?",
        description: "No problem. Go to the activity, and toggle which components you used that day.",
        img: require("./assets/activity-ios.png")
      },
      // Coming soon
      // {
      //   title: "Order Parts and Book Services",
      //   description: "We have partnered with the best online and local bike stores to make it seamless for you to keep that bike rolling like new.",
      //   img: null
      // },
      {
        title: "Let\'s Get Started!",
        description: "Once you click finish, take the first step to setting up BikeWrench by connecting to your Strava account.",
        img: require("./assets/begin-ios.png")
      }
    ];
    return (
      <Swiper showsPagination={true} showsButtons={false} loop={false} activeDotColor={colors.accentPrimary} dotColor={colors.iconUnselected} height="100%" width="100%">
        {slides.map((slide, i) => (
          <View
            style={{
              backgroundColor: colors.backgroundColor,
              flex: 1
            }}
            key={i}
          >
            <View style={{flex: 1}}>
              <Image
                style={{
                  width: Dimensions.get("window").width * 0.8,
                  height: Dimensions.get("window").width * 0.8,
                  resizeMode: "contain",
                  margin: Dimensions.get("window").width * 0.1,
                  borderRadius: Dimensions.get("window").width * 0.4
                }}
                source={slide.img}
              />
            </View>
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
              <Text style={[textSize.xl, textColor.normal, {textAlign: "center", paddingBottom: 20}]}>{slide.title}</Text>
              <Text style={[textSize.md, textColor.normal, {textAlign: "center", paddingLeft: Dimensions.get("window").width*.1, paddingRight: Dimensions.get("window").width*.1, paddingBottom: 20}]}>{slide.description}</Text>
              {i==slides.length-1 && (
                <Button
                  activeOpacity={0.7}
                  buttonStyle={{
                    backgroundColor: colors.accentPrimary,
                    borderRadius: 5,
                    paddingLeft: 25,
                    paddingRight: 25
                  }}
                  containerStyle={{padding: 40}}
                  onPress={() => {
                    UserActions.updateMilestoneOnBoard(true);
                    goBack();
                  }}
                  title="Got it"
                  titleStyle={textSize.lg}
                />
              )}
            </View>
            {i==slides.length-1 && (
              <TouchableOpacity
                onPress={() => {
                  UserActions.updateMilestoneOnBoard(true);
                  goBack();
                }}
                style={{position: "absolute", top: 10, right: 20}}
              >
                <IonIcon name="ios-close" size={60} color={colors.text}/>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>
    );
  }
}

export default OnBoard;
