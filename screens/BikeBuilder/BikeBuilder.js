// React / React Native Imports
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from "react-native";
import React from "react";
// Library Imports
import update from 'immutability-helper';
import Communications from "react-native-communications";
import { Button, Card, Input, ListItem } from "react-native-elements"
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from  "react-native-vector-icons/Ionicons";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { connect } from "react-redux";
// Custom Imports
import * as BikesActions from "@actions/BikesActions";
import * as EquipmentActions from "@actions/EquipmentActions";
import * as UserActions from "@actions/UserActions";
import ComponentAdder from "@components/ComponentAdder/ComponentAdder";
import Dropdown from "@components/Dropdown/Dropdown";
import LearnMore from "@components/LearnMore/LearnMore";
import ListComponents from "@components/ListComponents/ListComponents";
import ListItemComponent from "@components/ListItemComponent/ListItemComponent";
import NavBack from "@components/NavBack/NavBack";
import { componentTypes } from "@config/components/components";
import colors from "@config/styles/colors";
import { textColor, textSize } from "@config/styles/text";
import { getDistanceString } from "@config/util/util";
import RatingTracker from "@ratings/RatingTracker";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const STEPINDICATOR_HEIGHT = 140;

class BikeBuilder extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Bike Builder",
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

    const { equipmentId } = props.navigation.state.params;

    const componentCategories = Object.keys(componentTypes);
    const componentsSelected = {};
    for (var i=0; i<componentCategories.length; i++) {
      componentsSelected[componentCategories[i]] = Array(props.components.filter(component => component.category === componentCategories[i]).length).fill(false);
    }

    this.state = {
      name: "",
      brand: "",
      model: "",
      year: "",
      type: "",
      equipment: equipmentId ? props.equipmentMap[equipmentId] : "",
      addingComponent: false,
      addingComponentCategories: null,
      componentsSelected,
      isNameValid: true,
      isBrandValid: true,
      isModelValid: true,
      isYearValid: true,
      isTypeValid: true,
      isEquipmentValid: true,
      step: 0
    }
  }

  _goNext() {
    if (this.state.step === 0) {
      return this.advancePageOne();
    } else if (this.state.step === 1) {
      return this.advancePageTwo();
    }
  }

  _goBack() {
    if (this.state.step === 0) {
      return this.props.navigation.goBack();
    } else {
      return this.setState({step: this.state.step - 1});
    }
  }

  _lastPageVisible() {
    if (this.state.step === 2) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.step !== nextState.step && this.swiper) {
      this.swiper.scrollBy(nextState.step - this.state.step, false);
    }
    const componentCategories = Object.keys(componentTypes);
    for (var i=0; i<componentCategories.length; i++) {
      if (nextProps.components.filter(component => component.category === componentCategories[i]).length > nextState.componentsSelected[componentCategories[i]].length) {
        nextState.componentsSelected[componentCategories[i]].push(true);
      }
    }
  }

  advancePageOne() {
    const {
      name,
      brand,
      model,
      year,
      type
    } = this.state;

    isNameValid = name.length ? true : false;
    isBrandValid = brand.length ? true : false;
    isModelValid = model.length ? true : false;
    isYearValid = year.search(/^(19[5-9]\d|20[0-4]\d|2050)$/) != -1 ? true : false;
    isTypeValid = type !== "";

    allValid = (isNameValid && isBrandValid && isModelValid && isYearValid && isTypeValid);

    this.setState({
      isNameValid,
      isBrandValid,
      isModelValid,
      isYearValid,
      isTypeValid,
      step: allValid ? this.state.step+1 : this.state.step
    });
  }

  advancePageTwo() {

    allValid = true;

    this.setState({
      step: allValid ? this.state.step+1 : this.state.step
    });
  }

  render() {

    const { goBack, navigate } = this.props.navigation;

    componentCategories = Object.keys(componentTypes);
    componentTypesMap = [];
    for (var i=0; i<componentCategories.length; i++) {
      componentTypesMap.push({
        type: componentCategories[i],
        components: this.props.components.filter(component => component.category === componentCategories[i])
      });
    }

    const stepOne = (
      <ScrollView key={0}>
        <View>
          <View style={{
                marginTop: 14,
                marginLeft: 8,
                marginBottom: 8
          }}>
            <Text style={{
                color: "grey",
                fontSize: 12,
                fontWeight: "600",
            }}>
              Connect Strava
            </Text>
          </View>
          <View style={{marginHorizontal: 0, paddingTop: 10, paddingBottom: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "lightgrey" }}>
            {this.props.equipmentLoading ? (
              <ActivityIndicator style={{marginTop: 12, marginBottom: 11}}/>
            ) : this.props.equipment && this.props.equipment.length === 0 ? (
              <Button
                buttonStyle={{
                  backgroundColor: colors.accentPrimary,
                  borderRadius: 5
                }}
                disabled={false}
                activeOpacity={0.7}
                onPress={() => navigate("ConnectStrava")}
                title={"Connect Strava"}
              />
            ) : (
              <View style={{flexDirection: "row", justifyContent: "center"}}>
                <Dropdown
                  style={{
                    flex: 1,
                    width: SCREEN_WIDTH * 0.7
                  }}
                  options={this.props.equipment}
                  onSelect={(index, value) => {
                    for (var i=0; i<this.props.bikes.length; i++) {
                      if (this.props.bikes[i].equipment === value.id) {
                        this.setState({ isEquipmentValid: false });
                        setTimeout(() => this.setState({ isEquipmentValid: true }), 7000);
                        return;
                      }
                    }
                    this.setState({ equipment: value, isEquipmentValid: true });
                  }}
                  selected={this.state.equipment ? this.state.equipment.name : "Strava Equipment"}
                />
                <TouchableOpacity onPress={() => EquipmentActions.syncStravaEquipment()}>
                  <IonIcon name="ios-refresh" size={35} color={colors.text} style={{padding: 10, paddingTop: 12}}/>                  
                </TouchableOpacity>
              </View>
            )}
            {!this.state.isEquipmentValid && (
              <Text style={{color: colors.accentPrimary, textAlign: "center", paddingTop: 5}}>That piece of Strava Equipment is already in use.</Text>
            )}
            <LearnMore
              moreText="Sync your equipment on Strava with Bike Wrench, and automatically get maintenance updates and recommendations for your bike. We recommend it!"
            />
          </View>
          <View style={{
            marginTop: 10,
            marginLeft: 8,
            marginBottom: 8,
          }}>
            <Text style={{
                color: "grey",
                fontSize: 12,
                fontWeight: "600",
            }}>
                Type
            </Text>
          </View>
          <View style={{marginHorizontal: 0, paddingTop: 10, paddingBottom: 10, backgroundColor: "white", alignItems: "center", borderTopWidth: 1, borderTopColor: "lightgrey" }}>
            <Dropdown
              style={{
                alignSelf: "center",
                width: SCREEN_WIDTH * 0.7
              }}
              options={[
                { name: "Road" },
                { name: "Mountain" },
                { name: "Cyclocross" },
                { name: "Gravel" },
                { name: "Commuter" },
                { name: "Track" },
                { name: "Other" }
              ]}
              onSelect={(index, value) => {
                this.setState({ type: value.name });
              }}
              selected={this.state.type ? this.state.type : "Bike Type"}
            />
            {!this.state.isTypeValid && (
              <Text style={{color: colors.accentPrimary, textAlign: "center", paddingTop: 5}}>Please select a type of bike.</Text>
            )}
          </View>
          <View style={{
            marginTop: 14,
            marginLeft: 8,
            marginBottom: 8,
          }}>
            <Text style={{
                color: "grey",
                fontSize: 12,
                fontWeight: "600",
            }}>
                Information
            </Text>
          </View>
          <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={120}>
            <View
              style={{
                marginHorizontal: 0,
                marginTop: 0,
                marginBottom: 4,
                paddingTop: 8,
                paddingBottom: 30,
                alignItems: "center",
                backgroundColor: "white",
                borderTopWidth: 1,
                borderTopColor: "lightgrey"
              }}
            >
              <Input
                value={this.state.name}
                keyboardAppearance="light"
                autoFocus={false}
                autoCorrect={true}
                returnKeyType="next"
                inputStyle={{marginLeft: 10}}
                placeholder={"Name"}
                containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                ref={input => this.nameInput = input}
                onSubmitEditing={() => this.brandInput.focus()}
                onChangeText={name => this.setState({name})}
                errorMessage={this.state.isNameValid ? null : "Please enter a name for your bike."}
                errorStyle={{color: colors.accentPrimary}}
              />
              <Input
                value={this.state.brand}
                keyboardAppearance="light"
                autoFocus={false}
                autoCorrect={true}
                returnKeyType="next"
                inputStyle={{marginLeft: 10}}
                placeholder={"Brand"}
                containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                ref={input => this.brandInput = input}
                onSubmitEditing={() => this.modelInput.focus()}
                onChangeText={brand => this.setState({brand})}
                errorMessage={this.state.isBrandValid ? null : "Please enter the brand of your bike."}
                errorStyle={{color: colors.accentPrimary}}
              />
              <Input
                value={this.state.model}
                keyboardAppearance="light"
                autoFocus={false}
                autoCorrect={true}
                returnKeyType="next"
                inputStyle={{marginLeft: 10}}
                placeholder={"Model"}
                containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                ref={input => this.modelInput = input}
                onSubmitEditing={() => this.yearInput.focus()}
                onChangeText={model => this.setState({model})}
                errorMessage={this.state.isModelValid ? null : "Please enter the brand of your bike."}
                errorStyle={{color: colors.accentPrimary}}
              />
              <Input
                value={this.state.year}
                keyboardAppearance="light"
                keyboardType="numeric"
                autoFocus={false}
                autoCorrect={false}
                returnKeyType="done"
                inputStyle={{marginLeft: 10}}
                placeholder={"Year"}
                containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                ref={input => this.yearInput = input}
                onSubmitEditing={() => this._goNext()}
                onChangeText={year => this.setState({ year: year.replace(/[^0-9]/g, '')})}
                errorMessage={this.state.isYearValid ? null : "Please enter the year of your bike between 1950 and 2050"}
                errorStyle={{color: colors.accentPrimary}}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "lightgrey"
          }}
        >
          <Button
            buttonStyle={{
              backgroundColor: colors.accentPrimary,
              borderRadius: 2
            }}
            disabled={false}
            activeOpacity={0.7}
            onPress={() => this._goNext()}
            loading={this.props.bikesLoading}
            disabled={this.props.bikesLoading}
            title={"Next"}
          />
        </View>
      </ScrollView>
    )

    const stepTwo = (
      <View key={1}>
        <ScrollView stickyHeaderIndices={[0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]}>
          {componentTypesMap.map(componentType => {
            result = [];
            result.push((
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
                  {"Select " + componentType.type}
                </Text>
              </View>
            ));
            result.push((
              <View style={{marginHorizontal: 0, paddingTop: 2, paddingBottom: 2, backgroundColor: "white" }}>
                {componentType.components.map((component, i) => {
                  return (
                    <ListItemComponent
                      component={component}
                      checkBox={{
                        checked: this.state.componentsSelected[componentType.type][i],
                        checkedColor: colors.accentPrimary,
                        uncheckedColor: colors.accentPrimary,
                        onPress: () => this.setState({ componentsSelected: update(this.state.componentsSelected, {[componentType.type]: {[i]: {$set: !this.state.componentsSelected[componentType.type][i]}}})})
                      }}
                      key={i}
                    />
                  )
                })}
              </View>
            ))
            result.push((
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({
                    addingComponent: true,
                    addingComponentCategories: componentType.type
                  });
                }}
              >
                <ListItem
                  title={"Add " + componentType.type + " Component"}
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
            ))
            return result;
          })}
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 10,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "lightgrey"
            }}
          >
            <Button
              buttonStyle={{
                backgroundColor: colors.accentPrimary,
                borderRadius: 2
              }}
              disabled={false}
              activeOpacity={0.7}
              onPress={() => this._goNext()}
              loading={this.props.bikesLoading}
              disabled={this.props.bikesLoading}
              title={"Next"}
            />
          </View>
        </ScrollView>
        <View
          style={{
            zIndex: 1,
            marginTop: this.state.addingComponent ? -(SCREEN_HEIGHT - STEPINDICATOR_HEIGHT) : 0,
            height: SCREEN_HEIGHT - STEPINDICATOR_HEIGHT,
            width: SCREEN_WIDTH,
            backgroundColor: colors.backgroundLight
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ addingComponent: false })}
            style={{ position: "absolute", top: 10, right: 5, zIndex: 2 }}
          >
            <EvilIcon name={"close"} size={28} style={{color: colors.text}}/>
          </TouchableOpacity>
          <ComponentAdder
            success={() => this.setState({ addingComponent: false })}
            cancel={() => this.setState({ addingComponent: false })}
            category={this.state.addingComponentCategories}
          />
        </View>
      </View>
    )

    const stepThree = (
      <ScrollView key={2}>
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
            Bike
          </Text>
        </View>
        <ListItem
          leftAvatar={{
            source: this.state.type === "Mountain" ? require("@assets/images/mountain-bike.png") : require("@assets/images/road-bike.png")
          }}
          title={this.state.name}
          titleStyle={{color: colors.text}}
          subtitle={this.state.year + " " + this.state.brand + " " + this.state.model}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          style={{
            padding: 0,
            borderRadius: 5,
          }}
        />
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
            Strava
          </Text>
        </View>
        <ListItem
          leftAvatar={{
            source: require('@assets/images/strava.png'),
          }}
          title={this.state.equipment ? this.state.equipment.name : "None"}
          titleStyle={{color: colors.text}}
          subtitle={this.state.equipment ? getDistanceString(this.state.equipment.distance, 0) : null}
          subtitleStyle={{fontSize: 13, color: "grey"}}
          style={{
          padding: 0,
          borderRadius: 5,
          }}
        />
        <ListComponents
          navigation={false}
          components={this.getComponentsToAdd()}
        />
        {this.props.bikesError && (
          <Text style={{color: colors.accentPrimary}}>Error: {this.props.bikesError}</Text>
        )}
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "lightgrey"
          }}
        >
          <Button
            buttonStyle={{
              backgroundColor: colors.accentPrimary,
              borderRadius: 2
            }}
            disabled={false}
            activeOpacity={0.7}
            onPress={() => BikesActions.addBike(
              this.state.name,
              this.state.brand,
              this.state.model,
              this.state.year,
              this.state.type,
              0, // time
              this.state.equipment ? this.state.equipment.distance : 0, // distance
              this.state.equipment ? this.state.equipment.id : null,
              this.getComponentsToAdd().map(component => component.id),
              () => {
                goBack();
                RatingTracker.handlePositiveEvent();
              }
            )}
            loading={this.props.bikesLoading}
            disabled={this.props.bikesLoading}
            title={"Save"}
          />
        </View>
      </ScrollView>
    )

    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingTop: 15, paddingBottom: 8, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "lightgrey" }}>
          <StepIndicator
            currentPosition={this.state.step}
            customStyles={{
              height: STEPINDICATOR_HEIGHT,
              stepIndicatorSize: 25,
              currentStepIndicatorSize:30,
              separatorStrokeWidth: 2,
              currentStepStrokeWidth: 3,
              stepStrokeCurrentColor: colors.accentPrimary,
              stepStrokeWidth: 3,
              stepStrokeFinishedColor: colors.accentPrimary,
              stepStrokeUnFinishedColor: colors.textDark,
              separatorFinishedColor: colors.accentPrimary,
              separatorUnFinishedColor: colors.textDark,
              stepIndicatorFinishedColor: colors.accentPrimary,
              stepIndicatorUnFinishedColor: '#ffffff',
              stepIndicatorCurrentColor: '#ffffff',
              stepIndicatorLabelFontSize: 13,
              currentStepIndicatorLabelFontSize: 13,
              stepIndicatorLabelCurrentColor: colors.accentPrimary,
              stepIndicatorLabelFinishedColor: '#ffffff',
              stepIndicatorLabelUnFinishedColor: colors.textDark,
              labelColor: '#999999',
              labelSize: 13,
              currentStepLabelColor: colors.accentPrimary
            }}
            labels={["General", "Components", "Review"]}
            onPress={step => {
              this.setState({ addingComponent: false });
              if (step > this.state.step) {
                this._goNext();
              } else if (step < this.state.step) {
                this._goBack();
              }
            }}
            stepCount={3}
          />
        </View>
        <Swiper
          index={0}
          loop={false}
          ref={swiper => this.swiper = swiper}
          scrollEnabled={false}
          showsButtons={false}
          showsPagination={false}
        >
          {stepOne}
          {stepTwo}
          {stepThree}
        </Swiper>
      </View>
    );
  }

  getComponentsToAdd() {
    const componentCategories = Object.keys(componentTypes);
    const componentsToAdd = [];
    for (var i=0; i<componentCategories.length; i++) {
      componentsForCategory = this.props.components.filter(component => component.category === componentCategories[i]);
      selectedComponentForCategory = componentsForCategory.filter((component, i) => this.state.componentsSelected[component.category][i]);
      componentsToAdd.push(...selectedComponentForCategory);
    }
    return componentsToAdd;
  }
}

const styles = StyleSheet.create({
  componentCardContainer: {
    width: SCREEN_WIDTH * 0.95
  }
})

function mapStoreToProps(store) {
  components = store.components.data.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) {
        return 0;
      } else if (!a.createdAt) {
        return -1;
      } else if (!b.createdAt) {
        return 1;
      } else {
        return a.createdAt >= b.createdAt ? 1 : -1;
      }
    });
  return {
    bikes: store.bikes.data,
    bikesError: store.bikes.error,
    bikesLoading: store.bikes.loading,
    components,
    equipment: store.equipment.data,
    equipmentMap: store.equipment.map,
    equipmentLoading: store.equipment.loading,
    userStrava: store.user.data.integrations.strava,
    drivetrainComponents: components.filter((component) => component.category === "Drivetrain"),
    suspensionComponents: components.filter((component) => component.category === "Suspension"),
    bearingComponents: components.filter((component) => component.category === "Bearings"),
    wheelComponents: components.filter((component) => component.category === "Wheels/Tires"),
    brakeComponents: components.filter((component) => component.category === "Brakes"),
    contactPointComponents: components.filter((component) => component.category === "Contact Points"),
    lightComponents: components.filter((component) => component.category === "Accessories"),
    otherComponents: components.filter((component) => component.category === "Other"),
  }
}

export default connect(mapStoreToProps)(BikeBuilder);
