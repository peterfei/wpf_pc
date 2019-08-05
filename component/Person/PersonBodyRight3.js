import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableHighlight, TextInput
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";

//个人中心主体右侧

class PersonBodyRight3 extends Component {
  state = {
    deviceIds: '',
  }
  componentWillMount() {
    this.currMbAllDeviceIds();
  }
  async currMbAllDeviceIds() {
    let AEStoken = await storage.get("token", "")
    let token =CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/member/currMbAllDeviceIds?token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        //alert(JSON.stringify(result) )
        this.setState({
          deviceIds: result.deviceIds
        })
      })
  }
  async clearCurrMbDeviceIds() {
    if(this.state.deviceIds==''){
      alert('无Mac地址')
      return
    }
    let AEStoken = await storage.get("token", "")
    let token =CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = "http://118.24.119.234:8087/vesal-jiepao-test/pc/member/clearCurrMbDeviceIds?token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        if(result.msg=="success"){
          alert('清除成功');
          this.currMbAllDeviceIds();
        }else{
          alert('清除失败');
        }
      })
  }
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        {this.renderMac()}
        <TouchableHighlight
          onPress={()=>this.clearCurrMbDeviceIds()}  >
          <Text style={font.font20Blue}>清空Mac地址</Text>
        </TouchableHighlight>
      </View>
    )
  }
  renderMac() {
    let itemArr = [];
    let deviceIds = this.state.deviceIds;
    for (let i = 0; i < deviceIds.length; i++) {
      itemArr.push(
        <View key={i}>
          <Text style={font.font20}>Mac:{deviceIds[i].deviceId}</Text>
        </View>
      )
    }
    return itemArr
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '83%',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

module.exports = PersonBodyRight3;
