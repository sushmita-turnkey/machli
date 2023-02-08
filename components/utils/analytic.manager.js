/*jshint esversion: 6 */

//import liraries
import React, { Component } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; import Analytics from "appcenter-analytics";

export async function logAnalytics(eventDictionary) {
  Analytics.trackEvent(eventDictionary);
}
// create a component
class AnalyticManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnalyticEnabled: false
    };
  }

  loadAnalyticManager() {
    const value = AsyncStorage.getItem("IS_ANALYTICS_ENABLED");
    if (value !== null) {
      Analytics.setEnabled(value);
      this.setState({ isAnalyticEnabled: value });
    }
  }
}

//make this component available to the app
export default AnalyticManager;
