/*jshint esversion: 6 */

import React from "react";
import { StyleSheet, Alert, Text, View, Dimensions, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; import getObjectForKey from "../utils/title.localization";
import NetInfo from "@react-native-community/netinfo";
import { heightPercentageToDP } from "react-native-responsive-screen";

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

export default class UserRegistration extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      loading: false,
      success_tag: "Success !!",
      registeted_tag: "You are now registered !"
    };
  }
  async componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }
  toLandingSites() {
    var { navigate } = this.props.navigation;
    navigate("OSFFishingSites");
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  CheckTextInputIsEmptyOrNot() {
    //  console.log("Success");
  }

  ShowAlertWithDelay = () => {
    setTimeout(() => {
      try {
        AsyncStorage.setItem("IS_USER_LOGGED_IN", JSON.stringify(true));
      } catch (error) {
        // Alert.alert("Alert :" + error);
      }

      this.props.navigation.navigate("OSFFishingSites");
    }, 2500);
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    } else {
      return (
        <View style={styles.containerInside}>
          {this.showGif()}
          {this.ShowAlertWithDelay()}
        </View>
      );
    }
  }

  showGif() {
    return (
      <Image
        style={styles.titleIcon}
        source={require("../../assets/images/loading.png")}
      />
    );
  }
}

const styles = StyleSheet.create({
  containerInside: {
    alignItems: "center",
    marginTop: heightPercentageToDP("40%"),
    justifyContent: "center"
  },
  titleIcon: {
    width: 100,
    height: 100
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
    width: 180,
    height: 182
  }
});
