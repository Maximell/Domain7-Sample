// React / React Native Imports
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Library Imports
import update from 'immutability-helper';
import { Card, ListItem } from "react-native-elements";
import EvilIcon from "react-native-vector-icons/EvilIcons";
// Custom Imports
import CardComponent from "@components/CardComponent/CardComponent";
import ComponentAdder from "@components/ComponentAdder/ComponentAdder";
import { componentTypes } from "@config/components/components";
import colors from "@config/styles/colors";
import { textColor, textSize } from "@config/styles/text";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ListComponentsDivider = (props) => {

  const { title } = props;

  return (
    <View style={{
      paddingTop: 14,
      paddingLeft: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "lightgrey",
      backgroundColor: colors.background,
    }}>
      <Text style={{
        color: "grey",
        fontSize: 12,
        fontWeight: "600",
      }}>
        {title}
      </Text>
    </View>
  );
}

class ListComponents extends React.Component {

  constructor(props) {
    super(props);

    const componentCategories = Object.keys(componentTypes);
    componentsSelected = {};
    if (props.linkableComponents) {
      for (var i=0; i<componentCategories.length; i++) {
        componentsSelected[componentCategories[i]] = Array(props.linkableComponents.filter(component => component.category === componentCategories[i]).length).fill(false);
      }
    }

    this.state = {
      addingComponent: false,
      addingComponentCategories: null,
      componentsSelected
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const componentCategories = Object.keys(componentTypes);
    for (var i=0; i<componentCategories.length; i++) {
      if (nextProps.components && nextState.componentsSelected && nextState.componentsSelected[componentCategories[i]] && nextProps.components.filter(component => component.category === componentCategories[i]).length > nextState.componentsSelected[componentCategories[i]].length) {
        nextState.componentsSelected[componentCategories[i]].push(true);
      }
    }
  }

  render() {
    const { components, linkableComponents } = this.props;

    const componentCategories = [];
    const linkableComponentCategories = [];
    const componentTypeKeys = Object.keys(componentTypes);
    for (var i=0; i<componentTypeKeys.length; i++) {
      components ? componentCategories.push({
        type: componentTypeKeys[i],
        components: components.filter((component) => component.category === componentTypeKeys[i])
      }) : null;
      linkableComponents ? linkableComponentCategories.push({
        type: componentTypeKeys[i],
        components: linkableComponents.filter((component) => component.category === componentTypeKeys[i])
      }) : null;
    }

    const selectedComponents = this.props.editable ? linkableComponentCategories : componentCategories;

    return (
      <View>
        {selectedComponents.map((componentCategory, i) => (
          <View key={i}>
            <ListComponentsDivider title={componentCategory.type}/>
            {componentCategory.components.map((component, i) => (
              <CardComponent
                activity={this.props.activity ? this.props.activity : null}
                bike={this.props.bike ? this.props.bike : null}
                checkBox={this.props.editable ? {
                  checked: this.props.linkableComponents ? this.state.componentsSelected[componentCategory.type][i] : false,
                  checkedColor: colors.accentPrimary,
                  uncheckedColor: colors.accentPrimary,
                  onPress: () => this.setState({ componentsSelected: update(this.state.componentsSelected, {[componentCategory.type]: {[i]: {$set: !this.state.componentsSelected[componentCategory.type][i]}}})})
                } : null}
                component={component}
                key={i}
                onPress={this.props.navigation && !this.props.editable ? () => this.props.navigation.navigate("Component", {componentId: component.id}) : null}
                componentSwitch={this.props.componentSwitch}
              />
            ))}
            {this.props.editable && (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.onAddingComponent(componentCategory.type);
                }}
              >
                <ListItem
                  title={"Add " + componentCategory.type + " Component"}
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
          </View>
        ))}
      </View>
    );
  }

  getComponentsToAdd() {
    const componentCategories = Object.keys(componentTypes);
    const componentsToAdd = [];
    for (var i=0; i<componentCategories.length; i++) {
      componentsForCategory = this.props.linkableComponents.filter(component => component.category === componentCategories[i]);
      selectedComponentForCategory = componentsForCategory.filter((component, i) => this.state.componentsSelected[component.category][i]);
      componentsToAdd.push(...selectedComponentForCategory);
    }
    return componentsToAdd;
  }

  refreshSelectedComponents() {
    const componentCategories = Object.keys(componentTypes);
    componentsSelected = {};
    if (this.props.linkableComponents) {
      for (var i=0; i<componentCategories.length; i++) {
        componentsSelected[componentCategories[i]] = Array(props.linkableComponents.filter(component => component.category === componentCategories[i]).length).fill(false);
      }
    }
    this.setState({
      componentsSelected
    });
  }
}

export default ListComponents;
