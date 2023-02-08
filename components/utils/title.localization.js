/*jshint esversion: 6 */

import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';//import localizedJSONTelugu from "../../assets/localization/IN-TE.json";
import localizedJSONEngish from "../../assets/localization/IN-EN.json";
//import localizedJSONTamil from "../../assets/localization/IN-TA.json";
import { APPCONSTANTS } from "../utils/app.constant";

export default async function getObjectForKey(key) {
  /* var lang;
  var jsonValue;
  try {
    lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
  } catch (error) {
  }
  if (lang == "English") {
    jsonValue = localizedJSONEngish;
  } else if (lang == "Telugu") {
    jsonValue = localizedJSONTelugu;
  } else if (lang == "Tamil") {
    jsonValue = localizedJSONTamil;
  }
  return jsonValue[key];*/
  //var localisedString = await AsyncStorage.getItem(key);
  var localizedJSON = JSON.parse(
    await AsyncStorage.getItem(APPCONSTANTS.LOCALIZED_TITLES)
  );
  var localisedStringForDisplay = localizedJSON[key];
  if (
    typeof localisedStringForDisplay === "undefined" ||
    localisedStringForDisplay === null
  ) {
    localisedStringForDisplay = localizedJSONEngish[key];
  }

  return localisedStringForDisplay;
}
