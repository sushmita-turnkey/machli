/*jshint esversion: 6 */
/*jshint esversion: 8 */
//import libraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  BackHandler
} from "react-native";

const DefaultEnvironment = "Production";
// create a component
const contentArray = [
  { display_Name: "Ocean State Forecast", key_identifier: "GET_OSF_API" },
  { display_Name: "Text To Speech", key_identifier: "GET_TEXT_TO_SPEECH" },
  {
    display_Name: "Landing Center",
    key_identifier: "GET_LANDING_CENTER_API"
  },
  {
    display_Name:"PFZ",
    key_identifier:"GET_PFZ_API"
  },

  { display_Name: "App Config", key_identifier: "GET_APP_CONFIG" },
  {
    display_Name: "App Localization",
    key_identifier: "GET_APP_LOCALIZATION"
  },
  { display_Name: "Login", key_identifier: "GET_LOGIN_API" },
  {
    display_Name: "User Registration",
    key_identifier: "USER_REGISTRATION_API"
  },
  {
    display_Name: "User Feedback",
    key_identifier: "GET_USER_FEEDBACK_API"
  },
  { display_Name: "User Profile", key_identifier: "GET_USER_PROFILE_API" },
  {
    display_Name: "Device Registration for notification",
    key_identifier: "DEVICE_REGISTRATION_FOR_REMOTE_NOTIFICATION"
  }
  //,
  //  { display_Name: "Audio Clip", key_identifier: "Get_Audio_Clip" }
];

class ChangeEnvironment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentArray: [],
      selectedEnvironmentDict: {},
      changedEnvironment: true
    };
  }

  displayData = async keyName => {
    try {
      var user = await AsyncStorage.getItem(keyName);
      if (user === null || typeof user === undefined) {
        user = DefaultEnvironment;
      }
      return user;
    } catch (error) {
      alert(error);
    }
  };
  onSelect = async data => {
    await this.setState(data);
    this.reloadContent();
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );

    this.reloadContent();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  handleBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.reloadData({ reloadSupportingLanguages: true });
    return true;
  };
  async reloadContent() {
    if (this.state.changedEnvironment) {
      var i;
      var dicts = {};
      var keys = [];
      contentArray.map(item => keys.push(item.key_identifier));
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        var s = await this.displayData(key);
        dicts[key] = s;
      }
      this.setState({ selectedEnvironmentDict: dicts });
      this.setState({ changedEnvironment: false });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Select API</Text>

        <FlatList
          data={contentArray}
          renderItem={item => this.renderItem(item)}
          extraData={this.state}
          numColumns={1}
          keyExtractor={item => item.key_identifier}
          style={styles.gridContainer}
        />
      </View>
    );
  }
  selectItem = data => {
    this.props.navigation.navigate("EnvironmentSelection", {
      data,
      onSelect: this.onSelect
    });
  };

  renderItem = data => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}
    >
      <View style={styles.contentPanel}>
        <Text style={styles.apiName}>{data.item.display_Name}</Text>
        <Text style={styles.apiEnvironment}>
          {this.state.selectedEnvironmentDict[data.item.key_identifier]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  contentPanel: {
    backgroundColor: "#036350",
    height: 70,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    flex: 1,
    flexDirection: "row"
  },
  apiName: {
    width: 350,
    flex: 1,
    fontSize: 16,
    textAlign: "left",
    marginLeft: 20,
    height: 70,
    color: "#ffffff"
  },
  header: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center"
  },
  gridContainer: {
    marginTop: "10%",
    marginBottom: "5%",
    width: "90%",
    height: "75%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  apiEnvironment: {
    width: "30%",
    flex: 2,
    fontSize: 16,
    textAlign: "right",
    marginRight: 20
  }
});

//make this component available to the app
export default ChangeEnvironment;
