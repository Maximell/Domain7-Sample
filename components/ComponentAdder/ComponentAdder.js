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
import { Button, Card, CheckBox, Input, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
// Custom Imports
import * as ComponentsActions from "@actions/ComponentsActions";
import Dropdown from "@components/Dropdown/Dropdown";
import ComponentAdderSuggestedMaintenance from "@components/ComponentAdderSuggestedMaintenance/ComponentAdderSuggestedMaintenance";
import LearnMore from "@components/LearnMore/LearnMore";
import { componentTypes } from "@config/components/components";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class ComponentAdder extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      category: props.category ? props.category : "",
      type: "",
      time: 0,
      distance: 0,
      isNameValid: true,
      isCategoryValid: true,
      isComponentNew: true,
      isTypeValid: true,
      isTimeValid: true,
      isDistanceValid: true
    }
  }

  componentWillReceiveProps(props) {
    if (props.category && props.category !== this.state.category) {
      this.setState({
        category: props.category,
        type: "",
        name: ""
      });
    }
  }

  render() {

    const category = this.state.category;
    const categoryOptions = Object.keys(componentTypes).map(componentType => {
      return { "name": componentType };
    });
    const types = category !== "" ? Object.keys(componentTypes[category]).map(key => {
      return { "name": componentTypes[category][key]}
    }) : null;

    return (
      <ScrollView>
        <ListItem
          leftIcon={{
            name: "plus",
            type: "evilicon",
            size: 40,
            color: colors.text
          }}
          title={"Add a Component"}
          titleStyle={{color: colors.text}}
          subtitle={null}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          chevron={null}
          chevronColor={colors.text}
          style={{
            padding: 0,
            borderRadius: 5,
          }}
        />
      <View style={{padding: 5}}>
          <Dropdown
            options={categoryOptions}
            onSelect={(index, value) => {
              this.setState({ category: value.name, type: "" });
            }}
            selected={this.state.category ? this.state.category : "Category"}
          />
        </View>
        <View style={{padding: 5}}>
          {this.state.category !== "" && (
            <Dropdown
              options={types}
              onSelect={(index, value) => {
                this.setState({ type: value.name });
              }}
              selected={this.state.type ? this.state.type : "Component Type"}
            />
          )}
        </View>
        {this.state.category !== "" && this.state.type !== "" && (
          <Input
            value={this.state.name}
            keyboardAppearance={"light"}
            autoFocus={false}
            autoCorrect={false}
            returnKeyType={"done"}
            inputStyle={{marginLeft: 10}}
            placeholder={"What we'll call it."}
            label={"Name"}
            containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", alignSelf: "center"}}
            onChangeText={name => this.setState({name})}
            errorMessage={this.state.isNameValid ? null : (
              <Text style={{color: colors.accentPrimary}}>{"Please enter a name"}</Text>
            )}
          />
        )}
        <ListItem
          title={"Is this a new component?"}
          titleStyle={{color: colors.text}}
          subtitle={(
            <LearnMore
              titleText={"Why does this matter?"}
              moreText={"If it isn't a new component you can add the current distance and time of the component."}
            />
          )}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          chevron={false}
          chevronColor={colors.text}
          style={{
            padding: 0,
            borderRadius: 5,
          }}
          checkBox={{
            checked: this.state.isComponentNew,
            checkedColor: colors.accentPrimary,
            uncheckedColor: colors.accentPrimary,
            onPress: () => this.setState({isComponentNew: !this.state.isComponentNew})
          }}
        />
        {!this.state.isComponentNew && (
          <View style={{flexDirection: "row"}}>
            <Input
              value={this.state.time}
              keyboardAppearance={"light"}
              keyboardType="numeric"
              autoFocus={false}
              autoCorrect={false}
              returnKeyType={"done"}
              inputStyle={{marginLeft: 10}}
              placeholder={"(in hours)"}
              label={"Current Time"}
              containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", flex: 1, paddingHorizontal: 5}}
              onChangeText={time => this.setState({ time: time.replace(/[^0-9]/g, '') })}
              errorMessage={this.state.isTimeValid ? null : (
                <Text style={{color: colors.accentPrimary}}>{"Please enter the current time"}</Text>
              )}
            />
            <Input
              value={this.state.distance}
              keyboardAppearance={"light"}
              keyboardType="numeric"
              autoFocus={false}
              autoCorrect={false}
              returnKeyType={"done"}
              inputStyle={{marginLeft: 10}}
              placeholder={"(in kilometers)"}
              label={"Current Distance"}
              containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)", flex: 1, paddingHorizontal: 5}}
              onChangeText={distance => this.setState({ distance: distance.replace(/[^0-9]/g, '') })}
              errorMessage={this.state.isDistanceValid ? null : (
                <Text style={{color: colors.accentPrimary}}>{"Please enter the current distance"}</Text>
              )}
            />
          </View>
        )}
        {this.state.category !== "" && this.state.type !== "" && this.state.name !== "" && (
          <ComponentAdderSuggestedMaintenance
            category={this.state.category}
            type={this.state.type}
            ref={"componentAdderSuggestedMaintenance"}
          />
        )}
        <Button
          buttonStyle={{
            backgroundColor: colors.accentPrimary,
            borderRadius: 2,
            height: 25,
            width: 200
          }}
          containerStyle={{marginTop: 16}}
          activeOpacity={0.8}
          title={"Save"}
          titleStyle={{
            fontSize: 16,
            color: "white",
            fontWeight: "bold"
          }}
          onPress={() => this.addComponent()}
          loading={this.props.componentsLoading}
          disabled={this.props.componentsLoading || this.state.name === "" || this.state.category === "" || this.state.type === ""}
        />
        <Button
          buttonStyle={{
            backgroundColor: colors.accentSecondary,
            borderRadius: 2,
            height: 25,
            width: 100
          }}
          containerStyle={{marginTop: 16}}
          activeOpacity={0.8}
          title={"Cancel"}
          titleStyle={{
            fontSize: 16,
            color: "white",
            fontWeight: "bold"
          }}
          onPress={() => this.props.cancel()}
          disabled={this.props.componentsLoading}
        />
    </ScrollView>
    );
  }

  addComponent() {
    // check that everything is valid

    const {
      name,
      category,
      type,
      time,
      distance,
      isComponentNew
    } = this.state;

    isNameValid = name.length ? true : false;
    isCategoryValid = category.length ? true : false;
    isTypeValid = type.length ? true : false;
    if (!isComponentNew) {
      isTimeValid = parseInt(time) > 0 ? true : false;
      isDistanceValid = parseInt(distance) > 0 ? true : false;
    } else {
      isTimeValid = true;
      isDistanceValid = true;
    }

    allValid = (isNameValid && isCategoryValid && isTypeValid && isTimeValid && isDistanceValid);

    allValid ? ComponentsActions.addComponentWithServiceIntervals(
      this.state.name,
      this.state.category,
      this.state.type,
      isComponentNew ? 0 : parseInt(this.state.time) * 3600,
      isComponentNew ? 0 : parseInt(this.state.distance) * 1000,
      false,
      this.refs.componentAdderSuggestedMaintenance.getSelectedMaintenanceSuggestions(),
      () => {
        this.setState({
          name: "",
          category: this.props.category ? this.props.category : "",
          type: ""
        });
        this.props.success();
      }
    ) : null;

    this.setState({
      isNameValid,
      isCategoryValid,
      isTypeValid,
      isTimeValid,
      isDistanceValid
    });
  }
}

function mapStoreToProps(store) {
  return {
    componentsLoading: store.components.loading,
  }
}

export default connect(mapStoreToProps)(ComponentAdder);
