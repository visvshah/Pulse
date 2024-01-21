//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import { auth } from './firebase';
import { Video, Audio } from 'expo-av';


const LoggedInScreen = () => {
  const user = auth.currentUser;
  const url =
    'https://firebasestorage.googleapis.com/v0/b/auth-development-f2bc9.appspot.com/o/videos%2Foutput.mp4?alt=media&token=c0dbd634-79eb-4978-b231-8343e693ca4b';

  const videoRef = useRef(null);
  const [lessons, setLessons] = useState([]);


  // useEffect(init(), []);
  // const init = async()=> {
  //   if (user) {
  //     console.log('User email: ', user.email);
  //   }
  //   const res = await fetch("http://localhost:3000/api/pullLessons");
  //   const json = await res.json();
  //   console.log(json);
  //   for (let i = 0; i < json.length; i++) {
  //     if (json[i].userid == user.email) {
  //       setLessons((prevLessons) => [...prevLessons, {topics: json[i].topics, lesson_name: json[i].lesson_name}]);
  //     }
  //    }
  // }

  useEffect(() => {
    init();
  }, [user]);
  
  const init = async () => {
    if (user) {
      console.log('User email: ', user.email);
    }
    try {
      const res = await fetch("http://localhost:3000/api/pullLessons");
      const json = await res.json();
      console.log(json);
  
      const userLessons = json.filter(lesson => lesson.userid === user.email);
      setLessons(userLessons.map(lesson => ({ topics: lesson.topics, lesson_name: lesson.lesson_name })));
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  
  const handleSignOut = () => {
    auth.signOut().then(() => {
      // Navigate back to the sign-in screen
      navigation.navigate('SignIn');
    });
  };

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
  if (lessons.length == 0) {
    return (
      <View style={styles.container}>
        <Text>
          No Lessons Created!
        </Text>
      </View>
      );
  }
  return (
    <View style={styles.container}>
      {lessons.map((l) => (
        <Text>
          l.lesson_name
        </Text>
      ))

      }
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});



export default LoggedInScreen;