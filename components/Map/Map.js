// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  View
} from "react-native";
// Library Imports
import GoogleStaticMap from "react-native-google-static-map";
import { captureRef } from "react-native-view-shot";
import Polyline from "@mapbox/polyline";
import MapView from "react-native-maps";
// Custom Imports
import colors from "@config/styles/colors";
import { fireAuth, fireStorage } from "@firebase/firebase";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class Map extends React.Component {
  constructor(props) {
    super(props);

    const activityId = props.activityId;
    const userId = fireAuth.currentUser.uid;
    const polyline = props.polyline;

    this.state = {
      activityId,
      userId,
      loading: true,
      image: null
    }

    this.state.ref = fireStorage.ref(this.state.userId + "/images/maps/" + this.state.activityId + ".png");

    this.state.ref.getMetadata().then(metadata => {
      if (metadata.size < 30000) {
        this.setState({
          loading: false,
          image: null
        });
      } else {
        this.state.ref.getDownloadURL().then(url => {
          this.setState({
            loading: false,
            image: url
          });
        }).catch(error => {
          this.setState({
            loading: false,
            image: null
          })
        })
      }
    }).catch(error => {
      this.setState({
        loading: false,
        image: null
      });
    });
  }

  render() {
    const {
      loading,
      image
    } = this.state;

    return image ? (
      <Image
        ref={"image"}
        source={{uri: image}}
        style={{height: 160, width: SCREEN_WIDTH}}
      />
    ) : loading ? (
      <ActivityIndicator style={{height: 160, width: SCREEN_WIDTH}}/>
    ) : (
      <GoogleStaticMap
        apiKey={"AIzaSyC8dnOQ6yzgH-6Ih6Ba92xTZjjScYizkPw"}
        hasCenterMarker={false}
        onLoadEnd={() => setTimeout(() => this.saveMap(), 700)}
        path={this.props.polyline}
        pathStyle={{
          color: "0xff0000ff",
          weight: "2"
        }}
        ref={"googleStaticMap"}
        scale={2}
        size={{ width: SCREEN_WIDTH, height: 160 }}
      />
    )
  }

  saveMap() {
    console.warn("saving map");

    captureRef(this.refs.googleStaticMap, {
      format: "png"
    }).then(uri => {
      this.state.ref
        .putFile(uri)
        .then(() => console.log("Success saving image"))
        .catch(error => console.log("Error storing map image: " + error.toString()));
    });
  }
}

export default Map;
