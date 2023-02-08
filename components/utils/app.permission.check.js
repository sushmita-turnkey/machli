/*jshint esversion:6 */
/*jshint esversion:8 */

import React, { Component } from "react";
import { PermissionsAndroid } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default class AppPermissionCheck extends Component {
  isNetworkConnected() {
    NetInfo.isConnected.fetch().then(isConnected => {
      return isConnected;
    });
  }
  /*
  async checkStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
          [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE],
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
*/
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
