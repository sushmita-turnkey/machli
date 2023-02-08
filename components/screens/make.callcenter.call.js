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
  BackHandler
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import call from "react-native-phone-call";
import getObjectForKey from "../utils/title.localization";
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
import NetInfo from "@react-native-community/netinfo";
import Analytics from "appcenter-analytics";

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

export default class MakeACall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      callTag: "",
      quesTag: "",
      tollFreeTag: ""
    };
  }

  async componentWillMount() {
    var labelCall = await getObjectForKey("CALL_RELIANCE_FOUNDATION");
    var labelQues = await getObjectForKey("GET_QUESTIONS_ANSWERED");
    var labelTollFree = await getObjectForKey("TOLL_FREE");
    this.setState({
      callTag: labelCall,
      quesTag: labelQues,
      tollFreeTag: labelTollFree
    });
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  async componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  onBackPress = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  call = () => {
    const args = {
      number: "18004198800",
      prompt: true
    };
    Analytics.trackEvent("CALL_TO_RFIS");
    call(args).catch(console.error);
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    } else {
      return (
        <View style={{ justifyContent: "center", height: DEVICE_HEIGHT }}>
          {this.keyboardAvoid()}
        </View>
      );
    }
  }
  userInput() {
    return (
      <View style={styles.InputName}>
        {this.inputBar()}
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={this.CheckTextInputIsEmptyOrNot}
        >
          <Image
            style={styles.submitImg}
            source={require("../../assets/images/green_left.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
  header() {
    return (
      <View style={styles.containerInside}>
        <Image
          style={styles.titleIcon}
          source={require("../../assets/images/rflogo.png")}
        />
        <Text style={styles.rfs_title}>{this.state.callTag}</Text>
        {this.subTag()}
        {this.tag_number()}
        {this.subTag_Number()}
        {this.icon_call()}
      </View>
    );
  }
  subTag() {
    return <Text style={styles.rfs_subTitle}>{this.state.quesTag}</Text>;
  }
  tag_number() {
    return <Text style={styles.rfs_number}>1800 419 8800</Text>;
  }
  subTag_Number() {
    return <Text style={styles.rfs_subTitle}>({this.state.tollFreeTag})</Text>;
  }
  icon_call() {
    return (
      <View style={styles.viewBtnCall}>
        <TouchableOpacity style={styles.btnCall} onPress={this.call}>
          <Image
            style={{ width: 80, height: 80 }}
            source={require("../../assets/images/call_green.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
  keyboardAvoid() {
    return (
      <View style={styles.container} behavior="padding" enabled>
        <View>{this.header()}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerInside: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    alignItems: "center"
  },
  titleIcon: {
    width: "100%",
    marginTop: heightPercentageToDP("20%"),
    width: 320,
    height: 150
  },
  rfs_title: {
    marginTop: 30,
    fontSize: 28,
    marginTop: heightPercentageToDP("15%"),
    width: widthPercentageToDP("90%"),
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold"
  },
  rfs_subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: widthPercentageToDP("90%"),
    color: "#808080"
  },
  rfs_number: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: heightPercentageToDP("8%"),
    textAlign: "center",
    width: widthPercentageToDP("90%"),
    color: "#00a213"
  },
  viewBtnCall: {
    alignItems: "center",
    width: DEVICE_WIDTH,
    marginTop: widthPercentageToDP("8%")
  },
  btnCall: {
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 40
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
