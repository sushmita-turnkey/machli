/*jshint esversion: 6 */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
  BackHandler
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-async-storage/async-storage'; import NetInfo from "@react-native-community/netinfo";
import apiRequest from "../utils/api.request";
import Loader from "../utils/loader";
import getObjectForKey from "../utils/title.localization";
import { subscriptionKey, getLandingCenterAPI } from "../utils/app.create.api";
import APIConfig from "../config/api.config";
import Analytics from "appcenter-analytics";
import { FISHLANDINGCENTER } from "../utils/app.constant";
import AppSpeak from "../utils/app.speak";
import Pagination, { Icon, Dot } from "react-native-pagination";

const { width: DEVICE_WIDTH } = Dimensions.get("window");

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
export default class OSFFishingSites extends React.Component {
  constructor(props) {
    super(props);
    appSpeak = new AppSpeak();
    this.state = {
      isConnected: true,
      dataSource: [],
      landing_sites: [],
      selected_landing_site: [],
      loading: false,
      fishing_page_title: "",
      km_away_tag: "",
      location: null,
      errorMessage: null,
      latitude_site: "",
      longitude_site: ""
    };
  }

  onBackPress = () => {
    BackHandler.exitApp();
    return true;
  };
  getCoordinates(lat, long, lang) {
    var coordinates = lat == null ? lang == "Telugu" ? {
      latitude: 16.9891,
      longitude: 82.2475,
      language: lang
    } : lang == "Tamil" ? {
      latitude: 10.7656,
      longitude: 79.8424,
      language: lang
    } : lang == "Marathi" ? {
      latitude: 19.0458797,
      longitude: 72.7958447,
      language: lang
    } : lang == "Oriya" ? {
      latitude: 19.8092193,
      longitude: 85.8039735,
      language: lang
    } : lang == "Bengali" ? {
      latitude: 21.5658738,
      longitude: 88.2551311,
      language: lang
    } : lang == "Gujarati" ? {
      latitude: 21.6355367,
      longitude: 69.5952662,
      language: lang
    } : lang == "Malayalam" ? {
      latitude: 8.4005679,
      longitude: 76.9623138,
      language: lang
    } : {
      latitude: 10.7656,
      longitude: 79.8424,
      language: lang
    } : {
      latitude: lat,
      longitude: long,
      language: lang
    };

    return coordinates;
  }
  async apiCallForLandingSites() {
    var lat = await AsyncStorage.getItem("DEFAULT_LAT");
    var lon = await AsyncStorage.getItem("DEFAULT_LONG");
    var lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    var coordinates = await this.getCoordinates(lat, lon, lang);
    var baseURL = await getLandingCenterAPI();
    var subscriptionKeyValue = await subscriptionKey("Get_Landing_Site");
    var dataSource = await apiRequest(
      baseURL,
      coordinates,
      true,
      subscriptionKeyValue
    );
    this.setState({ loading: false });
    if (dataSource == "timeout of 60000ms exceeded") {
      Analytics.trackEvent(FISHLANDINGCENTER.LANDING_CENTER, {
        "FISHLANDINGCENTER.LANDING_CENTER_API_FAILED": dataSource
      });
      Alert.alert("Please try after some time");
    } else {
      if (dataSource.length) {
        this.setState({ dataSource: dataSource });
      }
    }

  }

  selectItem = data => {
    if (this.state.selected_landing_site != null) {
      this.state.selected_landing_site.pop();
    }
    this.state.selected_landing_site.push(data.item);

    this.btnContinueTapped();
  };

  GetGridViewItem(item) {
    this.setState({ landing_sites: item });
  }

  async btnContinueTapped() {

    await AsyncStorage.setItem("LANDINGCENTRE", JSON.stringify(this.state.selected_landing_site[0]));
    this.setState({ loading: true });
    Analytics.trackEvent(FISHLANDINGCENTER.LANDING_CENTER, {
      "FISHLANDINGCENTER.USER_SELECTED_LANDING_CENTER": JSON.stringify(
        this.state.selected_landing_site[0]
      )
    });

    const { navigate } = this.props.navigation;
    this.setState({ loading: false });
    navigate("Home", {
      sourceScreen: "fishingSites"
      // selected_site_name: site_regional
    });
  }

  async componentDidMount() {
    var noText = await getObjectForKey("ASK_FISHING_LOCATION");
    try {
      lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    } catch (error) { }
    appSpeak.readMyText(
      noText,
      FISHLANDINGCENTER.LANDING_SITE_SCREEN_TITLE,
      false
    );
    await this.apiCallForLandingSites();
    Analytics.trackEvent(FISHLANDINGCENTER.LANDING_CENTER);
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
    var Km_far_local = await getObjectForKey("KM_AWAY");
    this.setState({
      fishing_page_title: noText,
      km_away_tag: Km_far_local
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };
  fish_sitesList() {
    return this.state.dataSource.length > 0 ? (
      <FlatList
        style={styles.GridContainer}
        data={this.state.dataSource}
        ref={r => (this.refs = r)}
        renderItem={item => this.renderItem(item)}
        extraData={this.state}
        numColumns={1}
        backgroundColor="#ffffff"
        keyExtractor={item => item.landing_centre_ID}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    ) : null;
  }

  renderItem = data => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}
    >
      <View>
        <Text style={styles.GridViewInsideTextItemStyle}>
          {data.item.landing_centre_name_in_requested_language}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Text style={styles.districttext}>
            {data.item.district_name_in_requested_language}
          </Text>
          <View style={styles.circledot} />
          <Text style={styles.distancestyle}>{data.item.distance_km} {this.state.km_away_tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  static navigationOptions = {
    header: null
  };
  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else {
      return (
        <View style={styles.containerMain}>
          <Image
            style={styles.iconMain}
            source={require("../../assets/img/fishlocation.png")}
          />
          <Text style={styles.header}>{this.state.fishing_page_title}</Text>
          {this.fish_sitesList()}
          <Loader loading={this.state.loading} />
          {/* <Pagination
            listRef={this.refs} //to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
            paginationVisibleItems={this.state.viewableItems} //needs to track what the user sees
            paginationItems={this.state.items} //pass the same list as data
            paginationItemPadSize={2} //num of items to pad above and below your visable items
         />*/}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  iconMain: {
    width: 64,
    height: 64,
    marginTop: "10%"
  },
  horizontalFlex: {
    width: DEVICE_WIDTH,
    justifyContent: "space-between",
    height: 150,
    flexDirection: "row"
  },
  btnFlex: {
    width: 150,
    height: 150,
    alignItems: "center"
  },
  btn: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderColor: "#f4f4f4",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "rgba(255,255,255,0.7)"
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "CircularStd-Bold"
  },

  districttext: {
    fontSize: 16,
    color: "#919191",
    fontFamily: "CircularStd-Book",
  },
  header: {
    fontSize: 28,
    textAlign: "center",
    marginTop: "6%",
    fontFamily: "CircularStd-Bold",
    color: "#000000"
  },
  emptybox: {
    borderRadius: 10,
    marginTop: 2,
    height: 110,
    width: 140,
    backgroundColor: "#f1f1f1"
  },
  offlineContainer: {
    flex: 1
  },

  circledot: {
    backgroundColor: '#D5DCDE',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 7,
    height: 5,
    width: 5,
    borderRadius: 100,
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
    marginTop: 32,
    marginBottom: heightPercentageToDP("1%"),
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("75%"),
  },

  GridViewBlockStyle: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    height: 100,
    margin: 2.5,
    borderRadius: 4,
    backgroundColor: "#eeeeee"
  },
  GridViewInsideTextItemStyle: {
    fontSize: 20,
    letterSpacing: 0.1,
    textAlign: "left",
    color: "#000",
    fontFamily: "CircularStd-Bold"
  },
  NativeLanguageTextSyle: {
    marginTop: 0,
    marginLeft: 10,
    width: 340,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0,
    textAlign: "left",
    color: "#036350"
  },
  selectedTapAnotherToSelectMoreText: {
    width: 293,
    height: 22,
    marginTop: 0,
    marginLeft: 10,
    //fontFamily: "CircularStd",
    fontSize: 17,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.6)"
  },
  continueButtonStyle: {
    marginTop: heightPercentageToDP("8%"),
    marginBottom: heightPercentageToDP("3.33%"),
    marginLeft: widthPercentageToDP("5.85%"),
    width: widthPercentageToDP("88.3%"),
    height: 54,
    borderRadius: 8,
    backgroundColor: "#036350",
    borderWidth: 0
  },
  continueButtonTextStyle: {
    opacity: 1,
    //fontFamily: "CircularStd",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0.23,
    textAlign: "center",
    color: "#ffffff"
  },

  list: {
    justifyContent: "center",
    flex: 1,
    height: heightPercentageToDP("12%"),
    padding: 16,
    paddingLeft: 24,
    marginBottom: 8,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    maxHeight: heightPercentageToDP("14%"),
  },
  selected: {
    backgroundColor: "#fb3d3c",
    color: "#fff"
  },
  languageSelected: {
    color: "#fff",
    textAlign: "center"
  }
});
