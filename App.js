import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Push from "appcenter-push";
import codePush from "react-native-code-push";
import Analytics from "appcenter-analytics";
import AppCenter from "appcenter";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const TabNavigator = createBottomTabNavigator({

  NewOSFScreen: {
    screen: NewOSFScreen,
    navigationOptions: {
      tabBarLabel: "OSF",
      tabBarOptions: {
        activeTintColor: '#000',
        tintColor: '#999999',

        labelStyle: {
          fontSize: 12,
          fontFamily: 'CircularStd-Bold',
        },
      },
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={
            focused
              ? require('./assets/img/ocean1.png')
              : require('./assets/img/ocean.png')}
          style={{ width: 30, height: 30, }} />
      )
    }
  },
  
  PFZ: {
    screen: PFZScreen,
    navigationOptions: {
      tabBarLabel: 'PFZ',
      tabBarOptions: {
        activeTintColor: '#000',
        tintColor: '#999999',

        labelStyle: {
          fontSize: 12,
          fontFamily: 'CircularStd-Bold',
        },
      },
      tabBarIcon: ({ tintColor, focused }) => (
        <Image
          source={
            focused
              ? require('./assets/img/pfz1.png')
              : require('./assets/img/pfz.png')}
          style={{ width: 30, height: 30, }} />
      )
    }
  },
 
}
);



const RootStack = createStackNavigator(
  // export default createAppContainer(
  //createStackNavigator(
  {
    UserLogin: {
      screen: UserLogin
    },
    OSFFishingSites: {
      screen: OSFFishingSites
    },
    UserRegistration: {
      screen: UserRegistration
    },
    AskUserLanguage: {
      screen: AskUserLanguage
    },
    AskUserName: {
      screen: AskUserName
    },
    MakeACall: {
      screen: MakeACall
    },
    ChangeEnvironment: {
      screen: ChangeEnvironment
    },
    EnvironmentSelection: {
      screen: EnvironmentSelection
    },

    NewOSFScreen: {
      screen: NewOSFScreen,
    },

    Home: TabNavigator,
  },
  {
    initialRouteName: "AskUserLanguage",
    headerMode: 'none',
    // initialRouteName:"NewPFZScreen",
  },
);


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
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
