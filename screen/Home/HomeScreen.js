/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity,
  DeviceEventEmitter,
  AsyncStorage,NativeModules
} from 'react-native';
import _ from "lodash";

import UnityView from "../../UnityView";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";

export default class HomeScreen extends Component {
  
  static navigationOptions = {
    title: 'Home',
  }
  state = {
    modalVisible: "flex",
    width: 0,
    height: 0,
    userName: '',
    password: '',
    AESuserName: '',
    AESpassword: '',
  };
  listeners = {
    update: [DeviceEventEmitter.addListener(
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
    DeviceEventEmitter.addListener("testBind", data => {
      // alert(data);
      if (data == "hide") {
        // this.setState({ modalVisible: "none" });
      }
      else if(data=='OpenClientCenter'){
        // this.setState({ modalVisible: "none" });
        this.showPerson();
        // alert(1111)
      }
      else if(data=='ShowMall') {
        // this.setState({ modalVisible: "none" });
        this.showMalls();
      }
    })
    ]
  };
  componentWillUnmount() {
    // cleaning up listeners
    // I am using lod.ash
    _.each(this.listeners, listener => {
      listener[0].remove();
      listener[1].remove();
    });
    this.timer && clearInterval(this.timer);
  }
  showPerson() {
    this.setState({
      modalVisible: "none"
    });
    this.props.navigation.navigate('Person');
  };
  showMalls() {
    this.setState({
      modalVisible: "none"
    });
    this.props.navigation.navigate('Malls');
  };
  async componentDidMount() {
    let AESuserName = await storage.get("userName", "")
    let userName = CryptoJS.AES.decrypt(AESuserName, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let AESpassword = await storage.get("password", "")
    let password = CryptoJS.AES.decrypt(AESpassword, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);

    let mainHeight = await NativeModules.MyDialogModel.getMainHeight();
    let mainWidth = await NativeModules.MyDialogModel.getMainWidth();
    this.setState({
      AESuserName: AESuserName,
      userName: userName,
      AESpassword: AESpassword,
      password: password,
      token: token,
      height: mainHeight - 5,
      width: mainWidth
    })
    let member = await storage.get("member", "")
    let data = { "mb_id": member.mbId, "token": token ,"height":this.state.height}
    let _content={"type":"ClientInfo","data": data}
    NativeModules.MyDialogModel.SendMessageToUnity(
      JSON.stringify(_content)
    );
  }

  onUnityMessage(handler) {
    // alert(JSON.stringify(handler))
    if (handler.name == "hide") {
      this.setState({
        height: 0,
        width: 0
      })
    }
    if (handler.name == "OpenClientCenter") {
      this.showPerson();
    }
    if (handler.name == "ShowMall") {
      this.showMalls();
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <UnityView   
            height={this.state.height}
            width={this.state.width}
            display={this.state.modalVisible}
            
            >
          </UnityView>  

        {/* 1.1.主界面按钮 */}
        <View style={{
          position: "absolute",
          right: 50,
          top: 50,
        }}>
          <TouchableOpacity
            onPress={() => {
              this.showPerson();
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>个人中心</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.showMalls();
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>商城</Text>
          </TouchableOpacity>
          <View style={{ width: 200, margin: 20 }}>
            <Text style={{ fontWeight: 'bold', margin: 10 }}>AES用户名：{this.state.AESuserName}</Text>
            <Text style={{ fontWeight: 'bold', margin: 10 }}>AES密&nbsp;&nbsp;码：{this.state.AESpassword}</Text>
            <Text style={{ fontWeight: 'bold', margin: 10 }}>用户名：{this.state.userName}</Text>
            <Text style={{ fontWeight: 'bold', margin: 10 }}>密&nbsp;&nbsp;码：{this.state.password}</Text>
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
  component: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  }
});
