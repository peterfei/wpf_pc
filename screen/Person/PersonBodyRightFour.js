import React, { Component } from "react";
import {
  Platform, StyleSheet, Text, View, Image,
  TouchableOpacity, TextInput
} from "react-native";

import { color, screen } from "./index";
import { font, getScreen } from "../Public";
import CryptoJS from "crypto-js";
import { storage } from "../Public/storage";
import api from "../api";
import Loading from '../common/Loading'
//个人中心主体右侧

class PersonBodyRightFour extends Component {
  componentDidMount() {
    this.currMbAllDeviceIds();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  async currMbAllDeviceIds() {
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = api.base_uri_test + "pc/member/currMbAllDeviceIds?token=" + token
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
    if (this.state.deviceIds == '') {
      this.Loading.show('无Mac地址');
          this.timer = setTimeout(() => {
            this.Loading.close()
          }, 1000);
      return
    }
    let AEStoken = await storage.get("token", "")
    let token = CryptoJS.AES.decrypt(AEStoken, 'X2S1B5GS1F6G2X5D').toString(CryptoJS.enc.Utf8);
    let url = api.base_uri_test + "pc/member/clearCurrMbDeviceIds?token=" + token
    await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(resp => resp.json())
      .then(result => {
        if (result.msg == "success") {
          this.Loading.show('清除成功');
          this.timer = setTimeout(() => {
            this.Loading.close()
          }, 1000);
          this.currMbAllDeviceIds();
        } else {
          this.Loading.show('清除失败');
          this.timer = setTimeout(() => {
            this.Loading.close()
          }, 1000);
        }
      })
  }
  
  render() {
    return (
      <View style={[styles.container, color.rightBackground]}>
        {this.renderMac()}
        <TouchableOpacity
          onPress={() => this.clearCurrMbDeviceIds()}  >
          <Text style={font.font20Blue}>清空Mac地址</Text>
        </TouchableOpacity>
        <Loading ref={r=>{this.Loading = r}} hide = {true} /> 
      </View>
    )
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

module.exports = PersonBodyRightFour;
