/*jshint esversion: 6 */

import React from "react";
import {
  StyleSheet,
  Alert,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; import Loader from "../utils/loader";
import apiRequest from "../utils/api.request";
import APIConfig from "../config/api.config";
import getObjectForKey from "../utils/title.localization";
import Analytics from "appcenter-analytics";
import { USERREGISTRATION } from "../utils/app.constant";
import AppSpeak from "../utils/app.speak";
import NetInfo from "@react-native-community/netinfo";
import {
  subscriptionKey,
  getUserRegistrationAPI
} from "../utils/app.create.api";
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");

var topspace = DEVICE_HEIGHT * 0.02


async function MiniOfflineSign() {
  var alertMessage = await getObjectForKey(
    APPCONSTANTS.CHECK_INTERNET_CONNECTION
  );
  Alert.alert(alertMessage);
  return (
    <View style={styles.offlineContainer}>
      <View style={styles.offlineNotification}>
        <Text style={styles.offlineText}>
          {await getObjectForKey(APPCONSTANTS.NO_INTERNET_MESSAGE)}
        </Text>
      </View>
      <View style={styles.offlineIconContainer}>
        <Image
          style={styles.offlineIcon}
          source={require("../../assets/images/no_connection.png")}
        />
      </View>
    </View>
  );
}

export default class AskUserName extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      TextInputName: "",
      loading: false,
      ask_name: "",
      user_Language: "",
      user_Number: "",
      askNameTag: "",
      ctnbtncolor: "#06866D",
    };
    appSpeak = new AppSpeak();
  }

  async componentDidMount() {
    var labelText = await getObjectForKey("ASK_USER_NAME");
    var labelContinue = await getObjectForKey("CONTINUE");
    this.setState({
      ask_name: labelText,
      continueTag: labelContinue,
    });
    var noText = await getObjectForKey("ASK_USER_NAME");
    appSpeak.readMyText(noText, USERREGISTRATION.ASK_USER_NAME, false);

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    var lang = "";
    var num = "";
    try {
      lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
      num = await AsyncStorage.getItem("DEFAULT_NUMBER");
    } catch (error) { }
    this.setState({
      user_Language: lang,
      user_Number: num
    });
  }

  async componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };
  componentDidUnMount() {
    this.setState({ loading: false });
  }

  async saveData() {
    const name = this.state.TextInputName;
    const number = this.state.user_Number;
    const lang = this.state.user_Language;
    var data = {
      name: name,
      phone: number,
      language: lang
    };
    var baseURL = await getUserRegistrationAPI();
    var subscriptionKeyValue = await subscriptionKey("USER_REGISTRATION_API");
    var response = await apiRequest(baseURL, data, true, subscriptionKeyValue);
    this.setState({ loading: false });
    if (response.length != 0) {
      this.props.navigation.navigate("UserRegistration");
    } else {
      Analytics.trackEvent(USERREGISTRATION.REGISTRATION_FAILED, {
        "USERREGISTRATION-ERROR_MESSAGE": JSON.stringify(response)
      });
      Alert.alert("Registration failed !");
    }
  }

  CheckTextInputIsEmptyOrNot = () => {
    const { TextInputName } = this.state;

    if (TextInputName == "") {
      Alert.alert("Please enter your name");
      this.setState({ ctnbtncolor: "red" });
    } else {
      this.saveData();
      this.setState({ ctnbtncolor: "#06866D" });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    } else {
      return (
        <View style={{ justifyContent: "center", height: DEVICE_HEIGHT }}>
          {this.keyboardAvoid()}
          <Loader loading={this.state.loading} />
        </View>
      );
    }
  }
  userInput() {
    return (
      <View style={styles.inputNo}>
        {this.inputBar()}
        <TouchableOpacity
          style={[
            styles.btnSubmit,
            { backgroundColor: this.state.ctnbtncolor }
          ]}
          onPress={this.CheckTextInputIsEmptyOrNot}
        >
          <Text style={styles.btntext}>{this.state.continueTag}</Text>
          <Image
            style={styles.submitImg}
            source={require("../../assets/img/front.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
  header() {
    return (
      <View>
        {this.renderCallButton()}
        <View style={styles.containerInside}>
          <Image
            style={styles.titleIcon}
            source={require("../../assets/img/profileico.png")}
          />
          <Text style={styles.phNo}>{this.state.ask_name}</Text>
        </View>
      </View>
    );
  }

  renderCallButton() {
    return (
      <View style={styles.callContainer}>
        <TouchableOpacity style={styles.btnCall} onPress={() => { this.props.navigation.navigate("MakeACall") }}>
          <Image
            source={require('../../assets/img/call.png')}
            style={styles.imgCall} />

        </TouchableOpacity>
      </View>
    );
  }


  keyboardAvoid() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          height: DEVICE_HEIGHT,
          width: DEVICE_WIDTH
        }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={{ height: "30%", width: "86%" }}>
            {this.header()}
            {this.userInput()}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
  inputBar() {
    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        autoFocus={true}
        ref={ref => (this.textInputRef = ref)}
        placeholderTextColor={"rgba(0,0,0, 0.7)"}
        underlineColorAndroid="transparent"
        onChangeText={TextInputName => this.setState({ TextInputName })}
      />
    );
  }
}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: '#fff',
  },
  containerInside: {
    alignItems: "flex-start",
    marginTop: topspace,
  },
  titleIcon: {
    width: 40,
    height: 42
  },
  welcome: {
    marginTop: 20,
    fontSize: 24,
    paddingLeft: 6,
    width: DEVICE_WIDTH,
    textAlign: "left",
    justifyContent: "center",
    color: "#7F7F7F",
    fontFamily: "CircularStd-Medium",
  },
  phNo: {
    marginTop: 6,
    paddingLeft: 6,
    fontSize: 30,
    textAlign: "left",
    justifyContent: "center",
    color: "#000000",
    fontFamily: "CircularStd-Bold",
    lineHeight: 38,
  },
  inputNo: {
    marginTop: 36,
    alignItems: "flex-start",
    width: "100%",
    alignSelf: "flex-start",
    //paddingRight:5,
    paddingLeft: 2,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",

  },
  btntext: {
    fontFamily: "CircularStd-Bold",
    fontSize: 18,
    color: "#fff"
  },

  input: {
    fontSize: 36,
    width: "100%",
    height: 80,
    color: "#07866D",
    fontFamily: "CircularStd-Medium",
    letterSpacing: 0.5,
    backgroundColor: "#f1f1f1",
    borderRadius: 16,
    paddingLeft: 24
  },
  btnSubmit: {
    alignItems: "flex-start",
    alignContent: "flex-start",
    borderRadius: 100,
    padding: 18,
    paddingLeft: 24,
    paddingRight: 18,
    marginTop: 16,
    justifyContent: "center",
    height: 56,
    flexDirection: "row",
    elevation: 8
  },
  submitImg: {
    width: 42,
    height: 42,
    alignSelf: "center",
  },
  offlineContainer: {
    flex: 1
  },
  offlineNotification: {
    backgroundColor: "#b52424",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: DEVICE_WIDTH,
    position: "absolute",
    bottom: 10
  },
  offlineText: {
    color: "#ffffff",
    fontSize: 16
  },
  offlineIconContainer: {
    height: "90%",
    width: DEVICE_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  },
  offlineIcon: {
    width: 180,
    height: 182
  },
  styleForVersionNumber: {
    position: "absolute",
    //marginTop: heightPercentageToDP('95%'),
    //marginLeft: widthPercentageToDP('65%'),
    width: 100,
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 19,
    bottom: 0,
    letterSpacing: 0.64,
    textAlign: "right",
    color: "#000000",
    right: 10
  },

  btnContiniueContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnContinue: {
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#045546',

  },

  textContinue: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'CircularStd-Bold',
    textAlignVertical: 'center'
  },

  callContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },

  btnCall: {
    backgroundColor: '#000000',
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 10, //applied to container, And this is for inside
    elevation: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000'
  },

  imgCall: {
    height: 48,
    width: 48,
  },



});
