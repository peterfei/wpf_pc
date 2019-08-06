/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,
  TouchableHighlight,
  DeviceEventEmitter,
  AsyncStorage
} from 'react-native';
import _ from "lodash";

import UnityView from "../../UnityView";
import  CryptoJS from  "crypto-js";
import { storage } from "../Public/storage";
import { NativeModules } from "react-native";

export default class MainScreen extends Component {
  listeners = {
    update: DeviceEventEmitter.addListener(
      "UnityWinEmitter",
      ({ ...passedArgs }) => {
        let _key = passedArgs.modalVisible;
        //alert(_key)
        if (_key != "") {
          this.setState({
            modalVisible: _key
          });
        }
      }
    ),
    
  };
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lodash
    _.each(this.listeners, listener => {
      listener.remove();
    });
    this.timer && clearInterval(this.timer);
  }
  static navigationOptions = {
    title:'Main',
  }
  state = {
    modalVisible: "flex",
    width:0,
    height:0,
    currentIndex:"Main",
    userName:'',
    password:'',
    AESuserName:'',
    AESpassword:'',
  };
  showPerson(){
    this.setState({
      currentIndex:"Person",
      modalVisible:"none"
    });
    this.props.navigation.navigate('Person');
  };
  showMalls(){
    this.setState({
      currentIndex:"Malls",
      modalVisible:"none"
    });
    this.props.navigation.navigate('Malls');
  };
  async componentDidMount(){
    let AESuserName =await storage.get("userName", "")
    let userName=CryptoJS.AES.decrypt(AESuserName, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8); 
    let AESpassword =await storage.get("password", "")
    let password=CryptoJS.AES.decrypt(AESpassword, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8); 
    let AEStoken = await storage.get("token", "")
    let token =CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let mainHeight = await NativeModules.MyDialogModel.getMainHeight();
      let mainWidth = await NativeModules.MyDialogModel.getMainWidth();
    this.setState({
      AESuserName:AESuserName,
      userName:userName,
      AESpassword:AESpassword,
      password:password,
      token:token,
      height: mainHeight-20,
      width: mainWidth
    })
    //alert(`height is ${this.state.height}`)
  }
  render() {
    return (
      <View style={styles.container}>
          {/* <UnityView   
            height={this.state.height}
            width={this.state.width}
            display={this.state.modalVisible}
            
            >
          </UnityView> */}

        {/* 1.1.主界面按钮 */}
        <View style={{
                    position:"absolute",
                    right:50,
                    top:50,
                    }}>
                <TouchableHighlight
                  onPress={() => {
                    this.showPerson();
                  }}
                >
                  <Text style={{fontWeight:'bold'}}>个人中心</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this.showMalls();
                  }}
                >
                  <Text style={{fontWeight:'bold'}}>商城</Text>
                </TouchableHighlight>
                <View style={{width:200,margin:20}}>
                <Text style={{fontWeight:'bold',margin:10}}>AES用户名：{this.state.AESuserName}</Text>
                <Text style={{fontWeight:'bold',margin:10}}>AES密&nbsp;&nbsp;码：{this.state.AESpassword}</Text>
                <Text style={{fontWeight:'bold',margin:10}}>用户名：{this.state.userName}</Text>
                <Text style={{fontWeight:'bold',margin:10}}>密&nbsp;&nbsp;码：{this.state.password}</Text>
                </View>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  component:{
    flex: 1,
    width:"100%",
    height:"100%",
    justifyContent: 'center',
    alignItems: 'center',
  }
});
