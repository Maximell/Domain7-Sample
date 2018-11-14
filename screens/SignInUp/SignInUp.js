// React / React Native Imports
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from "react-native";
// Library Imports
import Communications from "react-native-communications";
import { Input, Button } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome";
import SimpleIcon from "react-native-vector-icons/SimpleLineIcons";
import { connect } from "react-redux";
// Custom Imports
import * as UserActions from "@actions/UserActions";
import colors from "@config/styles/colors";


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("./assets/background.jpg");

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={selected && styles.selected}/>
    </View>
  );
};

class SignInUp extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      allowEmails: false,
      selectedCategory: 0,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  selectCategory(selectedCategory) {
    LayoutAnimation.easeInEaseOut();
    UserActions.clearError();
    this.setState({
      selectedCategory
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  login() {
    const {
      email,
      password,
    } = this.state;

    isEmailValid = this.validateEmail(email) || this.emailInput.shake();
    isPasswordValid = password.length >= 8 || this.passwordInput.shake();

    LayoutAnimation.easeInEaseOut();
    UserActions.clearError();
    this.setState({
      isEmailValid,
      isPasswordValid,
    });
    if (isEmailValid && isPasswordValid) {
      UserActions.signIn(email, password);
    }
  }

  signUp() {
    const {
      email,
      password,
      passwordConfirmation,
    } = this.state;

    isEmailValid = this.validateEmail(email) || this.emailInput.shake();
    isPasswordValid = password.length >= 8 || this.passwordInput.shake();
    isConfirmationValid = password == passwordConfirmation || this.confirmationInput.shake();

    LayoutAnimation.easeInEaseOut();
    UserActions.clearError();
    this.setState({
      isEmailValid,
      isPasswordValid,
      isConfirmationValid
    });
    if (isEmailValid && isPasswordValid && isConfirmationValid) {
      UserActions.signUp(email, password);
    }
  }

  render() {
    const {
      selectedCategory,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          <View>
            <KeyboardAvoidingView contentContainerStyle={styles.loginContainer} behavior="position">
              <View style={styles.titleContainer}>
                <View style={{flexDirection: "row"}}>
                  <Text style={styles.titleText}>BIKE</Text>
                </View>
                <View style={{marginTop: -10, marginLeft: 10}}>
                  <Text style={styles.titleText}>WRENCH</Text>
                </View>
              </View>
              <View style={{flexDirection: "row"}}>
                <Button
                  disabled={this.props.loading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(0)}
                  containerStyle={{flex: 1}}
                  titleStyle={[styles.categoryText, isLoginPage && styles.selectedCategoryText]}
                  title={"Login"}
                />
                <Button
                  disabled={this.props.loading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(1)}
                  containerStyle={{flex: 1}}
                  titleStyle={[styles.categoryText, isSignUpPage && styles.selectedCategoryText]}
                  title={"Sign up"}
                />
              </View>
              <View style={styles.rowSelector}>
                <TabSelector selected={isLoginPage}/>
                <TabSelector selected={isSignUpPage}/>
              </View>
              <View style={styles.formContainer}>
                <Input
                  leftIcon={
                    <Icon
                      name="envelope-o"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{backgroundColor: "transparent"}}
                    />
                  }
                  value={email}
                  keyboardAppearance="light"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  inputStyle={{marginLeft: 10}}
                  placeholder={"Email"}
                  containerStyle={{borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                  ref={input => this.emailInput = input}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  onChangeText={email => this.setState({ email })}
                  errorMessage={isEmailValid ? null : "Please enter a valid email address"}
                  errorStyle={{ color: colors.accentPrimary }}
                />
                <Input
                  leftIcon={
                    <SimpleIcon
                      name="lock"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{backgroundColor: "transparent"}}
                    />
                  }
                  value={password}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType={isSignUpPage ? "next" : "done"}
                  blurOnSubmit={true}
                  containerStyle={{marginTop: 16, borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                  inputStyle={{marginLeft: 10}}
                  placeholder={"Password"}
                  ref={input => this.passwordInput = input}
                  onSubmitEditing={() => isSignUpPage ? this.confirmationInput.focus() : this.login()}
                  onChangeText={(password) => this.setState({password})}
                  errorMessage={isPasswordValid ? null : "Please enter at least 8 characters"}
                  errorStyle={{ color: colors.accentPrimary }}
                />
                {isSignUpPage &&
                  <Input
                    icon={
                      <SimpleIcon
                        name="lock"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{backgroundColor: "transparent"}}
                      />
                    }
                    value={passwordConfirmation}
                    secureTextEntry={true}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType={"done"}
                    blurOnSubmit={true}
                    containerStyle={{marginTop: 16, borderBottomColor: "rgba(0, 0, 0, 0.38)"}}
                    inputStyle={{marginLeft: 10}}
                    placeholder={"Confirm password"}
                    ref={input => this.confirmationInput = input}
                    onSubmitEditing={this.signUp}
                    onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                    errorMessage={isConfirmationValid ? null : "Please enter the same password"}
                    errorStyle={{ color: colors.accentPrimary }}
                  />}
                  <View>
                    <Text style={{color: colors.accentPrimary, marginTop: 16, textAlign: "center"}}>
                      {this.props.error ? this.props.error.toString() : ""}
                    </Text>
                  </View>
                  <Button
                    buttonStyle={styles.loginButton}
                    containerStyle={{marginTop: 16, flex: 0}}
                    activeOpacity={0.8}
                    title={isLoginPage ? "LOGIN" : "SIGN UP"}
                    onPress={isLoginPage ? this.login : this.signUp}
                    titleStyle={styles.loginTextButton}
                    loading={this.props.loading}
                    disabled={this.props.loading}
                  />
              </View>
            </KeyboardAvoidingView>
            <View style={styles.helpContainer}>              
              <Button
                title={"Privacy Policy"}
                titleStyle={{color: "white"}}
                buttonStyle={{backgroundColor: "transparent"}}
                underlayColor="transparent"
                onPress={() => Communications.web("https://getbikewrench.com/privacy-policy.html")}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowSelector: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectorContainer: {
    flex: 1,
    alignItems: "center",
  },
  selected: {
    position: "absolute",
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: "white",
    backgroundColor: "white",
  },
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loginTextButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: colors.accentPrimary,
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  titleContainer: {
    height: 150,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems:"center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    textAlign: "center",
    color: "white",
    fontSize: 24,
    backgroundColor: "transparent",
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: "white",
    fontSize: 30,
  },
  helpContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStoreToProps(store) {
  return {
    loading: store.user.loading,
    error: store.user.error
  }
}

export default connect(mapStoreToProps)(SignInUp);
