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
    width:600,
    height:600,
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
  componentDidMount(){
     //读取
    let _that = this;
    AsyncStorage.getItem("userName",function (error, result) {
      if (error) {
          console.log('读取失败')
      }else {
        //AES解密
        let bytes  = CryptoJS.AES.decrypt(JSON.parse(result), 'X2S1B5GS1F6G2X5D');
        let plaintext = bytes.toString(CryptoJS.enc.Utf8); 
        _that.setState({
            AESuserName:result,
            userName:plaintext
          })
      }
    });
    AsyncStorage.getItem("password",function (error, result) {
      if (error) {
          console.log('读取失败')
      }else {
        //AES解密
        let bytes  = CryptoJS.AES.decrypt(JSON.parse(result), 'X2S1B5GS1F6G2X5D');
        let plaintext = bytes.toString(CryptoJS.enc.Utf8); 
        _that.setState({
            AESpassword:result,
            password:plaintext
          })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
          <UnityView   
            height={this.state.height}
            width={this.state.width}
            display={this.state.modalVisible}
            opacity={0.1}
            zIndex={-9999999}
            >
          </UnityView>

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
                <Text style={{fontWeight:'bold'}}>AES用户名：{this.state.AESuserName}</Text>
                <Text style={{fontWeight:'bold'}}>AES密&nbsp;&nbsp;码：{this.state.AESpassword}</Text>
                <Text style={{fontWeight:'bold'}}>用户名：{this.state.userName}</Text>
                <Text style={{fontWeight:'bold'}}>密&nbsp;&nbsp;码：{this.state.password}</Text>
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
