import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ScrollScreen from '../screens/ScrollScreen';
import Scene from '../screens/Scene.js';
import ClarifaiScreen from '../screens/ClarifaiScreen'

console.disableYellowBox = true

export default NavigatingStack = createBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'ios-home'
          }
        />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      }
    }
  },
  Map: {
    screen: MapScreen,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'ios-map'
          }
        />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      }
    }
  },
  Scroll: {
    screen: ScrollScreen,
    navigationOptions: {
      tabBarLabel: 'Scroll',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'ios-list-box'
          }
        />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      }
    }
  },
  Scene: {
    screen: Scene,
    navigationOptions: {
      tabBarLabel: 'Scene',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'ios-cube'
          }
        />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      }
    }
  },
  Clarifai: {
    screen: ClarifaiScreen,
    navigationOptions: {
      tabBarLabel: 'AI',
      tabBarIcon: ({ focused }) => (
        <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'ios-camera'
          }
        />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
      }
    }
  }
},
{
  navigationOptions: {
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      defaultHandler();
    }
  },
});