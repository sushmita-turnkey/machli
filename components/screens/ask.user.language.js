/*jshint esversion: 6 */
/* @flow */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  FlatList,
  Linking,
  StatusBar,
  TouchableHighlight
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-async-storage/async-storage'; import Loader from "../utils/loader";
import DeviceInfo from "react-native-device-info";
const { width: DEVICE_WIDTH } = Dimensions.get("window");
import Analytics from "appcenter-analytics";
import { LANGUAGESCREEN, APPCONSTANTS } from "../utils/app.constant";
import DeviceRegistrationForNotification from "../utils/notification.registration";
import MediaPlayer from "../utils/audio.player";
import AppLocalization from "../utils/app.localization";
import getObjectForKey from "../utils/title.localization";
import NetInfo from "@react-native-community/netinfo";
import Geolocation from "@react-native-community/geolocation";

const blockWidth = 0.29 * DEVICE_WIDTH;

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

export default class AskUserLanguage extends Component {
  static navigationOptions = {
    headerMode: "none",
    header: null
  };
  constructor(props) {
    super(props);
    mediaPlayer = new MediaPlayer();
    appLocalization = new AppLocalization();
    this.state = {
      isConnected: true,
      dataSource: [],
      languages: [],
      selected_language: [],
      loading: false,
      fishing_page_title: "",
      currentLatitude: "null",
      currentLongitude: "null",
      privacyPolicy: "",
      reloadSupportingLanguages: true
    };
  }
  async requestPermissions() {
    console.log("location permission");
    var isPermissionGranted;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
      isPermissionGranted = granted["android.permission.ACCESS_FINE_LOCATION"];
    } catch (err) { }
    if (isPermissionGranted === "granted") {
      AsyncStorage.setItem("LOCATION_ACCESS_PERMISSION", "granted");
      DeviceInfo.isLocationEnabled().then(enabled => {
        // true or false
        Analytics.trackEvent(LANGUAGESCREEN.GPS, {
          IS_GPS_ENABLED: JSON.stringify(enabled)
        });
        if (enabled) {
          this.checkLocation();
        } /* else {
          Alert.alert(
            "GPS is not responding",
            "Please turn on GPS and try again later."
          );
        }*/
      });
    }
  }

  async checkLocation() {
    console.log("Getting location");
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        this.storeCoordinates(position);
      },
      err => console.log(err),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 10000
      }
    );
  }
  storeCoordinates(position) {
    const currentLongitude = JSON.stringify(position.coords.longitude);
    const currentLatitude = JSON.stringify(position.coords.latitude);
    this.setState({ currentLongitude: currentLongitude });
    this.setState({ currentLatitude: currentLatitude });
    if (position !== null) {
      console.log("setting ");
      if(this.state.currentLatitude)
      AsyncStorage.setItem("DEFAULT_LAT", this.state.currentLatitude);
      if(this.state.currentLongitude)
      AsyncStorage.setItem("DEFAULT_LONG", this.state.currentLongitude);
      console.log(AsyncStorage.getItem('DEFAULT_LAT'));
    }
  }


  selectItem = data => {
    if (this.state.selected_language != null) {
      this.state.selected_language.pop();
    }
    this.state.selected_language.push(data.item);
    var languageSelected = data;
    this.btnContinueTapped(languageSelected);
  };
  async btnContinueTapped(languageSelected) {
    this.setState({ loading: true });
    const { navigate } = this.props.navigation;
    Analytics.trackEvent(LANGUAGESCREEN.USER_SELECTED_LANGUAGE, {
      USER_SELECTED_LANGUAGE: languageSelected
    });
    if(languageSelected)
    AsyncStorage.setItem("DEFAULT_LANGUAGE", languageSelected);
    try {
      await appLocalization.syncAppLocalization();
    } catch (error) { }

    this.setState({ loading: false });
    navigate("UserLogin", {
      /* "language": languageSelected , "ph_no":this.state.ph_number*/
    });
  }
  async requestCameraPermission() { }

  async componentDidMount() {
    const { navigate } = this.props.navigation;

    state = await AsyncStorage.getItem("IS_USER_LOGGED_IN");
    if (state == "true") {
      navigate("Home", { initialScreen: "AskuserLanguage" });
    }
    DeviceRegistrationForNotification();
    try {
      var locPermission = await AsyncStorage.getItem(
        "LOCATION_ACCESS_PERMISSION"
      );
      if (locPermission === "granted") {
        try {
          await this.checkLocation();
        } catch (error) { }
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ loading: true });
    try {
      await this.requestPermissions();
      await this.checkLocation();
    } catch (error) { console.log(error) }

    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    var labelText = " Select a language   ";
    this.setState({
      ph_number: "NaN",
      fishing_page_title: labelText,
      privacyPolicy: "Privacy Policy",
      privacyPolicyURL:
        "http://guru-web.westindia.cloudapp.azure.com/privacy_policy/index.html"
    });
    this.loadSupportingLanguage();
  }
  async loadSupportingLanguage() {
    try {
      var response = await appLocalization.syncAppConfig();
      await this.setState({ dataSource: response });
      await this.setState({ loading: false });
      await this.setState({ reloadSupportingLanguages: false });
    } catch (error) {
      console.log("Error : " + error);
    }
  }
  async componentWillUnmount() {
    try {
      await mediaPlayer.stopPlay();
    } catch (error) { }

    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }
  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };


  getImageBg = data => {
    const colors = ['#FF5F2D', '#0A4A81', '#DD4444', '#FCB900', '#8434A2',];
    let index = data.index;
    return colors[index % colors.length];
  };


  fish_sitesList() {
    return (
      <FlatList
        style={styles.GridContainer}
        data={this.state.dataSource}
        backgroundColor="#fff"
        renderItem={item => this.renderItem(item)}
        extraData={this.state}
        numColumns={3}
        keyExtractor={item => item.code}
      />
    );
  }
  renderItem = data => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass,]} onPress={() => this.selectItem(data.item.name)}>
      <Text style={[styles.GridViewInsideTextItemStyle, styles.languageSelected, { color: this.getImageBg(data) }]}>
        {data.item.display_name}
      </Text>
    </TouchableOpacity>
  );
  changeEnvironment() {
    var isDev = false;
    if (__DEV__) {
      isDev = true;
    } else {
      return;
    }
    const { navigate } = this.props.navigation;
    navigate("ChangeEnvironment", { reloadData: this.reloadData });
  }
  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    } else {
      return (
        <View style={styles.containerMain}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <TouchableHighlight onPress={() => this.changeEnvironment()}>
            <Image
              style={styles.iconMain}
              source={require("../../assets/images/icon_main.png")}
            />
          </TouchableHighlight>
          <Text style={styles.header}>{this.state.fishing_page_title}</Text>

          {this.fish_sitesList()}

          <Loader loading={this.state.loading} />
          <TouchableHighlight onPress={() => Linking.openURL(this.state.privacyPolicyURL)} style={styles.privacyPolicy} >
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
  reloadData = data => {
    console.log("Reloading data");
    this.setState(data);
    this.setState({ loading: true });
    this.loadSupportingLanguage();
  };
}
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  privacyPolicy: {
    alignItems: "flex-end",
    marginBottom: 24,
  },

  privacyPolicyText: {
    fontSize: 13,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    color: "#919191",
  },

  changeEnvironment: {
    fontSize: 18,
    marginBottom: 80,
    textAlign: "center",
    color: "#000000",
    backgroundColor: "#FFFFFF"
  },

  iconMain: {
    backgroundColor: "#ffffff",
    width: 40,
    height: 42,
    marginTop: 30
  },
  apiSettingMain: {
    backgroundColor: "#ffffff",
    width: 40,
    height: 42,
    marginTop: 0,
    marginLeft: 0,
    alignSelf: "flex-start"
  },

  header: {
    marginTop: 24,
    fontSize: 35,
    textAlign: "center",
    fontFamily: "CircularStd-Bold",
    color: '#000000',
    paddingLeft: "5%",

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
    color: "#fff",
    fontSize: 16
  },
  offlineIconContainer: {
    height: "90%",
    width: DEVICE_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  },
  offlineIcon: {
    width: 80,
    height: 82
  },
  GridContainer: {
    marginTop: heightPercentageToDP("5%"),
    marginBottom: heightPercentageToDP("5%"),
    width: widthPercentageToDP("90%"),
    paddingRight: 0,
    height: heightPercentageToDP("75%"),
    marginLeft: widthPercentageToDP("5%"),
    marginRight: widthPercentageToDP("5%"),
    color: "#cc0000",
  },
  GridViewInsideTextItemStyle: {
    //  fontSize: 40,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 40,
    letterSpacing: 0,
    //textAlign: 'center',
    color: "#ffffff"
  },


  list: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    maxWidth: blockWidth,
    aspectRatio: 1 / 1,
    margin: 3,
    borderRadius: 8,
    backgroundColor: "#f6f6f6",
    color: "#3c3a3a",

  },
  selected: {
    backgroundColor: "#3c3a3a",
    color: "#3c3a3a",
    fontFamily: "CircularStd-Bold",
    fontSize: 20
  },
  languageSelected: {
    color: "#3c3a3a",
    fontFamily: "CircularStd-Bold",
    textAlign: "center",
    fontSize: 20
  }
});
