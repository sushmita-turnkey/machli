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
  Alert,
  BackHandler,
  StatusBar
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';//import styles from "../styles/Styles.OSF";
import getObjectForKey from "../utils/title.localization";
import styles from "../styles/OsfStyles";
import NetInfo from "@react-native-community/netinfo";
import AppSpeak from "../utils/app.speak";
import apiRequest from "../utils/api.request";
import Loader from "../utils/loader";
import {
  subscriptionKey,
  getOceanStateForecastsAPI
} from "../utils/app.create.api";


export default class NewOSFScreen extends Component {
  constructor(props) {
    super(props);
    appSpeak = new AppSpeak();
    this.state = {
      district_regional: "",
      landing_centre_regional: "",
      date: "",
      min_wind_speed_kmph: 0.0,
      max_wind_speed_kmph: 0.0,
      min_current_speed_kmph: 0.0,
      max_current_speed_kmph: 0.0,
      min_wave_height_feet: 0.0,
      max_wave_height_feet: 0.0,
      flag: "Caution",
      flag_regional: "",
      inference_regional: "",
      wind_direction_regional: "",
      current_direction_regional: "",
      wave_direction_regional: "",
      text: "",
      responseFor50KM: {},
      responseFor100KM: {},
      responseFor20KM: {},
      responseForDisplay: {},
      selectedButton: "20km",
      search: "",
      searchBarFocused: false,
      selectedSiteIndex: null,
      showComponmentB: false,
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
      yesTag: "",
      noTag: "",
      is_siteName_spoken: false,
      landing_centre: {}
    };
    this.selectionOnPress = this.selectionOnPress.bind(this);
    this.onPressSiteSelection = this.onPressSiteSelection.bind(this);
    this._shareMessage = this._shareMessage.bind(this);
    this._showResult = this - this._showResult.bind(this);
  }

  async UNSAFE_componentWillMount() {
    check = false;
    this.state.loading = true;
    // this.setState({ loading: true });
    await this.appLocalisationString();
  }

  async appLocalisationString() {
    var labelForecast = await getObjectForKey("TODAYS_FORECAST_TITLE");
    var labelCaution = await getObjectForKey("CAUTION");
    var labelPlaying = await getObjectForKey("PLAYING");
    var labelCurrent = await getObjectForKey("CURRENT");
    var labelWave = await getObjectForKey("WAVE");
    var labelWind = await getObjectForKey("WIND");
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
    var labelShare = await getObjectForKey("SHARE_THIS_FORECAST");
    var labelListen = await getObjectForKey("LISTEN");
    var labelShareMessage = await getObjectForKey("SHAER_APP_MESSAGE");
    this.setState({
      dangerTag: labelDanger,
      listenTag: labelListen,
      safeTag: labelSafe,
      shareTag: labelShare,
      shareMessageText: labelShareMessage,
      forecastTag: labelForecast,
      cautionTag: labelCaution,
      playingTag: labelPlaying,
      currentTag: labelCurrent,
      waveTag: labelWave,
      windTag: labelWind,
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
      currentMinVal: "-",
      currentMaxVal: "-",
      currentDir: "-",
      waveMinVal: "-",
      waveMaxVal: "-",
      waveDir: "-",
      windMinVal: "-",
      windMaxVal: "-",
      windDir: "-",
      site_Audio: "",
      inferenceText: "",
      conditional_Flag: "Safe",
      providedBy: poweredBy
    });
  }

  selectionOnPress(btnType) {
    appSpeak.stopSpeaking();
    this.setState({
      playingStatus: "nosound",
      isPlaying: false, loading: true
    });
    this.setState({ selectedButton: btnType });
    if (btnType === "100km") {
      this.getOSFDataForDistance(100);
    } else if (btnType === "50km") {
      this.getOSFDataForDistance(50);
    } else {
      this.getOSFDataForDistance(20);
      this.setState({ selectedButton: "20km" });
    }
  }

  onPressSiteSelection(index) {
    this.setState({ selectedSiteIndex: index });
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

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "For more information, kindly install our app: https://play.google.com/store/apps/details?id=ai.rfis.machli"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  onPressProfile() {
    Alert.alert("You have pressed profile button");
    //this.logout();
  }

  onPressLocation() {
    Alert.alert("You have pressed to choose the location");
  }
  onPressCall() {
    Alert.alert("Are you sure! you want to call us");
  }


  async _playRecording() {
    // var noText = await AsyncStorage.getItem("USERSELECTEDSITE_REGIONAL");
    console.log("Here is audio:");
    console.log(this.state.textInfo);
    appSpeak.readMyText(this.state.textInfo, "OSF_Advisory", false);
    this.setState({ playingStatus: "playing", isPlaying: true });
    this.setState({ loading: false });
    console.log(this.state.playingStatus);
    // appSpeak.readMyText(this.state.audio, "OSF_Advisory");
  }

  async _pauseAndPlayRecording() {
    if (this.state.playingStatus == "playing") {
      this.setState({
        playingStatus: "donepause",
        isPlaying: false
      });
      appSpeak.pauseSpeaking();
    } else {
      this.setState({
        playingStatus: "playing",
        isPlaying: true
      });
      appSpeak.resumeSpeaking();
    }
  }

  onPressListen = () => {
    console.log(this.state.playingStatus);
    switch (this.state.playingStatus) {
      case "nosound":
        this._playRecording();
        break;
      case "donepause":
        this._pauseAndPlayRecording();
      case "playing":
        this._pauseAndPlayRecording();
        break;
    }
  };

  onPressExtendedForecast() {
    Alert.alert("You have pressed ExtendedForecast button");
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
  async componentDidMount() {
    //DeviceRegistrationForNotification();
    // Analytics.trackEvent("OSF Screen");
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    this.props.navigation.addListener("willFocus", () => {
      this.viewReloadControl();
    });
  }
  async viewReloadControl() {
    var landing_centre = JSON.parse(await AsyncStorage.getItem("LANDINGCENTRE"));
    if (landing_centre) {
      this.setState({ landing_centre });
      var selectedSiteName = this.state.landing_centre.landing_centre_regional;
      this.setState({ landing_centre_regional: selectedSiteName });
      appSpeak.readMyText(selectedSiteName, "SELECTED_SITE_NAME", false);
      this.selectionOnPress();
    } else {
      this.setState({ loading: false });
      this.audioStopped();
      this.props.navigation.navigate("OSFFishingSites");
    }
  }

  render() {
    return (
      <View style={styles.containerMain}>
        {this.renderStatusBar()}
        <Loader loading={this.state.loading} />
        <View style={[styles.header, this.state.conditional_Flag === 'Safe' ? { backgroundColor: "#03866d" } : { backgroundColor: '#FF8900' }]}>
          {this.renderProfileContainer()}
          {this.renderLocationContainer()}
          {this.renderCallButton()}
        </View>
        <View style={styles.ViewContainer}>
          <ScrollView style={styles.scrollViewContainer}>
            {this.renderInfoContainer()}

            <View style={styles.bottomContainerStyle}>
              <View style={styles.bottomContainer}>
                {this.renderWaveContainer()}
                {this.renderCurrentContainer()}
                {this.renderWindContainer()}
              </View>
              <View style={styles.ExtendedForecastContainer}>
                {this.renderExtendedForecastContentContainer()}
                {this.renderShareForecastContainer()}
                {this.renderFeedbackView()}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  renderStatusBar() {
    return <StatusBar barStyle="light-content" hidden={false} backgroundColor="rgba(0,0,0,0)" translucent={true} />;
  }

  renderInfoContainer() {
    return <View style={[styles.infocontainer]}>
      {this.distanceContainerSelction()}
      <View style={[styles.messageContainer, this.state.conditional_Flag === 'Safe' ? { backgroundColor: "#03866d" } : { backgroundColor: '#FF8900' }]}>
        {this.renderMessageContainer()}
        {this.renderMiddleContainer()}
      </View>
    </View>;
  }

  renderWindContainer() {
    return <View style={styles.bottomContainer2}>
      <View style={styles.bottomContainer21}>
        <Image source={require("../../assets/img/wind.png")} style={styles.imgWaves} />
      </View>

      {this.renderWindTagAndDirection()}

      <View style={styles.bottomContainer23}>
        <Text style={styles.textBottomEndQuantity}>
          {this.state.min_wind_speed_kmph}
          {"-"}
          {this.state.max_wind_speed_kmph}
        </Text>
        <Text style={styles.textBottomEndQuantityUnit}>km/hr</Text>
      </View>
    </View>;
  }

  renderWindTagAndDirection() {
    return <View style={styles.bottomContainer22}>
      <Text style={styles.textBottomMiddlePrimary3}>
        {this.state.windTag}
      </Text>
      <Text>
        <Text style={styles.textBottomMiddleSecondry1}>
          {""}
        </Text>
        <Text style={styles.textBottomMiddleSecondry2}>
          {this.state.wind_direction_regional}
        </Text>
      </Text>
    </View>;
  }

  renderCurrentContainer() {
    return <View style={styles.bottomContainer2}>
      <View style={styles.bottomContainer21}>
        <Image
          source={require("../../assets/img/current.png")}
          style={styles.imgWaves}
        />
      </View>

      {this.renderCurrentTagAndDirection()}

      <View style={styles.bottomContainer23}>
        <Text style={styles.textBottomEndQuantity}>
          {this.state.min_current_speed_kmph}
          {"-"}
          {this.state.max_current_speed_kmph}
        </Text>
        <Text style={styles.textBottomEndQuantityUnit}>km/hr</Text>
      </View>
    </View>;
  }
  renderCurrentTagAndDirection() {
    return <View style={styles.bottomContainer22}>
      <Text style={styles.textBottomMiddlePrimary2}>
        {this.state.currentTag}
      </Text>
      <Text>
        <Text style={styles.textBottomMiddleSecondry1}>{""}</Text>
        <Text style={styles.textBottomMiddleSecondry2}>
          {this.state.current_direction_regional}
        </Text>
      </Text>
    </View>;
  }

  renderWaveContainer() {
    return <View style={styles.bottomContainer2}>
      <View style={styles.bottomContainer21}>
        <Image source={require("../../assets/img/waves.png")} style={styles.imgWaves} />
      </View>

      {this.renderWaveAndDirection()}
      <View style={styles.bottomContainer23}>
        <Text style={styles.textBottomEndQuantity}>
          {this.state.min_wave_height_feet}
          {"-"}
          {this.state.max_wave_height_feet}
        </Text>
        <Text style={styles.textBottomEndQuantityUnit}>feet</Text>
      </View>
    </View>;
  }

  renderWaveAndDirection() {
    return <View style={styles.bottomContainer22}>
      <Text style={styles.textBottomMiddlePrimary1}>
        {this.state.waveTag}
      </Text>
      <Text>
        <Text style={styles.textBottomMiddleSecondry1}>{""}</Text>
        <Text style={styles.textBottomMiddleSecondry2}>
          {this.state.wave_direction_regional}
        </Text>
      </Text>
    </View>;
  }

  renderMiddleContainer() {
    return <View style={styles.middlebtnContainer}>
      <TouchableOpacity style={styles.btnMiddle} onPress={this.onPressListen}>
        {this.state.isPlaying ? (<Image source={require("../../assets/img/pause.png")} style={styles.btnListen} />) : (<Image source={require("../../assets/img/listen.png")} style={styles.btnListen} />)}
        <Text style={styles.textMiddle}>
          {this.state.listenTag}
        </Text>
      </TouchableOpacity>
    </View>;
  }

  renderMessageContainer() {
    return <View style={styles.messageBox}>
      <Text style={styles.textMessageHeading}>
        {this.state.forecastTag}
      </Text>
      <Text style={styles.textMessage}>
        {this.state.inference_regional}
      </Text>
      <Text style={styles.textMessageDate}>
        {this.state.response_for_date}
      </Text>
    </View>;
  }

  renderExtendedForecastContentContainer() {
    return <View style={styles.ExtendedForecastContentContainer}>
      <View style={[styles.btnLikeExtendedForecastContainer, this.state.conditional_Flag === 'Safe' ? { backgroundColor: 'rgba(3,134,109,0.1)' } : { backgroundColor: '#FFEFCB' }]}>
        {this.state.conditional_Flag === 'Safe' ? <Image source={require('../../assets/img/Tick.png')} style={styles.imgLikeExtendedForecast}></Image> : <Image source={require('../../assets/img/caution.png')} style={styles.imgLikeExtendedForecast}></Image>}
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

  renderShareForecastContainer() {
    return <View style={styles.ShareThisForecastContainer}>
      <TouchableOpacity style={styles.btnShareThisForecast} onPress={this.onShare}>
        <Image source={require("../../assets/img/share.png")} style={styles.imgShare} />
        <Text style={styles.textShareThisForecast}>
          {this.state.shareTag}
        </Text>
      </TouchableOpacity>
      <Text>{JSON.stringify(this.state.result)}</Text>
    </View>;
  }

  renderFeedbackView() {
    return <View style={styles.feedbackContainer}>
      <View style={styles.logos}>
        <Image source={require("../../assets/img/incois_logo.png")} style={styles.imgincois} />
        <Image source={require("../../assets/img/new_rf_logo_copy.png")} style={styles.imgRF} />
      </View>
    </View>;
  }

  distanceContainerSelction() {
    return <View style={[styles.DistanceMainContainer, this.state.conditional_Flag === 'Safe' ? { backgroundColor: "#03866d" } : { backgroundColor: '#FF8900' }]}>
      {this.renderDistance20KM()}
      {this.renderDistance50KM()}
      {this.renderDistance100KM()}
    </View>;
  }
  renderDistance20KM() {
    return <View style={styles.distanceContainer1}>
      <TouchableOpacity style={[
        styles.btnDistance,
        {
          backgroundColor: this.state.selectedButton === "20km"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0)"
        }
      ]} onPress={() => this.selectionOnPress("20km")}>
        <Text style={[
          styles.textDistance,
          {
            color: this.state.selectedButton === "20km"
              ? "white"
              : "rgba(0,0,0,0.5)"
          }
        ]}>
          20km
        </Text>
      </TouchableOpacity>
    </View>;
  }
  renderDistance100KM() {
    return <View style={styles.distanceContainer3}>
      <TouchableOpacity style={[
        styles.btnDistance,
        {
          backgroundColor: this.state.selectedButton === "100km"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0)"
        }
      ]} onPress={() => this.selectionOnPress("100km")}>
        <Text style={[
          styles.textDistance,
          {
            color: this.state.selectedButton === "100km"
              ? "white"
              : "rgba(0,0,0,0.5)"
          }
        ]}>
          100km
        </Text>
      </TouchableOpacity>
    </View>;
  }

  renderDistance50KM() {
    return <View style={styles.distanceContainer2}>
      <TouchableOpacity style={[
        styles.btnDistance,
        {
          backgroundColor: this.state.selectedButton === "50km"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0)"
        }
      ]} onPress={() => this.selectionOnPress("50km")}>
        <Text style={[
          styles.textDistance,
          {
            color: this.state.selectedButton === "50km"
              ? "white"
              : "rgba(0,0,0,0.5)"
          }
        ]}>
          50km
        </Text>
      </TouchableOpacity>
    </View>;
  }

  renderCallButton() {
    return <View style={styles.callContainer}>
      <TouchableOpacity style={styles.btnCall} onPress={() => { this.props.navigation.navigate("MakeACall"); }}>
        <Image source={require('../../assets/img/call.png')} style={styles.imgCall} />

      </TouchableOpacity>
    </View>;
  }

  renderProfileContainer() {
    return <View style={styles.profileContainer}>
      <TouchableOpacity style={styles.btnProfile} onPress={() => this.logout()}>
        <Image source={require("../../assets/img/menu.png")} style={styles.imgProfile} />
      </TouchableOpacity>
    </View>;
  }

  renderLocationContainer() {
    return <View style={styles.locationContainer}>
      <TouchableOpacity style={styles.btnLocation} onPress={() => { this.props.navigation.navigate("OSFFishingSites"); }}>
        <Text style={styles.textLocation}>

          {this.state.landing_centre_regional}
        </Text>
        {this.state.conditional_Flag === 'Safe' ? <Image source={require('../../assets/img/Tick.png')} style={styles.imgLike}></Image> : <Image source={require('../../assets/img/caution.png')} style={styles.imgLike}></Image>}

      </TouchableOpacity>
    </View>;
  }

  renderLandingCenterView(index, item) {
    return <View style={{ paddingLeft: 10, paddingRight: 10 }}>
      <TouchableOpacity style={[styles.FlatListContainer, { backgroundColor: this.state.selectedSiteIndex === index ? 'skyblue' : '#ffffff' }]} onPress={() => this.onPressSiteSelection(index)}>"For more information, kindly install our app: https://play.google.com/store/apps/details?id=ai.rfis.machli"
        {this.renderLikeButton()}
        {this.renderValueFromAPI(item)}
        {this.renderRightTick(index)}
      </TouchableOpacity>
    </View>;
  }

  renderRightTick(index) {
    return <View style={styles.FlatlistTickOnClickContainer}>
      {index === this.state.selectedSiteIndex ? (<Image source={require("../../assets/img/rightTick.png")} style={styles.imgRightTickOnSelection} />) : null}
    </View>;
  }

  renderValueFromAPI(item) {
    return <View style={styles.FlatlistNameContainer}>
      <Text style={styles.textFlatlistCenterName}>{item}</Text>
      <Text style={styles.textDistanceFromLocation}>Value from api</Text>
    </View>;
  }

  renderLikeButton() {
    return <View style={styles.FlatlistSituationIconContainer}>
      <Image source={require("../../assets/img/" + "like" + ".png")} style={styles.imgLikeNearByLocations} />
    </View>;
  }
  async getOSFDataForDistance(distanceInKiloMeter) {
    try {
      lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    } catch (error) { }
    var landingCentreID = this.state.landing_centre.landing_centre_ID;

    if (landingCentreID) {
      await this.apiCallForForecast(landingCentreID, distanceInKiloMeter);
    } else {
      await this.setState({ loading: false });
      this.audioStopped();
      this.props.navigation.navigate("OSFFishingSites");
    }
  }
  async apiCallForForecast(
    landingCentreID,
    distanceInKiloMeter
  ) {
    await this.setState({ loading: true });
    var lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    var userID = await AsyncStorage.getItem("User_ID");

    var data = {
      user_id: userID,
      language: lang,
      location: {
        landing_centre_ID: landingCentreID
      },
      distance: distanceInKiloMeter,
      template_name: "ocean_state_forecast_template",
      selected_keywords: [],
      response_handler: "ocean_state_forecast"
    };
    var baseURL = await getOceanStateForecastsAPI();
    var subscriptionKeyValue = await subscriptionKey("GET_OSF_API");
    var response = await apiRequest(baseURL, data, true, subscriptionKeyValue);
    console.log("Response:" + JSON.stringify(response));
    if (response["data"].length > 0) {
      this.setState({ responseForDisplay: response });
      if (response.data.distance_upto_km === 50) {
        this.setState({ responseFor50KM: response });
      } else if (response.data.distance_upto_km === 100) {
        this.setState({ responseFor100KM: response });
      } else {
        this.setState({ responseFor20KM: response });
      }
      this.setState({
        distance_upto_km: response.data[0].distance_upto_km,
        district_regional: response.data[0].district_regional,
        landing_centre_regional: response.data[0].landing_centre_regional,
        response_for_date: response.data[0].date,
        min_wind_speed_kmph: response.data[0].min_wind_speed_kmph,
        max_wind_speed_kmph: response.data[0].max_wind_speed_kmph,
        min_current_speed_kmph: response.data[0].min_current_speed_kmph,
        max_current_speed_kmph: response.data[0].max_current_speed_kmph,
        min_wave_height_feet: response.data[0].min_wave_height_feet,
        max_wave_height_feet: response.data[0].max_wave_height_feet,
        inference_regional: response.data[0].inference_regional,
        wind_direction_regional: response.data[0].wind_direction_regional,
        current_direction_regional: response.data[0].current_direction_regional,
        wave_direction_regional: response.data[0].wave_direction_regional,
        conditional_Flag: response.data[0].flag,
        textInfo: response.text,
        audio: response.audio,

      });
    }

    console.log("datasource" + JSON.stringify(response));
    this.setState({ loading: false });
    this.state.isPlaying = false;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
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