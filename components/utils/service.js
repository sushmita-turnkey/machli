/*jshint esversion: 6 */
/*jshint esversion: 8 */
/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import MediaPlayer from "react-native-track-player";

module.exports = async function() {
  MediaPlayer.addEventListener("remote-play", () => {
    MediaPlayer.play();
  });

  MediaPlayer.addEventListener("remote-pause", () => {
    MediaPlayer.pause();
  });

  MediaPlayer.addEventListener("remote-next", () => {
    MediaPlayer.skipToNext();
  });

  MediaPlayer.addEventListener("remote-previous", () => {
    MediaPlayer.skipToPrevious();
  });

  MediaPlayer.addEventListener("remote-stop", () => {
    MediaPlayer.destroy();
  });
};
