



// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
// import { auth } from './firebase';
// import { Video, Audio } from 'expo-av';


// const LoggedInScreen = () => {
//   const user = auth.currentUser;
//   const url =
//     'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b';

//   const videoRef = useRef(null);

//   // const triggerAudio = async (ref) => {
//   //   await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
//   //   ref.current.playAsync();
//   // };
  
//   useEffect(() => {
//     // Check if the user is signed in
//     //Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
//     //triggerAudio(videoRef);
//     const enableAudio = async () => {
//       await Audio.setAudioModeAsync({
//       allowsRecordingIOS: false,
//       interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//       playsInSilentModeIOS: true,
//       staysActiveInBackground: false,
//       interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
//       shouldDuckAndroid: false,
//     })
//   }
//   enableAudio()
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

//   const video = React.useRef(null);
//   const [status, setStatus] = React.useState({});
//   return (
//     <TouchableWithoutFeedback onPress={() =>
//       status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
//     }>
//     <View style={styles.container}>
//       <Video
//         ref={videoRef}
//         style={styles.video}
//         source={{
//           uri: url,
//         }}
//         //useNativeControls
//         //resizeMode={ResizeMode.CONTAIN}
//         isLooping
//         audioPan={0}
//         volume={1.0}
//         shouldPlay={true} 

//         //onPlaybackStatusUpdate={status => setStatus(() => status)}
//       />
//     </View>
//     </TouchableWithoutFeedback>
//     );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   mainContent: {
//     alignItems: 'center',
//   },
//   descriptionText: {
//     fontSize: 16,
//     marginBottom: 16,
//   },
// });



// export default LoggedInScreen;



import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { auth } from './firebase';
import { Video, Audio } from 'expo-av';

const LoggedInScreen = () => {
  const user = auth.currentUser;
  const videoUrls = [
    'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b',
    'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b',
    // Add more video URLs as needed
  ];

  const videoRef = useRef(null);

  useEffect(() => {
    // const enableAudio = async () => {
    //   await Audio.setAudioModeAsync({
    //     allowsRecordingIOS: false,
    //     interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    //     playsInSilentModeIOS: true,
    //     staysActiveInBackground: false,
    //     interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    //     shouldDuckAndroid: false,
    //   });
    // };

    //enableAudio();

    if (user) {
      console.log('User email: ', user.email);
    }
  }, [user, videoRef]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // Navigate back to the sign-in screen
      navigation.navigate('SignIn');
    });
  };

  const video = useRef(null);
  const [status, setStatus] = React.useState({});

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() =>
        {
          if (video.current) {
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
          }
        }
      }>
        <View style={styles.container}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{
              uri: videoUrls[0],
            }}
            isLooping
            audioPan={0}
            volume={1.0}
            shouldPlay={true}
          />
        </View>
      </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback onPress={() =>
      {
        if (video.current) {
          status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
        }
      }
    }>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: videoUrls[0],
          }}
          isLooping
          audioPan={0}
          volume={1.0}
          shouldPlay={true}
        />
      </View>
    </TouchableWithoutFeedback>
    // <View style={styles.container}>
    // <FlatList
    //   data={videoUrls}
    //   renderItem={renderItem}
    //   keyExtractor={(item, index) => index.toString()}
    //   pagingEnabled
    //   horizontal
    // />
    // </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    mainContent: {
      alignItems: 'center',
    },
    descriptionText: {
      fontSize: 16,
      marginBottom: 16,
    },
  });
  

export default LoggedInScreen;
