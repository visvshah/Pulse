//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Pressable } from 'react-native';
import { auth } from './firebase';
import { Video, Audio } from 'expo-av';
import ScrollScreen from './ScrollScreen';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

const LoggedInScreen = ({navigation}) => {
  const user = auth.currentUser;

  const [lessons, setLessons] = useState([]);

  const init = async () => {
    if (user) {
      console.log('User email: ', user.email);
    }
    try {
      //TODO: Customize as per device pulse is running on
      const res = await fetch("http://100.69.253.209:3000/api/pullLessons");
      const json = await res.json();
      console.log(json);
  
      const userLessons = json.filter(lesson => lesson.userid === user.email);
      setLessons(userLessons.map(lesson => ({ topics: lesson.topics, lesson_name: lesson.lesson_name })));
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    init();
  }, [user]);
  
  const handleButtonPress = (topics) => {
    // Navigate to the ScrollScreen with l.topics as the prop
    // navigation.navigate('Scroll', { videos: l.topics });
    //const videoLinks = topics.map(topic => topic.video_link);
    //const topicNames = topics.map(topic => topic.topic_name);
    navigation.navigate('Scroll', { videos: topics});
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
  // return (
  //   <View style={styles.container}>
  //     {lessons.map((l, index) => (
  //       <View key={index} style={styles.lessonContainer}>
  //         <Text style={styles.lessonText}>{l.lesson_name}</Text>
  //       </View>
  //     ))}
  //   </View>
  // );
  return (
    <View style={styles.container}>
    {lessons.map((l, index) => (
      <Pressable key={index} onPress={()=>handleButtonPress(l.topics)} style={styles.button}>
        <Text style={styles.buttonText}>{l.lesson_name}</Text>
      </Pressable>
    ))}
  </View>
  )
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color
    padding: 20, // Padding around the container
  },
  
  button: {
    backgroundColor: '#e75480', // Button background color
    padding: 15, // Padding inside the button
    borderRadius: 10, // Border radius for rounded corners
    marginVertical: 10, // Vertical margin between buttons
  },
  
  buttonText: {
    color: 'white', // Text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold text
  },
  lessonContainer: {
    marginVertical: 10, // Vertical margin between lessons
    padding: 10, // Padding around each lesson
    borderWidth: 1, // Border for better visibility
    borderRadius: 5, // Rounded corners
    borderColor: '#ccc', // Border color
  },
  lessonText: {
    fontSize: 18, // Font size of the lesson name
    fontWeight: 'bold', // Bold text
  },
  
});



export default LoggedInScreen;