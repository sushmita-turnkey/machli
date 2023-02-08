/*jshint esversion: 6 */
/*jshint esversion: 8 */

import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import MediaPlayer from "react-native-track-player";
import RNFS from "react-native-fs";
import NetInfo from "@react-native-community/netinfo";
//import AppPermissionCheck from "./app.permission.check";

// create a component

const folderPath = RNFS.DocumentDirectoryPath;
class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.playAudioBase64 = this.playAudioBase64.bind(this);
  }
  componentWillMount() {
    MediaPlayer.updateOptions({
      // One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
      ratingType: MediaPlayer.RATING_5_STARS,
      // Whether the player should stop running when the app is closed on Android
      stopWithApp: false,
      // An array of media controls capabilities
      // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
      // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
      capabilities: [
        MediaPlayer.CAPABILITY_PLAY,
        MediaPlayer.CAPABILITY_PAUSE,
        MediaPlayer.CAPABILITY_STOP
      ],

      // An array of capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: [
        MediaPlayer.CAPABILITY_PLAY,
        MediaPlayer.CAPABILITY_PAUSE
      ],
      // Icons for the notification on Android (if you don't like the default ones)
      playIcon: require("../../assets/images/play.png"),
      pauseIcon: require("../../assets/images/pause.png"),
      stopIcon: require("../../assets/images/play.png"),
      previousIcon: require("../../assets/images/play.png"),
      nextIcon: require("../../assets/images/play.png"),
      icon: require("../../assets/images/play.png") // The notification icon
    });
  }

  componentDidMount() {
    //  console.log("Audio Player");
  }

  componentWillUnmount() {}

  fileDelete(filePath) {}

  fileCreate(filePath) {}
  /**
   * Convert Base64 to Audio
   */
  async convertBase64ToAudio(base64data, fileName) {
    const filePath = folderPath + "/" + fileName + ".wav";

    if (await RNFS.exists(filePath)) {
      await RNFS.unlink(filePath);
    }
    await RNFS.writeFile(filePath, base64data, "base64")
      .then(success => {})
      .catch(err => {});
    return filePath;
  }

  /**
   * Setup Audio player
   */
  setupAudioPlayer() {
    MediaPlayer.remove(["forecast_audio"]);
    MediaPlayer.reset();
    MediaPlayer.setupPlayer().then(() => {});
  }

  /**
   * Play Base64 data
   * @param {Base64 Data } base64data
   */
  async playAudioBase64(base64data, fileName) {
    MediaPlayer.remove(["forecast_audio"]);
    MediaPlayer.reset();
    this.setupAudioPlayer();
    var filePath = await this.convertBase64ToAudio(base64data, fileName);
    this.playAudio(filePath);
  }

  /**
   * @param {url} fileURL Play the audio from fileURL
   */
  async playAudio(fileURL) {
    var track = {
      id: "forecast_audio",
      url: fileURL
    };
    MediaPlayer.add(track).then(function() {
      // The tracks were added
    });

    MediaPlayer.play();
  }
  /**
   *
   * Stop the audio player
   */
  stopPlay() {
    MediaPlayer.stop();
    MediaPlayer.reset();
  }
  /**
   * Pause the audio player
   */
  pauseAudio() {
    MediaPlayer.pause();
  }

  /**
   * Pause the audio player
   */
  resumeAudioPlay() {
    MediaPlayer.play();
  }

  /**
   * Position, buffered position and duration return values in seconds
   */
  async progressIndicator() {
    let position = await MediaPlayer.getPosition();
    return position;
  }
  /**
   * Get current duration
   */
  async getDuration() {
    let duration = await MediaPlayer.getDuration();
    return duration;
  }
  /**
   * Seeks to a position in seconds. Can only be called after the player has been loaded
   * @param {*} seconds set position in seconds
   */
  playerSeekTo(seconds) {
    MediaPlayer.seekTo(seconds);
  }
  /**
   *
   * @param {Set } level set player volume in range of 0 to 1. In default, it is set as 0.5
   */
  playerSetVolume(level) {
    MediaPlayer.setVolume(level);
  }

  /**
   *  Get player's current state
   */
  async getPlayersCurrentState() {
    let state = await TrackPlayer.getState();
    return state;
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>MyClass</Text>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

//make this component available to the app
export default AudioPlayer;
