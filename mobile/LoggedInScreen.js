



// // import React, { useEffect, useRef } from 'react';
// // import { View, Text, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
// // import { auth } from './firebase';
// // import { Video, Audio } from 'expo-av';


// // const LoggedInScreen = () => {
// //   const user = auth.currentUser;
// //   const url =
// //     'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b';

// //   const videoRef = useRef(null);

// //   // const triggerAudio = async (ref) => {
// //   //   await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
// //   //   ref.current.playAsync();
// //   // };
  
// //   useEffect(() => {
// //     // Check if the user is signed in
// //     //Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
// //     //triggerAudio(videoRef);
// //     const enableAudio = async () => {
// //       await Audio.setAudioModeAsync({
// //       allowsRecordingIOS: false,
// //       interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
// //       playsInSilentModeIOS: true,
// //       staysActiveInBackground: false,
// //       interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
// //       shouldDuckAndroid: false,
// //     })
// //   }
// //   enableAudio()
// //     if (user) {
// //       console.log('User email: ', user.email);
// //     }
// //   }, [user, videoRef]);

// //   const handleSignOut = () => {
// //     auth.signOut().then(() => {
// //       // Navigate back to the sign-in screen
// //       navigation.navigate('SignIn');
// //     });
// //   };

// //   const video = React.useRef(null);
// //   const [status, setStatus] = React.useState({});
// //   return (
// //     <TouchableWithoutFeedback onPress={() =>
// //       status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
// //     }>
// //     <View style={styles.container}>
// //       <Video
// //         ref={videoRef}
// //         style={styles.video}
// //         source={{
// //           uri: url,
// //         }}
// //         //useNativeControls
// //         //resizeMode={ResizeMode.CONTAIN}
// //         isLooping
// //         audioPan={0}
// //         volume={1.0}
// //         shouldPlay={true} 

// //         //onPlaybackStatusUpdate={status => setStatus(() => status)}
// //       />
// //     </View>
// //     </TouchableWithoutFeedback>
// //     );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   video: {
// //     flex: 1,
// //     width: '100%',
// //     height: '100%',
// //   },
// //   buttons: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginTop: 10,
// //   },
// //   mainContent: {
// //     alignItems: 'center',
// //   },
// //   descriptionText: {
// //     fontSize: 16,
// //     marginBottom: 16,
// //   },
// // });



// // export default LoggedInScreen;



// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Button } from 'react-native';
// import { auth } from './firebase';
// import { Video, Audio } from 'expo-av';

// const LoggedInScreen = () => {
//   const user = auth.currentUser;
//   const videoUrls = [
//     'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b',
//     'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b',
//     // Add more video URLs as needed
//   ];

//   const videoRef = useRef(null);

//   useEffect(() => {
//     // const enableAudio = async () => {
//     //   await Audio.setAudioModeAsync({
//     //     allowsRecordingIOS: false,
//     //     interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//     //     playsInSilentModeIOS: true,
//     //     staysActiveInBackground: false,
//     //     interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
//     //     shouldDuckAndroid: false,
//     //   });
//     // };

//     //enableAudio();

//     if (user) {
//       console.log('User email: ', user.email);
//     }
//   }, [user, videoRef]);

//   const handleSignOut = () => {
//     auth.signOut().then(() => {
//       // Navigate back to the sign-in screen
//       navigation.navigate('SignIn');
//     });
//   };

//   const togglePlayback = async () => {
//     if (video.current != null) {
//       if (status.isPlaying) {
//         await video.current.pauseAsync();
//       } else {
//         await video.current.playAsync();
//       }
//     }
//   };

//   const video = useRef(null);
//   const [status, setStatus] = React.useState({});

//   const renderItem = ({ item }) => (
//     <TouchableWithoutFeedback onPress={() =>
//         {
//           if (video.current) {
//             status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
//           }
//         }
//       }>
//         <View style={styles.container}>
//           <Video
//             ref={videoRef}
//             style={styles.video}
//             source={{
//               uri: videoUrls[0],
//             }}
//             isLooping
//             audioPan={0}
//             volume={1.0}
//             shouldPlay={true}
//           />
//         </View>
//       </TouchableWithoutFeedback>
//   );

//   return (
//     <TouchableWithoutFeedback onPress={togglePlayback}>
//       <View style={styles.container}>
//         <Video
//           ref={video}
//           style={styles.video}
//           source={{
//             uri: videoUrls[0],
//           }}
//           //useNativeControls
//           resizeMode="cover" // Adjust the resizeMode as needed
//           isLooping
//           onPlaybackStatusUpdate={(status) => setStatus(() => status)}
//           audioPan={0}
//           volume={1.0}
//           shouldPlay={true} 
//         />
//       </View>
//     </TouchableWithoutFeedback>
//     // <View style={styles.container}>
//     // <FlatList
//     //   data={videoUrls}
//     //   renderItem={renderItem}
//     //   keyExtractor={(item, index) => index.toString()}
//     //   pagingEnabled
//     //   horizontal
//     // />
//     // </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     video: {
//       flex: 1,
//       width: '100%',
//       height: '100%',
//     },
//     buttons: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       marginTop: 10,
//     },
//     mainContent: {
//       alignItems: 'center',
//     },
//     descriptionText: {
//       fontSize: 16,
//       marginBottom: 16,
//     },
//   });
  

// export default LoggedInScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { auth } from './firebase';
import { Video, ResizeMode } from 'expo-av';

const videos = [
  "https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Fsatisfying3.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b",
  "https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2F0f83a8a9-e6c2-8120-b2bd-133916be66cc?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

const LoggedInScreen = () => {
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
        data={videos}
        renderItem={({ item, index }) => (
          <VideoItem item={item} shouldPlay={index === currentViewableItemIndex} windowDimensions={windowDimensions} />
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

const VideoItem = ({ item, shouldPlay, windowDimensions }) => {
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
    <Pressable onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}>
      <View style={{ width: windowDimensions.width, height: windowDimensions.height }}>
        <Video
          ref={videoRef}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
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
});

export default LoggedInScreen;
