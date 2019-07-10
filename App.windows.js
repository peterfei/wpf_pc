/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,
  TouchableHighlight
} from 'react-native';
import { createStackNavigator} from 'react-navigation';

import PersonScreen from "./component/Person/PersonScreen";
import MallsScreen from "./component/Malls/MallsScreen";
import MainScreen from './component/Main/MainScreen';

const RootStack = createStackNavigator( //跟路由
  {//定义模块
    Main: {screen: MainScreen},
    Person: {screen: PersonScreen,},
    Malls: {screen: MallsScreen,},
  },
  {
    initialRouteName: 'Main',     //设置初始路由为Home
    mode:'modal',
    navigationOptions:{
      header:null,
      headerStyle:{
        //background:'red'
      },
      headerBackTitle:null,
      headerTintColor:'#333333',
      showIcon:true,
      animationEnabled:false,
      gesturesEnabled:false
    }
  }
);
export default class App extends Component {
  render() {                            //将Navigation作为根路径导出
    return <RootStack />;
  }
}