import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event, useTrackPlayerEvents } from 'react-native-track-player';

const musicList = [
  "https://cdn.pixabay.com/download/audio/2021/09/25/audio_769e1c9f43.mp3",
  "https://cdn.pixabay.com/download/audio/2021/09/25/audio_1a93a684e6.mp3",
  "https://cdn.pixabay.com/download/audio/2023/02/09/audio_17b88448a2.mp3",
  "https://cdn.pixabay.com/download/audio/2022/10/11/audio_656a61331a.mp3"
]

const App = () => {
  TrackPlayer.registerPlaybackService(() => require('./service'));
  useEffect(() => {
    TrackPlayer.setupPlayer();

    return () => {
      TrackPlayer.reset();
    }
  }, [])

  useTrackPlayerEvents([Event.PlaybackState, Event.RemoteJumpBackward, Event.RemoteJumpForward], (event) => {
    if (event.type == Event.PlaybackState) {
      if (event.state != 'idle') {
        console.log("PlaybackState", event.state);
      }
    }
    if (event.type == Event.RemoteJumpBackward)
      handleSkipBackward();
    if (event.type == Event.RemoteJumpForward)
      handleSkipForward();
  });

  const handleSkipForward = useCallback(async (millis = 10) => {
    const position = await TrackPlayer.getPosition();
    console.log("position1", position, millis);
    await TrackPlayer.seekTo((position + millis));
  }, []);

  const handleSkipBackward = useCallback(async (millis = 10) => {
    const position = await TrackPlayer.getPosition();
    console.log("position2", position, millis);
    await TrackPlayer.seekTo((position - millis));
  }, []);

  const init = async () => {
    await TrackPlayer.reset();
    const randomIndex = Math.floor(Math.random() * musicList.length);
    const trackInfo = {
      id: randomIndex,
      url: musicList[randomIndex],
      title: musicList[randomIndex]?.split("/").pop(),
      artist: "test",
      artwork: "https://www.shutterstock.com/image-vector/sample-stamp-rubber-style-red-260nw-1811246308.jpg",
      duration: 100,
    };

    await TrackPlayer.add(trackInfo);
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
      },
      progressUpdateEventInterval: 5000,
      // stopWithApp: false,
      forwardJumpInterval: 10,
      backwardJumpInterval: 10,
      jumpInterval: 10,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.SeekTo,
        Capability.Stop
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
    });
    await TrackPlayer.play();
  }

  const play = async () => {
    await TrackPlayer.play();
  }
  const pause = async () => {
    await TrackPlayer.pause();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={init}>
        <Text>Load Random Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={play}>
        <Text>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pause}>
        <Text>Pause</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;