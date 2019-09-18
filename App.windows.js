/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,AsyncStorage
} from 'react-native';
import { createStackNavigator} from 'react-navigation';

import PersonScreen from "./screen/Person/PersonScreen";
import MallsScreen from "./screen/Malls/MallsScreen";
import HomeScreen from './screen/Home/HomeScreen';
import PayScreen from './screen/Pay/PayScreen';
import LoginScreen from './screen/Login/LoginScreen';
import RegisterScreen from './screen/Register/RegisterScreen';
import FindScreen from './screen/Find/FindScreen';
import InitializeScreen from './screen/Initialize/InitializeScreen';

const RootStack = createStackNavigator( //跟路由
  {//定义模块
    Home: {screen: HomeScreen},
    Person: {screen: PersonScreen,},
    Malls: {screen: MallsScreen,},
    Pay: {screen: PayScreen},
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Find: {screen: FindScreen},
    Initialize: {screen: InitializeScreen},
  },
  {
    initialRouteName: 'Login',     //设置初始路由为Home
    mode:'card',
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
  constructor(props) {
    super(props);
  }
  render() {                            //将Navigation作为根路径导出
    return <RootStack />;
  }
}