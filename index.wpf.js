/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { NativeModules } from 'react-native';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AppRegistry
} from 'react-native';

// var app = require('express')();
// var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

export default class Vesal_PC extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.js
        </Text>
        <Text style={styles.instructions}>
          Press Ctrl+R to reload,{'\n'}
          Ctrl+D or Ctrl+M for dev menu
        </Text>
        <Button
        title="测试1"
      onPress={() =>NativeModules.MyDialogModel.testMethod()}
      ></Button>
              <Button
        title="显示"
      onPress={() =>NativeModules.MyDialogModel.show()}
      ></Button>
              <Button
        title="隐藏"
      onPress={() =>NativeModules.MyDialogModel.hide()}
      ></Button>
        <Button
        title="测试2"
      onPress={() =>
        Alert.alert(
          '提醒',
          '确定要退出吗?',
          [
            {
              text: '取消',
              onPress: () => {Alert.alert('点击取消')}
            },
            {
              text: '确定',
              onPress: () => {Alert.alert("abc "+NativeModules.MyDialogModel.testMethod())},
            },
          ],
          {cancelable: true},
        )
      }>
    </Button>
    <Button
    title = "测试3"
    onPress={()=>{NativeModules.MyDialogModel.showLog("123");
      NativeModules.MyDialogModel.showAlert(
      { title: 'Sample alert', message: 'This is just a test',buttonPositive:'haha',buttonNegative:'hehe' },
      (errorMsg) => console.warn(`Error ocurred: ${errorMsg}`),
      (action, buttonKey) => {
        console.log(`Action key == ${action}`);
        console.log(`Button key == ${buttonKey}`);
      })}}
    ></Button>
     <Button
    title = "测试4"
    onPress={()=>{NativeModules.MyDialogModel.testMethod2();}}
    ></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Vesal_PC', () => Vesal_PC);



// DialogModule.showAlert(
//   { title: 'Sample alert', message: 'This is just a test' },
//   (errorMsg) => console.warn(`Error ocurred: ${errorMsg}`),
//   (action, buttonKey) => {
//     console.log(`Action key ${action}`);
//     console.log(`Button key ${buttonKey}`);
//   });