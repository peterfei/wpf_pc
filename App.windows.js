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

import PersonScreen from "./component/Person/PersonScreen";
import MallsScreen from "./component/Malls/MallsScreen";
import MainScreen from './component/Main/MainScreen';
import PayScreen from './component/Pay/PayScreen';
import LoginScreen from './component/Login/LoginScreen';
import RegisterScreen from './component/Register/RegisterScreen';
import FindScreen from './component/Find/FindScreen';
import InitializeScreen from './component/Initialize/InitializeScreen';

const RootStack = createStackNavigator( //跟路由
  {//定义模块
    Main: {screen: MainScreen},
    Person: {screen: PersonScreen,},
    Malls: {screen: MallsScreen,},
    Pay: {screen: PayScreen},
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    Find: {screen: FindScreen},
    Initialize: {screen: InitializeScreen},
  },
  {
    initialRouteName: 'Initialize',     //设置初始路由为Home
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
  constructor(props) {
    super(props);
    //this._bootstrapAsync();
  }
  // _bootstrapAsync = async () => {
  //   const userName = await AsyncStorage.getItem("userName");
  //   const password = await AsyncStorage.getItem("password");
  //   if (userName !== null && userName != "" && password != null && password != "") {
  //     this.props.navigation.navigate('Main');
  //   } else {
  //     this.props.navigation.navigate('Login');
  //   }
  // };
  render() {                            //将Navigation作为根路径导出
    return <RootStack />;
  }
}