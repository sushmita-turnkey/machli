/*jshint esversion: 6 */
/*jshint esversion: 8 */

//import libraries
import { Component } from "react";
import apiRequest from "./api.request";
import MediaPlayer from "./audio.player";
import AsyncStorage from '@react-native-async-storage/async-storage'; import { subscriptionKey, getTextToSpeech } from "../utils/app.create.api";
// create a component
class AppSpeak extends Component {
  constructor(props) {
    super(props);
    this.readMyText = this.readMyText.bind(this);
    mediaPlayer = new MediaPlayer();
    this.state = { base64String: "" };
  }
  async readMyText(textValue, textIdentifier, isAPIResponseReceived) {
    lang = await AsyncStorage.getItem("DEFAULT_LANGUAGE");
    this.setState({ base64String: "" });
    var data = {
      text: textValue,
      language: lang,
      format: "wav",
      voice_gender: "female"
    };
    var baseURL = await getTextToSpeech();
    var subscriptionKeyValue = await subscriptionKey("GET_TEXT_TO_SPEECH");
    var response = await apiRequest(baseURL, data, true, subscriptionKeyValue);

    isAPIResponseReceived = true;
    mediaPlayer.playAudioBase64(response.result.data, textIdentifier);
  }
  async readMyBase64Audio(base64Audio, textIdentifier) {
    mediaPlayer.playAudioBase64(base64Audio, textIdentifier);
  }

  async stopSpeaking() {
    mediaPlayer.stopPlay();
  }
  async pauseSpeaking() {
    mediaPlayer.pauseAudio();
  }

  async resumeSpeaking() {
    mediaPlayer.resumeAudioPlay();
  }
}

//make this component available to the app
export default AppSpeak;
