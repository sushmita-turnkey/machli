/*jshint esversion: 6 */
/*jshint esversion: 8 */
import React, { Component } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; import APIConfig from "../config/api.config";
import { APPCONSTANTS } from "../utils/app.constant";
import apiRequest from "./api.request";
import {
  subscriptionKey,
  getAppConfig,
  getAppLocalization
} from "./app.create.api";
import { API_NAME } from "./app.constant";
export default class AppLocalization extends Component {
  async syncAppConfig() {
    var baseURL = await getAppConfig();
    var subscriptionKeyValue = await subscriptionKey("GET_APP_CONFIG");
    var response = {};
    var data = {
      app_id: APIConfig.Machli_APP_ID
    };
    try {
      response = await apiRequest(baseURL, data, true, subscriptionKeyValue);
      await AsyncStorage.setItem(
        APPCONSTANTS.LOCALIZATION_SUPPORTED_LANGUAGE,
        JSON.stringify(response.supported_languages)
      );
    } catch (error) {
      console.log(error);
    }
    AsyncStorage.multiSet([
      [APPCONSTANTS.APP_ID, response.app_id],
      [APPCONSTANTS.LOCALIZATION_VERSION_NUMBER, response.version],
      [APPCONSTANTS.LOCALIZATION_UPDATED_DATE, response.localization_updated]
    ]);
    return response.supported_languages;
  }

  async syncAppLocalization(languageCode) {
    try {
      var previous_selected_language = await AsyncStorage.getItem(
        "PREVIOUS_SELECTED_LANGUAGE"
      );
      languageCode = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
      if (previous_selected_language !== languageCode) {
        await AsyncStorage.removeItem(APPCONSTANTS.LOCALIZED_TITLES);
      }
      var baseURL = await getAppLocalization();
      var subscriptionKeyValue = await subscriptionKey("GET_APP_LOCALIZATION");
      var data = {
        app_id: APIConfig.Machli_APP_ID,
        language: languageCode
      };
      response = await apiRequest(baseURL, data, true, subscriptionKeyValue);
      var localizationResponse = response.localisation_strings;
      await AsyncStorage.setItem("PREVIOUS_SELECTED_LANGUAGE", languageCode);
      await AsyncStorage.setItem(
        APPCONSTANTS.LOCALIZED_TITLES,
        JSON.stringify(localizationResponse)
      );
    } catch (err) {
      console.log(err);
    }
  }
}
