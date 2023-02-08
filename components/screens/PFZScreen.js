/*jshint esversion: 6 */

import React from "react";
import { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Share,
  Dimensions,
  Alert,
  FlatList,
  BackHandler,
  StatusBar
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; import { Grid, Col, Row } from "react-native-easy-grid";
import Loader from "../utils/loader";
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType
} from "react-native-sensors";
import getObjectForKey from "../utils/title.localization";
import APIConfig from "../config/api.config";
import styles from "../styles/OsfStyles";
import NetInfo from "@react-native-community/netinfo";
import AppSpeak from "../utils/app.speak";
import apiRequest from "../utils/api.request";
import {
  subscriptionKey,
  getLandingCenterAPI,
  getNewPFZScreenAPI
} from "../utils/app.create.api";

const { height, width } = Dimensions.get("window");
import { NavigationEvents } from "react-navigation";

setUpdateIntervalForType(SensorTypes.magnetometer, 300);
export default class NewPFZScreen extends Component {

  constructor(props) {
    super(props);
    appSpeak = new AppSpeak();
    this.state = {
      magnetometer: "0",
      dataSourcePFZ: {},
      flag: "Caution",
      flag_regional: "",
      inference_regional: "",
      text: "",
      responseForDisplay: {},
      search: "",
      searchBarFocused: false,
      selectedSiteIndex: null,
      playingStatus: "nosound",
      isConnected: true,
      loading: false,
      isSafe: false,
      LogoutTag: "",
      language: "",
      fishingState: "",
      fishingStateFlag: "",
      osf_landing_site: [],
      feedbackTag: "",
      changeSiteTag: "",
      checkValueColor: "",
      is_siteName_spoken: false,
      landing_center: {}
    };
    this._shareMessage = this._shareMessage.bind(this);
    this._showResult = this._showResult.bind(this);
  }


  async UNSAFE_componentWillMount() {
    check = false;
    this.setState({ loading: true });
    var labelForecast = await getObjectForKey("PFZ_FORECAST_TITLE");
    var labelCaution = await getObjectForKey("CAUTION");
    var labelBearing = await getObjectForKey("YOUR_BEARING");
    var labelShare = await getObjectForKey("SHARE_THIS_FORECAST");
    var labelKm = await getObjectForKey("KM_AWAY");
    var labelMeter = await getObjectForKey("METER_DEPTH");
    var labelPlaying = await getObjectForKey("PLAYING");
    var labelCurrent = await getObjectForKey("CURRENT");
    var labelHelpful = await getObjectForKey("ASK_USER_FEEDBACK_TITLE");
    var labelSafe = await getObjectForKey("SAFE");
    var labelDanger = await getObjectForKey("DANGER");
    var labelFeedback = await getObjectForKey("FEEDBACK_TITLE");
    var labelChangeSite = await getObjectForKey("TAP_TO_CHANGE");
    var labelOSF = await getObjectForKey("OCEAN_STATE_FORECAST");
    var labelYourLoc = await getObjectForKey("YOUR_FISHING_LOCATION");
    var labelReadMore = await getObjectForKey("READ_MORE");
    var labelNoData = await getObjectForKey("NO_DATA_AVAILABLE");
    var labelSure = await getObjectForKey("ASK_LOGOUT_CONFIRMATION");
    var labelLogout = await getObjectForKey("LOGOUT");
    var labelYes = await getObjectForKey("YES");
    var labelNo = await getObjectForKey("NO");
    var poweredBy = await getObjectForKey("POWERED_BY");
    this.setState({
      dangerTag: labelDanger,
      safeTag: labelSafe,
      bearingTag: labelBearing,
      shareTag: labelShare,
      kmtag: labelKm,
      meterTag: labelMeter,
      forecastTag: labelForecast,
      cautionTag: labelCaution,
      playingTag: labelPlaying,
      currentTag: labelCurrent,
      reviewTag: labelHelpful,
      feedbackTag: labelFeedback,
      changeSiteTag: labelChangeSite,
      fishingLocTag: labelYourLoc,
      readMoreTag: labelReadMore,
      oceanStateTag: labelOSF,
      textInfo: labelNoData,
      areYouSureTag: labelSure,
      LogoutTag: labelLogout,
      yesTag: labelYes,
      noTag: labelNo,
      site_Audio: "",
      inferenceText: "",
      conditional_Flag: "",
      providedBy: poweredBy
    });
  }

  _showResult(result) {
    this.setState({ result });
  }
  _shareMessage() {
    Share.share({
      message:
        "For more information, kindly install our app: https://play.google.com/store/apps/details?id=ai.rfis.machli"
    }).then(this._showResult());
  }

  onPressLike() {
    Alert.alert("You have pressed like button");
  }
  onPressDislike() {
    Alert.alert("You have pressed dislike button");
  }
  onpressConinue() {
    Alert.alert("Show the ocean state forecast for the selected location");
  }

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    this.props.navigation.addListener("willFocus", () => {
      this.viewReloadControl();
    });
    this.viewReloadControl();
    this._toggle();

    this.getPFZDataFromServer();
    //  this.renderCompass();
  }
  getPFZDataFromServer() {
    var distance = APIConfig.DefaultSetting.osf_distance_in_kilometer;
    //console.log("Distance :" + distance);
    this.getOSFDataForDistance(distance);
  }
  async viewReloadControl() {
    //console.log("Calling to reload");
    var landing_centre = JSON.parse(await AsyncStorage.getItem("LANDINGCENTRE"));
    this.setState({ landing_centre });
    var selectedSiteName = landing_centre.landing_centre_regional;
    this.setState({ landing_centre_regional: selectedSiteName });
    // appSpeak.readMyText(selectedSiteName, "SELECTED_SITE_NAME", false);
    // this.selectionOnPress();
  }


  pfzDistance = data => (
    <View style={styles.containerPFZ}>
      {this.renderDirection(data)}
      <View style={styles.PFZmainContainer}>
        <Text maxLength={6} style={styles.PFZtextonetwo}>
          {data.item.latitude_DMS}
          |{data.item.longitude_DMS}
        </Text>
      </View>
      <View
        style={[
          styles.PFZmainContainer,
          { opacity: 0.8 },
          { flexDirection: "row" }
        ]}
      >
        {this.renderPFZDistance(data)}
        {this.renderDepthInMeter(data)}
      </View>
    </View>
  );
  _toggle = () => {
    this._subscription ? this._unsubscribe() : this._subscribe();
  };

  _subscribe = async () => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 300);
    this._subscription = magnetometer.subscribe(
      sensorData => this.updateMagnetometerData(sensorData),
      () => console.log("The sensor is not available"),
    );
  };
  async updateMagnetometerData(sensorData) {
    if (this._subscription === null) return;
    await this.setState({ magnetometer: this._angle(sensorData) });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.unsubscribe();
    this._subscription = null;
  };

  _angle = magnetometer => {
    let angle = 0;
    if (magnetometer) {
      let { x, y } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(angle);
  };



  _direction = degree => {
    var s = "";
    s = degree >= 22.5 && degree < 67.5 ? "NE" : degree >= 67.5 && degree < 112.5 ? "E" : degree >= 112.5 && degree < 157.5 ? "SE" : degree >= 157.5 && degree < 202.5 ? "S" : degree >= 202.5 && degree < 247.5 ? "SW" : degree >= 247.5 && degree < 292.5 ? "W" : degree >= 292.5 && degree < 337.5 ? "NW" : "N";
    return s;
  };

  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
  _degree = magnetometer => {
    return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
  };

  renderDirection(data) {
    return <View style={styles.PFZdirection}>
      <Text style={styles.PFZtexttwo}>
        {data.item.bearing_deg}
        {data.item.direction_regional}
      </Text>
    </View>;
  }

  renderDepthInMeter(data) {
    return <View style={[{ flexDirection: "column" }, { paddingRight: 40 }]}>
      <Text style={styles.PFZtext}>
        {data.item.depth_metre}
      </Text>
      <Text style={[styles.PFZtextone, { opacity: 0.5 }]}>
        {this.state.meterTag}
      </Text>
    </View>;
  }

  renderPFZDistance(data) {
    return <View style={styles.PFZdistanceContainer}>
      <Text style={styles.PFZtext}>
        {data.item.distance_km}
      </Text>
      <Text style={[styles.PFZtextone, { opacity: 0.5 }]}>
        {this.state.kmtag}
      </Text>
    </View>;
  }

  logout() {
    Alert.alert(
      this.state.areYouSureTag,
      this.state.LogoutTag,
      [
        {
          text: this.state.noTag,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: this.state.yesTag,
          onPress: () => {
            this.audioStopped();
            this.clearStoredValue();
            this.props.navigation.navigate("AskUserLanguage");
          }
        }
      ],
      { cancelable: true }
    );
  }
  loadView() {
    this._subscribe();
  }
  unloadView() {
    this._unsubscribe();
    //console.log("will unload view");
  }
  render() {
    return (<View style={styles.containerMain}>
      <Loader loading={this.state.loading} />
      {this.registeringNotificationEvent()}
      {this.drawHeaders()}
      {this.drawStatusBar()}
      {this.drawCompass()}
    </View>);
  }


  drawStatusBar() {
    return <StatusBar barStyle="light-content" hidden={false} backgroundColor="rgba(0,0,0,0)" translucent={true} />;
  }
  registeringNotificationEvent() {
    return <View>
      <NavigationEvents
        onWillFocus={() => {
          this.loadView();
        }}
      />
      <NavigationEvents
        onWillBlur={() => {
          this.unloadView();
        }}
      />
    </View>
  }
  drawHeaders() {
    return <View style={styles.PFZheader}>
      {this.drawMenuButton()}
      {this.drawLandingCenterSelection()}
      {this.drawMakeACallButton()}
    </View>;
  }

  drawLandingCenterSelection() {
    return <View style={styles.locationContainer}>
      <TouchableOpacity style={styles.btnLocation} onPress={() => {
        this.props.navigation.navigate("OSFFishingSites");
      }}>
        <Text style={styles.textLocation}>
          {this.state.landing_centre_regional}
        </Text>
        {this.state.conditional_Flag === 'Safe' ? <Image source={require('../../assets/img/Tick.png')} style={styles.imgLike}></Image> : <Image source={require('../../assets/img/caution.png')} style={styles.imgLike}></Image>}
      </TouchableOpacity>
    </View>;
  }

  drawMenuButton() {
    return <View style={styles.profileContainer}>
      <TouchableOpacity style={styles.btnProfile} onPress={() => this.logout()}>
        <Image source={require("../../assets/img/menu.png")} style={styles.imgProfile} />
      </TouchableOpacity>
    </View>;
  }

  drawMakeACallButton() {
    return <View style={styles.callContainer}>
      <TouchableOpacity style={styles.btnCall} onPress={() => {
        this.props.navigation.navigate("MakeACall");
      }}>
        <Image source={require("../../assets/img/call.png")} style={styles.imgCall} />
      </TouchableOpacity>
    </View>;
  }

  drawCompass() {
    return <View style={styles.ViewContainer}>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.PFZinfocontainer}>
          {this.renderPFZData()}
          {this.drawCompassGrid()}
          {this.drawExtendedForeCast()}
        </View>
      </ScrollView>
    </View>;
  }

  drawExtendedForeCast() {
    return <View style={styles.ExtendedForecastContainer}>
      {this.drawExtendedForeCastContainer()}
      {this.drawShareContainer()}
      {this.drawFeedbackContainer()}
    </View>;
  }

  drawExtendedForeCastContainer() {
    return <View style={styles.ExtendedForecastContentContainer}>
      <View style={styles.btnLikeExtendedForecastContainer}>
        <Image source={require("../../assets/img/Tick.png")} style={styles.imgLikeExtendedForecast} />
      </View>
      <View style={styles.ExtendedForecastRightContainer}>
        <Text style={styles.textHeadingExtendedForecast}>
          {this.state.forecastTag}
        </Text>
        <Text style={styles.textContentExtendedForecast}>
          {this.state.textInfo}{" "}
        </Text>
      </View>
    </View>;
  }

  drawFeedbackContainer() {
    return <View style={styles.feedbackContainer}>
      <View style={styles.logos}>
        <Image source={require("../../assets/img/incois_logo.png")} style={styles.imgincois} />
        <Image source={require("../../assets/img/new_rf_logo_copy.png")} style={styles.imgRF} />
      </View>
    </View>;
  }

  drawShareContainer() {
    return <View style={styles.ShareThisForecastContainer}>
      <TouchableOpacity style={styles.btnShareThisForecast} onPress={() => this._shareMessage()}>
        <Image source={require("../../assets/img/share.png")} style={styles.imgShare} />
        <Text style={styles.textShareThisForecast}>
          {this.state.shareTag}
        </Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(this.state.result)}</Text>
    </View>;
  }

  drawCompassGrid() {
    //console.log("drawCompassGrid");
    return <Grid style={styles.compassblock}>
      <Row style={{ alignItems: "center" }} size={0.1}>
        <Col style={{ alignItems: "center" }}>
          {this.drawBearingTag()}
        </Col>
      </Row>
      <Row style={{ alignItems: "center" }} size={2}>
        {this.drawCompassCenterView()}
        {this.drawMagnetometerCenterView()}
      </Row>
    </Grid>;
  }

  drawBearingTag() {
    return <View style={{ width: width, alignItems: "center", bottom: 0 }}>
      <Image source={require("../../assets/images/compass_pointer.png")} style={{
        height: height / 26,
        resizeMode: "contain"
      }} />
      <View style={styles.bearing}>
        <Text style={styles.PFZtextone}>
          {this.state.bearingTag}
        </Text>
      </View>
    </View>;
  }

  drawMagnetometerCenterView() {
    return <Col style={{ alignItems: "center" }}>
      <Image source={require("../../assets/images/group_1704.png")} style={{
        height: width - 0,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: "contain",
        zIndex: 1,
        transform: [
          { rotate: 360 - this.state.magnetometer + "deg" }
        ]
      }} />
    </Col>;
  }

  drawCompassCenterView() {
    return <View style={{ flexDirection: "column" }}>
      <View style={{ height: 30 }}>
        <Text style={{
          color: "#fff",
          fontSize: height / 25,
          width: width,
          position: "absolute",
          zIndex: 10,
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {this._degree(this.state.magnetometer)}°
        </Text>
      </View>
      <View style={{ height: 30 }}>
        <Text style={{
          color: "#fff",
          fontSize: height / 35,
          width: width,
          position: "absolute",
          zIndex: 10,
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {this._direction(this._degree(this.state.magnetometer))}
        </Text>
      </View>
    </View>;
  }

  renderPFZData() {
    //console.log("Rerender PFZ Data");
    return <View style={styles.PFZmessageContainer}>
      <View style={styles.PFZmessageBox}>
        <Text style={styles.texHeading}>
          {this.state.forecastTag}
        </Text>
      </View>
      {this.state.dataSourcePFZ.data ? (<FlatList data={this.state.dataSourcePFZ.data} renderItem={item => this.pfzDistance(item)} keyExtractor={item => item.distance_km} />) : null}
    </View>;
  }


  async getOSFDataForDistance(distanceInKiloMeter) {
    await this.apiCallForForecast(distanceInKiloMeter);
  }
  async apiCallForForecast(distanceInKiloMeter) {
    this.setState({ loading: true });
    var lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    var userID = await AsyncStorage.getItem("User_ID");
    var data = {
      source: "app",
      user_id: userID,
      language: lang,
      location: {
        landing_centre_ID: this.state.landing_centre.landing_centre_ID
      },
      template_name: "potential_fishing_zones_template",
      selected_keywords: [],
      response_handler: "potential_fishing_zones"
    };
    var baseURL = await getNewPFZScreenAPI();
    var subscriptionKeyValue = await subscriptionKey("GET_PFZ_API");
    var response = await apiRequest(baseURL, data, true, subscriptionKeyValue);
    this.setState({ loading: false });
    if (response["data"].length > 0) {
      this.setState({ responseForDisplay: response });
    }

    this.setState({ dataSourcePFZ: response });
    this.setState({
      landing_centre_regional: response.data[0].landing_centre_regional,
      response_for_date: response.data[0].date,

      inference_regional: response.data[0].inference_regional,

      conditional_Flag: response.data[0].flag,
      textInfo: response.text,
      audio: response.audio
    });

    this.setState({ loading: false });
    this.state.isPlaying = false;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    this._unsubscribe();
  }
  onBackPress = () => {
    this.audioStopped();
    this.props.navigation.navigate("OSFFishingSites");
    return true;
  };

  audioStopped = () => {
    check = true;
    appSpeak.stopSpeaking();
    this.setState({
      isPlaying: false,
      playingStatus: "nosound"
    });
  };
  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  async clearStoredValue() {
    await AsyncStorage.removeItem("DEFAULT_LANGUAGE");
    await AsyncStorage.removeItem("IS_USER_LOGGED_IN");
    await AsyncStorage.removeItem("User_ID");
  }
  logout = () => {
    Alert.alert(
      this.state.areYouSureTag,
      this.state.LogoutTag,
      [
        {
          text: this.state.noTag,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: this.state.yesTag,
          onPress: () => {
            this.audioStopped();
            this.clearStoredValue();
            this.props.navigation.navigate("AskUserLanguage");
          }
        }
      ],
      { cancelable: true }
    );
  };
}
