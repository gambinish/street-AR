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
            : 'md-information-circle'
          }
        />
      ),
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
            : 'md-information-circle'
          }
        />
      )
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
            : 'md-information-circle'
          }
        />
      )
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
            : 'md-information-circle'
          }
        />
      )
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
            : 'md-information-circle'
          }
        />
      )
    }
  }
});

// const HomeStack = createStackNavigator({
//   Home: HomeScreen,
// });

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'md-information-circle'
//       }
//     />
//   ),
// };

// const MapStack = createStackNavigator({
//   Map: MapScreen,
// });

// MapStack.navigationOptions = {
//   tabBarLabel: 'Map',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios'
//         ? 'ios-options'
//         : 'md-options'}
//     />
//   ),
// };

// const ScrollStack = createStackNavigator({
//   Scroll: ScrollScreen,
// });

// ScrollStack.navigationOptions = {
//   tabBarLabel: 'Scroll',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios'
//         ? 'ios-options'
//         : 'md-options'}
//     />
//   ),
// };

// const ClarifaiStack = createStackNavigator({
//   Clarifai: ClarifaiScreen,
// });

// ClarifaiStack.navigationOptions = {
//   tabBarLabel: 'AI',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios'
//         ? 'ios-options'
//         : 'md-options'}
//     />
//   ),
// };

// const SceneStack = createStackNavigator({
//   Scene: Scene,
// });

// SceneStack.navigationOptions = {
//   tabBarLabel: 'Scene',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios'
//         ? 'ios-options'
//         : 'md-options'}
//     />
//   ),
// };

// export default createBottomTabNavigator({
//   HomeStack,
//   MapStack,
//   ScrollStack,
//   SceneStack,
//   ClarifaiStack
// });
