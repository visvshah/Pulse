
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { auth } from './firebase';
import { Video, ResizeMode } from 'expo-av';

// const videos = [
//   "https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Fsatisfying3.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b",
//   "https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2F0f83a8a9-e6c2-8120-b2bd-133916be66cc?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//   "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
// ];

const ScrollScreen = ({route}) => {
  const { videos } = route.params
  const temp = videos.map(video => video.video_link);
  const titles = videos.map(video => video.topic_name);

  useEffect(() => {
    console.log(videos);
  }, []);

  const user = auth.currentUser;
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const windowDimensions = useWindowDimensions();

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // Navigate back to the sign-in screen
      navigation.navigate('SignIn');
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={temp}
        renderItem={({ item, index }) => (
          <VideoItem item={item} shouldPlay={index === currentViewableItemIndex} windowDimensions={windowDimensions} titles={titles} currentViewableItemIndex={currentViewableItemIndex} />
        )}
        keyExtractor={item => item}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <View style={styles.mainContent}>
        <Text style={styles.descriptionText}>
          Logged in as: {user ? user.email : ''}
        </Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </View>
  ); 
};

const VideoItem = ({ item, shouldPlay, windowDimensions, titles, currentViewableItemIndex }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
        videoRef.current.setPositionAsync(0);
      }
    }
  }, [shouldPlay]);

  return (
    // <Pressable onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}>
    //   <View style={{ width: windowDimensions.width, height: windowDimensions.height }}>
    //   <Text style={styles.topicName}>{titles[shouldPlay ? currentViewableItemIndex : 0]}</Text>
    //     <Video
    //       ref={videoRef}
    //       source={{ uri: item }}
    //       style={styles.video}
    //       isLooping
    //       resizeMode={ResizeMode.COVER}
    //       useNativeControls={false}
    //       onPlaybackStatusUpdate={status => setStatus(() => status)}
    //     />
    //   </View>
    // </Pressable>
    <Pressable onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}>
    <View style={{ width: windowDimensions.width, height: windowDimensions.height, position: 'relative' }}>
      <Video
        ref={videoRef}
        source={{ uri: item }}
        style={styles.video}
        isLooping
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.overlayContainer}>
        <Text style={styles.topicName}>{titles[shouldPlay ? currentViewableItemIndex : 0]}</Text>
      </View>
    </View>
  </Pressable>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    alignItems: 'center',
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  overlayContainer: {
    position: 'absolute',
    top: 32,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent black background
    padding: 10,
    alignItems: 'center',

  },
  
  topicName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default ScrollScreen;
