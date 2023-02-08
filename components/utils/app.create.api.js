/*jshint esversion: 6 */
/*jshint esversion: 8 */

//import libraries
import AsyncStorage from '@react-native-async-storage/async-storage'; import APIConfig from "../config/api.config";
import { API_NAME } from "./app.constant";
// create a component
const kProductionSecretKey = "d446cea9b0264a5188ed82888dd36eba";
const kDeveloperSecretKey = "f364503e7dad48b5ae38a2ccfaaeeb93";

export async function getBaseURL(API_KEY_NAME) {
  let selectedEnvironment = await AsyncStorage.getItem(API_KEY_NAME);
  if (__DEV__) {
    if (selectedEnvironment === "Production") {
      return APIConfig.Base_URL;
    } else if (selectedEnvironment === "Staging") {
      return APIConfig.Staging_Base_URL;
    } else if (selectedEnvironment === "Development") {
      return APIConfig.Dev_Base_URL;
    } else if (selectedEnvironment === "AIX") {
      return APIConfig.AIX_Base_URL;
    } else {
      return APIConfig.Base_URL;
    }
  } else {
    console.log(
      "Base URL got called selected Environment 2" + APIConfig.Base_URL
    );

    return APIConfig.Base_URL;
  }
}
export async function subscriptionKey(API_KEY_NAME) {
  const selectedEnvironment = await AsyncStorage.getItem(API_KEY_NAME);
  var keyName = kProductionSecretKey;
  if (__DEV__) {
    if (
      selectedEnvironment === "Staging" ||
      selectedEnvironment === "Development"
    ) {
      keyName = kDeveloperSecretKey;
    }
  }
  return keyName;
}
export async function getLoginAPI() {
  const baseURL = await getBaseURL(API_NAME.GET_LOGIN_API);
  const urlString = baseURL + APIConfig.Get_User_Profiles_API.urlPath;
  return urlString;
}
export async function getUserRegistrationAPI() {
  const baseURL = await getBaseURL(API_NAME.USER_REGISTRATION_API);
  const urlString = baseURL + APIConfig.New_User_Registration.urlPath;
  return urlString;
}
export async function getLandingCenterAPI() {
  const baseURL = await getBaseURL(API_NAME.GET_PFZ_API);
  const urlString = baseURL + APIConfig.Get_Landing_Site.urlPath;
  return urlString;
}
export async function getNewPFZScreenAPI() {
  const baseURL = await getBaseURL(API_NAME.GET_PFZ_API);
  const urlString = baseURL + APIConfig.Get_PFZ.urlPath;
  return urlString;
}
export async function getOceanStateForecastsAPI() {
  var baseURL = await getBaseURL(API_NAME.GET_OSF_API);
  var urlString = baseURL + APIConfig.Get_OSF.urlPath;
  return urlString;
}
export async function getUserFeedbackAPI() {
  var baseURL = await getBaseURL(API_NAME.GET_USER_FEEDBACK_API);
  var urlString = baseURL + APIConfig.User_Feedback.urlPath;
  return urlString;
}
export async function getUserProfile() {
  var baseURL = await getBaseURL(API_NAME.GET_USER_PROFILE_API);
  var urlString = baseURL + APIConfig.Get_User_Profiles_API.urlPath;
  return urlString;
}
export async function registerForRemoteNotification() {
  var baseURL = await getBaseURL(
    API_NAME.DEVICE_REGISTRATION_FOR_REMOTE_NOTIFICATION
  );
  var urlString = baseURL + APIConfig.Register_Device_For_Notification.urlPath;
  return urlString;
}
export async function getAppConfig() {
  var baseURL = await getBaseURL(API_NAME.GET_APP_CONFIG);
  var urlString = baseURL + APIConfig.Get_App_Config.urlPath;
  return urlString;
}
export async function getAppLocalization() {
  var baseURL = await getBaseURL(API_NAME.GET_APP_LOCALIZATION);
  var urlString = baseURL + APIConfig.Get_App_Localization.urlPath;
  return urlString;
}
export async function getTextToSpeech() {
  var baseURL = await getBaseURL(API_NAME.GET_TEXT_TO_SPEECH);
  var urlString = baseURL + APIConfig.Get_Text_To_Speech.urlPath;
  return urlString;
}
export async function getAudioClip() {
  var baseURL = await getBaseURL(API_NAME.GET_AUDIO_CLIP);
  var urlString = baseURL + APIConfig.Get_Audio_Clip.urlPath;
  return urlString;
}

