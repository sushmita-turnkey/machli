/*jshint esversion: 6 */

import APIRequest from "./api.request";
import AsyncStorage from '@react-native-async-storage/async-storage'; import AppCenter from "appcenter";
import Analytics from "appcenter-analytics";
import APIConfig from "../config/api.config";
import {
  subscriptionKey,
  registerForRemoteNotification
} from "./app.create.api";
import { API_NAME } from "./app.constant";
export default async function registerNotification() {
  if (__DEV__) {
    return;
  }
  await Analytics.trackEvent("Check for device Registration");
  const installId = await AppCenter.getInstallId(); // Returned as a string
  var userID = await AsyncStorage.getItem("User_ID");
  if (userID == null) {
    return;
  }
  await Analytics.trackEvent("Notification registration started");

  await AppCenter.setUserId(userID);
  if (userID.length > 0) {
    var data = {
      userId: userID,
      notifToken: installId
    };
    var baseURL = await registerForRemoteNotification();
    var subscriptionKeyValue = await subscriptionKey(
      "DEVICE_REGISTRATION_FOR_REMOTE_NOTIFICATION"
    );
    var response = await apiRequest(baseURL, data, true, subscriptionKeyValue);

    if (response.status.code == 201) {
      await Analytics.trackEvent("Notification registration Success", {
        Response: JSON.stringify(response)
      });
    } else {
      await Analytics.trackEvent("Notification registration Failed", {
        "API Response": JSON.stringify(response),
        "API Request": JSON.stringify(data)
      });
    }
  } else {
    await Analytics.trackEvent(
      "Notification registration userID : UserID not available"
    );
  }
}
