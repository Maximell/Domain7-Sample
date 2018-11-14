// React / React Native Imports
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  WebView
} from "react-native";
import React from "react";
// Library Imports
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import IonIcon from  "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
// Custom Imports
import * as UserActions from '@actions/UserActions';
import NavBack from "@components/NavBack/NavBack";
import colors from "@config/styles/colors";
import { textColor, textSize, textStyle } from "@config/styles/text";
import store from "@stores/Store";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("./assets/background.jpg");

class ConnectStrava extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Connect Strava",
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

  stravaOauthConfig = "XXX"

  constructor(props) {
    super(props);

    this.state = {
      error: false
    }
  }

  render() {

    const { goBack, navigate } = this.props.navigation;

    if (!(this.props.userStrava && this.props.userStrava.athlete) && !this.props.userLoading && !this.state.error) {
      return (
        <WebView
          source={{uri: this._getStravaConnectUrl()}}
          startInLoadingState={true}
          style={{flex: 10}}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
      );
    } else {
      if (this.props.userLoading) {
        content = (
          <ActivityIndicator
            color={colors.text}
            size={"large"}
            style={{
              padding: 10
            }}
          />
        )
      } else if (this.state.error) {
        content = (
          <Text style={{
            color: colors.text,
            fontSize: 18,
            textAlign: "center",
            padding: 15
          }}>
            Uh Oh - something went wrong. Go back and try again.
          </Text>
        )
      } else {
        content = (
          <Text style={{
            color: colors.text,
            fontSize: 18,
            textAlign: "center",
            padding: 15
          }}>
            Nice! You are all set up with Strava.
          </Text>
        );
      }

      return (
        <ImageBackground
          source={BG_IMAGE}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              height: 150,
              backgroundColor: "transparent",
              justifyContent: "center",
              borderRadius: 8
            }}
          >
            <View style={{flexDirection: "row"}}>
              <Text
                style={{
                  color: colors.textContrast,
                  fontSize: 30
                }}
              >
                STRAVA
              </Text>
            </View>
            <View style={{marginTop: -10, marginLeft: 10}}>
              <Text
                style={{
                  color: colors.textContrast,
                  fontSize: 30
                }}
              >
                CONNECT
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.background,
              width: SCREEN_WIDTH - 30,
              borderRadius: 10,
              alignItems: "center",
              padding: 10
            }}
          >
            <Icon color={colors.text} name={"bicycle"} size={62}/>
            {content}
            {!this.state.error && (
              <Button
                activeOpacity={0.8}
                buttonStyle={{
                  margin: 10,
                  backgroundColor: colors.accentPrimary,
                  borderRadius: 5
                }}
                onPress={() => {
                  goBack();
                  navigate("BikeBuilder", {});
                }}
                textStyle={{
                  color: colors.textContrast
                }}
                title={"Add A Bike"}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                goBack();
              }}
            >
              <Text style={[textStyle.normal, textSize.sm, textStyle.underline]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
    }
  }

  _onNavigationStateChange(webViewState) {
    url = webViewState.url;
    // test if it is our redirect_uri
    if (webViewState.loading === false && url.startsWith(this.stravaOauthConfig.redirect_uri)) {
      code = this._getParameterByName("code", url);
      state = this._getParameterByName("state", url);
      error = this._getParameterByName("error", url);
      if (error || !code) {
        this.setState({ error: true })
        return;
      } else {
        UserActions.stravaTokenExchange(this.stravaOauthConfig.client_id, this.stravaOauthConfig.client_secret, code);
      }
    }
  }

  _getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  _getStravaConnectUrl() {
    return this.stravaOauthConfig.strava_oath_url +
      "?client_id=" + this.stravaOauthConfig.client_id +
      "&response_type=" + this.stravaOauthConfig.response_type +
      "&redirect_uri=" + this.stravaOauthConfig.redirect_uri +
      "&scope=" + this.stravaOauthConfig.scope +
      "&approval_prompt=" + this.stravaOauthConfig.approval_prompt;
  }
}

function mapStoreToProps(store) {
  return {
    userData: store.user.data,
    userLoading: store.user.loading,
    userSession: store.user.session,
    userStrava: store.user.data.integrations.strava
  }
}

export default connect(mapStoreToProps)(ConnectStrava);
