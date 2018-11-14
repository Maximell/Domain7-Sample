// React / React Native Imports
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
// Library Imports
import { ListItem } from "react-native-elements";
import ModalDropdown from 'react-native-modal-dropdown';
import IonIcon from  "react-native-vector-icons/Ionicons";
// Custom Imports
import * as ComponentsActions from "@actions/ComponentsActions";
import * as BikesActions from "@actions/BikesActions";
import { getIconForComponentType } from "@config/components/components";
import colors from "@config/styles/colors";
import { getDistanceString } from "@config/util/util";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ListItemComponent = (props) => {
  const bike = props.bike;
  const component = props.component;
  const icon = getIconForComponentType(component.type);

  const dropdownOptions = []
  dropdownOptions.push("Retire");
  bike ? dropdownOptions.push("Uninstall") : null;

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      disabled={props.onPress ? false : true}
    >
      <ListItem
        leftAvatar={{
          source: icon,
        }}
        title={component.name}
        titleStyle={{color: colors.text}}
        subtitle={component.type + " - " + Math.floor((component.time / 3600)) + "hr " + getDistanceString(component.distance, 0)}
        subtitleStyle={{fontSize: 13, color: "grey"}}
        chevron={props.onPress ? false : false}
        chevronColor={colors.text}
        containerStyle={{
          paddingVertical: 0
        }}
        rightIcon={
          <ModalDropdown
            dropdownStyle={{borderWidth: 1, width: 200, height: dropdownOptions.length * 40}}
            dropdownTextStyle={{borderBottomWidth: 1, marginTop: 1}}
            style={ Platform.OS === "ios" ? {} : {
              marginRight: -15
            }}
            onSelect={(index, value) => {
              switch(value) {
                case "Retire":
                  setTimeout(() => {
                    Alert.alert(
                      "Retire Component?",
                      "This will uninstall from all bikes, and delete this component. This action can't be undone.",
                      [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'OK', onPress: () => ComponentsActions.setComponentRetired(component.id)},
                      ]
                    );
                  }, 70);
                  break;
                case "Uninstall":
                  setTimeout(() => {
                    Alert.alert(
                      "Uninstall Component?",
                      "This component will be uninstalled from " + bike.name + ".",
                      [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'OK', onPress: () => BikesActions.removeBikeComponents(bike.id, [component.id])},
                      ]
                    );
                  }, 70);
                  break;
              }
            }}
            options={dropdownOptions}
          >
            <IonIcon name="ios-more" size={30} color={colors.text} style={ Platform.OS === "ios" ? {
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginRight: -15
              } : {
                marginVertical: 10,
                marginHorizontal: 15
              }}
            />
          </ModalDropdown>
        }
        style={{
          padding: 0,
          borderRadius: 5,
        }}
        checkBox={props.checkBox ? props.checkBox : null}
        switch={props.componentSwitch ? props.componentSwitch : null}
        rightElement={props.loading ? (
          <ActivityIndicator/>
        ) : null}
      />
    </TouchableWithoutFeedback>
  );
}

export default ListItemComponent;
