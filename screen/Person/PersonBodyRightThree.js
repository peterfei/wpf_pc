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

class PersonBodyRightThree extends Component {
  state = {
    deviceIds: '',
  }
  componentDidMount() {
    this.currMbAllDeviceIds();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  async currMbAllDeviceIds() {
    let token = await storage.get("token", "")
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
    let token = await storage.get("token", "")
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
  
  renderMac() {
    let itemArr = [];
    let deviceIds = this.state.deviceIds;
    for (let i = 0; i < deviceIds.length; i++) {
      itemArr.push(
        <View key={i}>
          <Text style={font.font20}>Mac[{i + 1}]:&nbsp;&nbsp;&nbsp;&nbsp;{deviceIds[i].deviceId}</Text>
        </View>
      )
    }
    return itemArr
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

module.exports = PersonBodyRightThree;
